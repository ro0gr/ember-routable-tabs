import Ember from 'ember';

export default Ember.Route.extend({
  tab({ customer }) {
    return {
      title: `Edit ${customer.name}`
    }
  }
});
