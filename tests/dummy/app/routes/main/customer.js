import Ember from 'ember';

export default Ember.Route.extend({
  tab({ customer }) {
    return {
      title: `${customer.name}`
    };
  },

  model({ customerId }) {
    if (customerId === 'fail') {
      throw new Error("fail");
    }

    let customer = {
      customerId: customerId.toString(),
      name: "customer" + customerId.toString()
    };

    return {
      genders: [{
        id: 1,
        name: 'male'
      }, {
        id: 2,
        name: 'female'
      }],
      customer
    };
  }
});
