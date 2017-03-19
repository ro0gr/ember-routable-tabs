import Ember from 'ember';

const {
  set,
  get
} = Ember;

import routableTabs from '../utils/routable-tabs';

// @todo: mirage
const activities = [{
  name: "activity 1", customerId: 1
}, {
  name: "activity 2", customerId: 2
}, {
  name: "activity 3", customerId: 3
}];

export default Ember.Route.extend({
  tabs: routableTabs('main'),

  init() {
    this._tabs = get(this, 'tabs');
  },

  model() {
    return activities;
  },

  setupController(controller) {
    this._super(...arguments);

    set(controller, 'tabs', this._tabs);

    this._tabs.attach({
      title: 'Main',
      sticky: true,
      routeName: `${this.routeName}.index`
    });
  },

  actions: {
    didTransition() {
      this._tabs.attach()
    }
   }
});
