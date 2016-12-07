import Ember from 'ember';

const {
  isEmpty,
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

function extractTabSettings(routeHandler) {
    let tab = get(routeHandler._handler, 'tab');

    return typeof tab === 'function' ?
      tab.call(routeHandler, routeHandler.context) :
      tab;
}

function fromHandlerInfos(handlerInfos) {
  // merge tab settings form all the route handlers
  let tabSettingsList = handlerInfos.map(extractTabSettings)
      .filter(tab => !isEmpty(tab))
      .map(tab => JSON.parse(JSON.stringify(tab)));

  if (!tabSettingsList.length) {
    throw new Error("tab settings not found for", handlerInfos[handlerInfos.length - 1].name);
  }

  let tab = assign.apply(null, tabSettingsList);

  tab.params = buildUrlParams(handlerInfos);

  return tab;
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
    set(this.controller, 'tabs', tabs);
  },

  actions: {
    didTransition() {
      let tabs = get(this.controller, 'tabs');

      if (tabs.isEmpty()) {
        tabs.assignTab({
          title: 'Main',
          params: ['main.index']
        });
      } else {
        tabs.assignTab(
          fromHandlerInfos(this.router.router.currentHandlerInfos)
        );
      }

      return true;
    }
  }
});

