import { moduleFor, test } from 'ember-qunit';
import TabsContainer from 'ember-routable-tabs/models/tabs-container';

moduleFor('model:tabs-container', 'Unit | Model | tabs container');

test('Init with empty content', function(assert) {
  let model = TabsContainer.create({content: []});
  assert.ok(model.isEmpty(), 'is empty');
});

test('Init with one item', function(assert) {
  let model = TabsContainer.create({content: [{}]});
  assert.notOk(model.isEmpty(), 'is not empty');
});

