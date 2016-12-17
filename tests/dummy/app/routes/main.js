import Ember from 'ember';

const {
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

export default Ember.Route.extend({
  tabs: service(),

  tab: {
    title: 'Main'
  },

  model() {
    return new Ember.RSVP.Promise((r) => {
      r(activities);
    });
  },

  setupController(controller) {
    this._super(...arguments);

    const tabs = get(this, 'tabs')
      .containerFor(this.routeName)

    tabs.assignTab({
      title: 'Main',
      routeName: 'main.index'
    });

    set(controller, 'tabs', tabs);
  },

  actions: {
    didTransition() {
      get(this.controller, 'tabs').assignTab();

      return true;
    }
  }
});

