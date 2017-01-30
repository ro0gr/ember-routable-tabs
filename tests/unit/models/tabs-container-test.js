import { moduleFor, test, skip } from 'ember-qunit';
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

skip('findByParams', function(assert) {
  let expectedTab = {
    id: 1,
    params: ['tab1']
  };

  let model = TabsContainer.create({ content: [expectedTab] });

  assert.deepEqual(model.findByParams(['tab1']), expectedTab);
});

test('recognize tab', function(assert) {
  let recognizer = {
    generate(routeName) {
      if (routeName === 'main.index') {
        return '/';
      }
    },

    recognize(url) {
      if (url === '/') {
        return [
          { "handler":"application", "params":{}, "isDynamic":false },
          { "handler":"main", "params":{}, "isDynamic":false },
          { "handler":"main.index", "params":{}, "isDynamic":false }
        ];
      }
    }
  };

  let subject = TabsContainer.create({
    router: { recognizer },
    content: []
  });

  let mainResult = subject._recognize({
    title: "Main",
    routeName: "main.index"
  });
  assert.deepEqual(mainResult.map(n => n.name), ['application', 'main', 'main.index']);
});

test('recognize tab with dynamic param', function(assert) {
  let recognizer = {
    generate(routeName) {
      if (routeName === 'main.customer') {
        return 'customer/1';
      }
    },

    recognize(url) {
      if (url === 'customer/1') {
        return [
          { "handler":"application", "params":{}, "isDynamic":false },
          { "handler":"main", "params":{}, "isDynamic":false },
          { "handler":"main.customer", "params":{customerId: 1}, "isDynamic": true },
          { "handler":"main.customer.index", "params":{}, "isDynamic":false }
        ];
      }
    }
  };

  let subject = TabsContainer.create({
    router: { recognizer },
    content: []
  });

  let customerResult = subject._recognize({
    title: "Customer",
    routeName: "main.customer"
  });

  assert.deepEqual(customerResult.map(n => n.name), [
    'application', 'main', 'main.customer', 'main.customer.index'
  ]);

  assert.deepEqual(customerResult.map(n => n.params), [
    {}, {}, {customerId: 1}, {}
  ]);
});
