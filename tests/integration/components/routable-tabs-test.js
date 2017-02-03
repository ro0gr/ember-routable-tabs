import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('routable-tabs', 'Integration | Component | routable tabs', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.tabs = [{
    linkParams: ['test'],
    title: 'tab 1'
  }]

  // Template block usage:
  this.render(hbs`
    {{routable-tabs tabs=tabs}}
  `);

  assert.equal(this.$().text().trim(), 'tab 1');
});
