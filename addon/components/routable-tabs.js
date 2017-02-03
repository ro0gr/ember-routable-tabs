import Ember from 'ember';
import layout from '../templates/components/routable-tabs';

export default Ember.Component.extend({
  classNameBindings: ['blockName'],

  layout,

  blockName: 'routable-tabs',

  tagName: 'ul'
});
