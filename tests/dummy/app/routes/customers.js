import Ember from 'ember';

export const customers = [1, 2, 3].map(customerId => {
  return {
    customerId: customerId.toString(),
    name: "customer" + customerId.toString()
  }
});

export default class extends Ember.Route {
    init() {
        this.tab = { title: 'All Customers', }
    }

    model() { return customers; }
}
