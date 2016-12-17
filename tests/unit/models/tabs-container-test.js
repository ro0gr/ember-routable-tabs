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

test('findByParams', function(assert) {
  let expectedTab = {
    id: 1,
    params: ['tab1']
  };

  let model = TabsContainer.create({ content: [expectedTab] });

  assert.deepEqual(model.findByParams(['tab1']), expectedTab);
});

