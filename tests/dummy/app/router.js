import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('main', { path: '/' }, function() {
    this.route('customer', { path: '/customer/:customerId' }, function() {
      this.route('edit');
    });

    this.route('accounts', function() {
      this.route('add');
      this.route('view', { path: 'view/:id' });
      this.route('edit', { path: 'edit/:id' });
    });
  });
});

export default Router;
