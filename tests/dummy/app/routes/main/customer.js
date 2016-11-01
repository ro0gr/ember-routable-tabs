import Ember from 'ember';

export default Ember.Route.extend({
  model({customerId}) {
    let customer = {
      customerId: customerId.toString(),
      name: "customer" + customerId.toString()
    }
    return {
      genders: [{
        id: 1,
        name: 'male'
      }, {
        id: 2,
        name: 'female'
      }],
      customer
    }
  },

  setupController(c, m) {
    this._super(...arguments);
    let { customer } = m;

    c.title = `Customer ${customer.name}`
  }
});
