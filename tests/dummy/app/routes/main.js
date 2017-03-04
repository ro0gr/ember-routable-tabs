import Ember from 'ember';

const {
  set,
  get
} = Ember;

import routableTabs from '../utils/routable-tabs';

const activities = [{
  name: "activity 1", customerId: 1
}, {
  name: "activity 2", customerId: 2
}, {
  name: "activity 3", customerId: 3
}];

export default Ember.Route.extend({
  tabs: routableTabs('main'),

  model() {
    return activities;
  },

  setupController(controller) {
    this._super(...arguments);

    set(controller, 'tabs', get(this, 'tabs'));

    get(this, 'tabs').assignTab({
      title: 'Main',
      routeName: this.routeName
    });
  },

  actions: {
    didTransition() {
      get(this, 'tabs').assignTab()
    }
  }
});
