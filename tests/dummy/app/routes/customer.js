import Ember from 'ember';

const { assign } = Ember;

import { customers } from './customers';

const genders = [{
  id: 1,
  name: 'male'
}, {
  id: 2,
  name: 'female'
}];

export default class extends Ember.Route{
  tab({ customer }) {
    return {
      title: `${customer.name}`
    };
  }

  model({ customerId }) {
    const customer = customers
      .find(c => c.customerId == customerId);

    return {
      genders,
      customer: assign({}, customer)
    };
  }
}
