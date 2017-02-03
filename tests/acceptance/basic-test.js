import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

import {
  create,
  visitable,
  fillable,
  value,
  text,
  collection,
  clickable
} from 'ember-cli-page-object';

let mainPage = create({
  visit: visitable('/'),

  tabs: collection({
    scope: '.routable-tabs',
    itemScope: '.routable-tabs__tab-item',
    item: {
      title: text(),
      click: clickable('a')
    }
  }),

  customers: collection({
    scope: '.customer-list',
    itemScope: 'tr',
    item: {
      name: text('customer-name'),
      click: clickable('.main--customer-link')
    }
  })
});

let customerPage = create({
  visit: visitable('customer/:id'),

  name: text('.customer-property-name'),

  clickEdit: clickable('.customer-edit-link')
});

let customerEditPage = create({
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

test('visiting /', function(assert) {
  mainPage.visit();

  return andThen(() => assertTabs(assert, ['Main']));
});

test('visiting /customer/1', function(assert) {
  customerPage.visit({ id: '1' });

  return andThen(() => assertTabs(assert, [
    'Main', 'customer1'
  ]));
});

test('click on customer link', function(assert) {
  mainPage.visit('/').customers(0).click();

  return andThen(() => assertTabs(assert, [
    'Main', 'customer1'
  ])).then(() => {
    mainPage.visit('/').customers(1).click();
  }).then(() => assertTabs(assert, [
    'Main', 'customer1', 'customer2'
  ]));
});

test('click on a tab', function(assert) {
  customerPage.visit({id: '1'});

  return andThen(() => assertTabs(assert, [
    'Main', 'customer1'
  ])).then(() => {
    mainPage.tabs(0).click();
  }).then(() => assertTabs(assert, [
    'Main', 'customer1'
  ])).then(() => {
    assert.equal(currentURL(), '/', 'redirected to main pagekkk');
  });
});

test('subroute: go back and forth', function(assert) {
  customerPage.visit({id: '1'});
  customerEditPage.visit({id: '1'});

  return andThen(() => {
		assert.equal(mainPage.tabs(1).title, 'customer1 editor', 'tab changed to editor mode')

    customerPage.visit({id: '1'});
	})
  .then(() => {
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
	}).then(() => {
    assertTabs(assert, ['Main', 'customer1 editor']);
		assert.equal(customerEditPage.name.value, 'customer1', 'tab restored to view mode')
  });

});

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

