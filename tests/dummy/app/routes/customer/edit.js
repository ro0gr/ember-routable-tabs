import Ember from 'ember';

export default class extends Ember.Route {
  tab({ customer }) {
    return {
      title: `${customer.name} editor`
    }
  }
}
