import Ember from 'ember';
import layout from '../../templates/components/routable-tabs/tab-item';

export default Ember.Component.extend({
  classNameBindings: ['elementName'],

  layout,

  elementName: 'routable-tabs__tab-item',

  tagName: 'li'
});
