import Ember from 'ember';

const { get } = Ember;

export default Ember.Route.extend({
  model() {
    return [{
      name: "activity 1",
      customerId: 1
    }, {
      name: "activity 2",
      customerId: 2
    }, {
      name: "activity 3",
      customerId: 3
    }];
  },

  setupController(controller, model) {
    this._super(...arguments);
    this.controller.tabs = Ember.ArrayProxy.create({
      content: Ember.A([])
    });
    this.controller.title = 'Main';
  },

  actions: {
    didTransition() {
      let handlerInfos = this.router.router.currentHandlerInfos;
      const lastSegment = handlerInfos[handlerInfos.length - 1];

      let routeParams = handlerInfos.reduce((prev, current) => {
          return prev.concat(get(current, '_names').map((name) => current.params[name]));
      }, []);

      let routeName = lastSegment.name;

      routeParams.unshift(routeName);

      let title = handlerInfos.slice().reverse()
        .map(hi => hi.handler.controller.title)
        .find((title) => !!title);

      let id = routeParams.join('_');
      let foundTab = this.controller.tabs.find(t => t.id === id);

      if (title && !foundTab) {
        this.controller.tabs.addObject({ id, title, routeParams });
      }

      return true;
    }
  }
});
