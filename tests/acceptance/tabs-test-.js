import { test, skip } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

import {
  create,
  visitable,
  fillable,
  value,
  text,
  collection,
  clickable,
  hasClass
} from 'ember-cli-page-object';

function assertTabs(assert, expectedList) {
  let expectedCountMessage = expectedList.length === 1 ?
    '1 tab item rendered' :
    `${expectedList.length} tab items rendered`;

  assert.equal(mainPage.tabs().count, expectedList.length, expectedCountMessage);

  expectedList.forEach((expectedItemTitle, pos) => {
    assert.equal(
      mainPage.tabs(pos).title, expectedItemTitle, `tab #${pos + 1} is called "${expectedItemTitle}"`
    );
  });
}

const mainPage = create({
  visit: visitable('/customers'),

  tabs: collection({
    scope: '.routable-tabs',
    itemScope: '.routable-tabs__tab-item',
    item: {
      title: text('.tab-item__title'),
      click: clickable('a'),
      close: clickable('button'),
      isActive: hasClass('active', 'a')
    }
  }),

  customers: collection({
    scope: '.customer-list',
    itemScope: 'tr',
    item: {
      name: text('customer-name'),
      click: clickable('.customers--customer-link')
    }
  })
});

const customerPage = create({
  visit: visitable('customer/:id'),

  name: text('.customer-property-name'),

  clickEdit: clickable('.customer-edit-link')
});

const customerEditPage = create({
  visit: visitable('customer/:id/edit'),

  name: {
    scope: '#customer-name',
    fill: fillable(),
    value: value()
  },

  submit: clickable('.save-button'),
  clickBack: clickable('.back-link')
});

moduleForAcceptance('Acceptance | basic');

// @todo: check is active
test('Opens "All Customers" tab by default', function(assert) {
  mainPage.visit();
  return andThen(() => assertTabs(assert, ['All Customers']));
});

// @todo: check is active
test('opens resource tab on visit', function(assert) {
  customerPage.visit({ id: '1' });

  return andThen(() => assertTabs(assert, [
    'Main', 'customer1'
  ]));
});

test('click on a tab', function(assert) {
  customerPage.visit({id: '1'});

  return andThen(() => {
    mainPage.tabs(0).click();
  }).then(() => assertTabs(assert, [
    'Main', 'customer1'
  ])).then(() => {
    // @todo: check is active !important
    assert.equal(currentURL(), '/', 'redirected to main page');
  });
});

skip('close first tab when active', function() {
  // @todo: should check that the active tab changed to the next tab
});

skip('close the last tab', function() {
  // @todo: should check that there are no tabs rendered
});

test('close active tab. switches to previous tab', function(assert) {
  customerPage.visit({id: '1'});

  andThen(() => {
    assert.ok(mainPage.tabs(1).isActive);
    mainPage.tabs(1).close();
  })

  return andThen(() => {
    assert.ok(mainPage.tabs(0).isActive);
    assertTabs(assert, [ 'Main' ])
    assert.equal(currentURL(), '/', 'redirected to main page');
  })
});

test('close innactive tab. stays on the same tab', function(assert) {
  customerPage.visit({id: '1'});
  customerPage.visit({id: '2'});

  andThen(() => {
    assert.ok(mainPage.tabs(2).isActive);
    mainPage.tabs(1).close();
  })

  return andThen(() => {
    assert.ok(mainPage.tabs(1).isActive);
    assertTabs(assert, [ 'Main', 'customer2' ])
    assert.equal(currentURL(), 'customer/2', 'redirected to main page');
  })
});

test('subroute: go back and forth', function(assert) {
  customerPage.visit({id: '1'});
  customerEditPage.visit({id: '1'});

  return andThen(() => {
    assert.equal(mainPage.tabs(1).title, 'customer1 editor', 'tab changed to editor mode')

    customerPage.visit({id: 1});
  }).then(() => {
    assert.equal(mainPage.tabs(1).title, 'customer1', 'tab restored to view mode')
  });
});

test('should reload tab content on reveisit', function(assert) {
	customerEditPage.visit({ id: '1' });

	return andThen(() => {
		customerEditPage.name.fill("new name");
	})
	.then(() => {
		mainPage.visit();
		customerEditPage.visit({id: '1'});
	})
	.then(() => {
		assertTabs(assert, ['Main', 'customer1 editor']);
		assert.equal(customerEditPage.name.value, 'customer1', 'tab restored to view mode')
	});
});
