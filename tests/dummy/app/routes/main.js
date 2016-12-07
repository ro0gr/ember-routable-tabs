import Ember from 'ember';

const {
  assign,
  set,
  get,
  inject: { service }
} = Ember;

const activities = [{
  name: "activity 1", customerId: 1
}, {
  name: "activity 2", customerId: 2
}, {
  name: "activity 3", customerId: 3
}];

/*
 * Looks up for a title in handler infos in reverse order.
 * Search continues until a title is found in controller or route handler
 *
 * @param {array} handlerInfos
 * @return {string} found title or undefined
 */
function findTitle(handlerInfos) {
  return handlerInfos.slice().reverse()
    .map(hi => get(hi.handler, 'title') || get(hi.handler.controller, 'title'))
    .find((title) => !!title);
}

/**
 * Build route params for tab from handlerInfos
 *
 * @param {array} handlerInfos
 * @return [routeName, routeModel?] Tab params
 */
function buildUrlParams(handlerInfos) {
    let [lastSegment] = handlerInfos.slice(-1);
    let urlParams = [lastSegment.name];

    let routeParams = assign.apply(null, handlerInfos.map(hi => {
      return JSON.parse(JSON.stringify(hi.params));
    }));

    let hasRouteParams = Object.keys(routeParams).length > 0;

    if (hasRouteParams) {
      urlParams.push(assign(lastSegment.context, routeParams));
    }

    return urlParams;
}

function fromHandlerInfos(handlerInfos) {
  return {
    title: findTitle(handlerInfos),
    params: buildUrlParams(handlerInfos)
  };
}

export default Ember.Route.extend({
  tabs: service(),
  // tabs: routableTabs(),

  model() {
    return new Ember.RSVP.Promise((r) => {
      r(activities);
    });
  },

  setupController(controller) {
    this._super(...arguments);

    let tabs = this.get('tabs').containerFor(this.routeName);

    controller.title = 'Main';

    tabs.assignTab({
      title: 'Main',
      params: ['main.index']
    });

    set(this.controller, 'tabs', tabs);
  },

  actions: {
    didTransition() {
      let tabs = get(this, 'tabs').containerFor(this.routeName);

      tabs.assignTab(
        fromHandlerInfos(this.router.router.currentHandlerInfos)
      );

      return true;
    }
  }
});

