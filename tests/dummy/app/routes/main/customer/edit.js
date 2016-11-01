import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this._super(...arguments);
  },

  setupController(controller, model) {
    this._super(...arguments);
    let { customer } = model;
    controller.title = `Edit ${customer.name}`;
  }
});
