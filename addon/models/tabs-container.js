import Ember from 'ember';

const {
  computed,
  isEmpty,
  assign,
  ArrayProxy,
  get,
  setProperties,
  getOwner
} = Ember;

const { service } = Ember.inject;

export default ArrayProxy.extend({
  routing: service('-routing'),

  _routerMicrolib: computed('routing', function() {
    return this.get('routing').router.router;
  }),

  assignTab(tab) {
    if (!tab) {
      let currentInfos = get(this, '_routerMicrolib').currentHandlerInfos;
      tab = {
        routeName: leafName(currentInfos),
        params: getParamsHash(currentInfos)
      };
    }

    let incomingInfos = this._recognize(tab);
    assign(tab, extractTabSettingsFromHandlerInfos.call(this, incomingInfos));

    tab.linkParams = [tab.routeName].concat(getParamsValues(incomingInfos));

    let existingTab = this.findOpened(incomingInfos);
    if (!existingTab) {
      this.addObject(tab);
    } else {
      setProperties(existingTab, tab);
    }
  },

  detach(tab) {
	this.removeObject(tab);  
  },
  
  // @todo: test
  _recognize({ routeName, params = null }) {
    const routeRecognizer = get(this, '_routerMicrolib').recognizer;

    let url = routeRecognizer.generate(routeName, params);
    let recognized = routeRecognizer.recognize(url);
	
	return recognized.slice().map(
		hi => assign({}, hi, {
			name: hi.handler
		})
	);
  },

  findOpened(incomingInfos) {
    return this.find(
      tab => commonRoot(incomingInfos, this._recognize(tab))
    );
  },

  isEmpty() {
    return !get(this, 'length');
  }
});

function lastIndexWithParams(handlerInfos) {
  let i = -1;

  handlerInfos.forEach((hi, pos) => {
    if (!Ember.isEmpty(hi.params)) {
      i = pos;
    }
  });

  return i;
}

function commonRoot(handlerInfos1, handlerInfos2) {
  let lastIndexWithParams1 = lastIndexWithParams(handlerInfos1),
    lastIndexWithParams2 = lastIndexWithParams(handlerInfos2);

  if (lastIndexWithParams1 !== lastIndexWithParams2) {
    return false;
  }

  for (let i = 0; i < lastIndexWithParams1; i++) {
    if (handlerInfos1[i].handler !== handlerInfos2[i].handler) {
      return false;
    }

    if (JSON.stringify(handlerInfos1[i].params) !== JSON.stringify(handlerInfos2[i].params)) {
      return false;
    }
  }

  return true;
}

function getParamsHash(handlerInfos) {
	return assign.apply(null, getParams(handlerInfos));
}

function getParamsValues(handlerInfos) {
    return Array.prototype.concat.apply(
      [], getParams(handlerInfos).map(segmentParams => {
        return Object.values(segmentParams);
      })
    );
}

function getParams(handlerInfos) {
    return handlerInfos.map(hi => {
      return JSON.parse(JSON.stringify(hi.params));
    });
}

function leafName(handlerInfos) {
    return handlerInfos.slice(-1)[0].name;
}

function readTabSettingsFromRouteHandler(routeHandler) {
  let tab = get(routeHandler, 'tab');

  return typeof tab === 'function' ?
    tab.call(routeHandler, routeHandler.context) :
    tab;
}

function extractTabSettingsFromHandlerInfos(handlerInfos) {
  const owner = getOwner(this);

  let settingsPerTab = handlerInfos
    .map((routeHandler) => owner.lookup(`route:${routeHandler.handler}`))
    .map(readTabSettingsFromRouteHandler)
    .filter(tab => !isEmpty(tab))
    .map(tab => JSON.parse(JSON.stringify(tab)));

  return assign.apply(this, [{}].concat(settingsPerTab));
}
