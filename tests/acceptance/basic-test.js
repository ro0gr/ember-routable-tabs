import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | basic');

test('visiting /', function(assert) {
  visit('/');

  return andThen(function() {
    let tabHandles = find('.routable-tabs--tab-handle');
    assert.equal(tabHandles.length, 1, '1 tab items rendered');
  });
});

test('visiting customer', function(assert) {
  visit('/customer/1');

  return andThen(function() {
    let tabHandles = find('.routable-tabs--tab-handle');
    assert.equal(tabHandles.length, 1, '1 tab item rendered');
  });
});

test('clicking on customer', function(assert) {
  visit('/');

  click('#customer-link-1');

  return andThen(function() {
    let tabHandles = find('.routable-tabs--tab-handle');
    assert.equal(tabHandles.length, 2, '2 tab items rendered');
  });
});
