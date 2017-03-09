import Ember from 'ember';
import TabsContainer from 'ember-routable-tabs/models/tabs-container';

const { A, setOwner, getOwner } = Ember;

export default Ember.Service.extend({
  init() {
    this._items = {};
  },

  containerFor(containerId) {
    if (!this._items[containerId]) {
      this._items[containerId] = TabsContainer.create({
        'name': containerId,
        content: A([])
      });
      let owner = getOwner(this);
      setOwner(this._items[containerId], owner);
    }
    return this._items[containerId];
  }
});
