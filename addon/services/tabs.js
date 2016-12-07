import Ember from 'ember';
import TabsContainer from 'ember-routable-tabs/models/tabs-container';

const { A } = Ember;

export default Ember.Service.extend({
  init() {
    this._items = {};
  },

  containerFor(containerId) {
    if (!this._items[containerId]) {
      this._items[containerId] = TabsContainer.create({
        content: A([])
      });
    }
    return this._items[containerId];
  }
});
