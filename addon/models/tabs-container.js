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
  name: '',

  routing: service('-routing'),

  _routerMicrolib: computed('routing', function() {
    return this.get('routing').router.router;
  }),

  activeNavInfo() {
      const currentInfos = get(this, '_routerMicrolib').currentHandlerInfos;

      return {
        routeName: leafName(currentInfos),
        params: getParamsHash(currentInfos)
      };
  },

  attach(navItem) {
    if (!navItem) {
      navItem = this.activeNavInfo();
    }

    const incomingInfos = this._recognize(navItem);
    navItem.linkParams = [ navItem.routeName ].concat(getParamsValues(incomingInfos));

    const navSettings = extractTabSettingsFromHandlerInfos.call(this, incomingInfos);

    assign( navItem, navSettings );

    let existing = this.find(
      tab => sameResource(incomingInfos, this._recognize(tab))
    );

    if (!existing) {
      this.addObject(navItem);
    } else {
      // @todo: replace?
      setProperties(existing, navItem);
    }
  },

  detach(tab) {
    // const router = this.get('_routerMicrolib');
    const router = this.get('routing').router;
    const isTabActive = router.isActive.apply(router, tab.linkParams);
    const pos = this.indexOf(tab);
    this.removeObject(tab);

    if (isTabActive) {
      let prevTab = this.objectAt(pos > 0 ? pos - 1 : pos);
      if (prevTab) {
        router.replaceWith.apply(router, prevTab.linkParams);
      } else { // all tabs are delete
        router.replaceWith([this.name]);
      }
    }
  },

  // @todo: test
  _recognize({ routeName, params = null }) {
    const routeRecognizer = get(this, '_routerMicrolib').recognizer;

    const url = routeRecognizer.generate(routeName, params);
    const recognized = routeRecognizer.recognize(url);

    return recognized.slice().map(
      hi => assign({}, hi, {
        name: hi.handler
      })
    );
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

function sameResource(handlerInfos1, handlerInfos2) {
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
    // tab.call(routeHandler, routeHandler.context) :
    tab.call(routeHandler, routeHandler.controller.model) :
    tab;
}

function extractTabSettingsFromHandlerInfos(handlerInfos) {
  const owner = getOwner(this);

  let settingsPerTab = handlerInfos
    .map(routeHandler => owner.lookup(`route:${routeHandler.handler}`))
    .filter(handler => !isEmpty(handler))
    .map(readTabSettingsFromRouteHandler)
    .filter(tab => !isEmpty(tab))
    .map(tab => JSON.parse(JSON.stringify(tab)));

  return assign.apply(this, [{}].concat(settingsPerTab));
}
