import { moduleFor, test } from 'ember-qunit';
import TabsContainer from 'ember-routable-tabs/models/tabs-container';

moduleFor('model:tabs-container', 'Unit | Model | tabs container');

test('recognize tab', function(assert) {
	let recognizer = createRecognizer([
		{ name: "main" },
		{ name: "main.index", path: '/' }
	]);

	let subject = TabsContainer.create({
		_routerMicrolib: { recognizer },
		content: []
	});

	let mainResult = subject._recognize({
		title: "Main",
		routeName: "main.index"
	});

	assert.deepEqual(mainResult.map(n => n.name), ['application', 'main', 'main.index']);
});

test('recognize tab with dynamic param', function(assert) {
	let recognizer = createRecognizer([
		{ "name": "main" },
		{
			"name": "main.customer",
			"params": {	customerId: 1 },
			path: 'customer/1'
		},
		{ "name": "main.customer.index"	}
	]);

	let subject = TabsContainer.create({
		_routerMicrolib: { recognizer },
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

function serializeRoute({name, params = {}, path = undefined}) {
	return {
		"handler": name,
		params,
		"isDynamic": Object.keys(params).length > 0,
		path
	};
}

function createRecognizer(routes = []) {
	let routeMap = [
		serializeRoute({
			name: "application"
		})
	].concat(routes.map(serializeRoute));

	return {
		list() {
			return routeMap;
		},

		generate(routeName) {
			let routeHandler = routeMap.find(r => r.handler === routeName);

			return routeHandler.path;
		},

		recognize(url) {
			if (routeMap.find(r => r.path === url)) {
				return routeMap;
			}
		}
	};
}
