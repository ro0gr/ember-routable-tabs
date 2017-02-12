import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { create, collection, text, clickable } from 'ember-cli-page-object';

const tabs = create({
	scope: '.routable-tabs',
	
    items: collection({
		itemScope: '.routable-tabs__tab-item',
		item: {
			title: text(),
			click: clickable('a')
		}
	}),

});

moduleForComponent('routable-tabs', 'Integration | Component | routable tabs', {
  integration: true,
  
  beforeEach() {
		tabs.setContext(this);
  },
  
  afterEach() {
		tabs.removeContext(this);
  }
});

test('renders empty tab list', function(assert) {
  this.tabs = []

  // Template block usage:
  this.render(hbs`
    {{routable-tabs tabs=tabs}}
  `);

  assert.ok(tabs.isVisible);
  assert.equal(tabs.items().count, 0);
});

test('it renders', function(assert) {
  this.tabs = [{
    linkParams: ['test'],
    title: 'tab 1'
  }, {
    linkParams: ['test2'],
    title: 'tab 2'
  }]

  // Template block usage:
  this.render(hbs`
    {{routable-tabs tabs=tabs}}
  `);

  assert.equal(tabs.items(0).title, 'tab 1');
  assert.equal(tabs.items(1).title, 'tab 2');
  assert.equal(tabs.items().count, 2);
});


test('it renders contextual tab items', function(assert) {
  this.tabs = [{
    linkParams: ['test'],
    title: 'tab 1',
	status: 'ok'
  }, {
    linkParams: ['test2'],
    title: 'tab 2',
	status: 'super-duper!'
  }]

  // Template block usage:
  this.render(hbs`
    {{#routable-tabs tabs=tabs as |c|}}
		{{#c.tabItem as |d|}}
			{{d.title}} - {{d.status}}
		{{/c.tabItem}}
	{{/routable-tabs}}
  `);

  assert.equal(tabs.items(0).title, 'tab 1 - ok');
  assert.equal(tabs.items(1).title, 'tab 2 - super-duper!');
  assert.equal(tabs.items().count, 2);
});