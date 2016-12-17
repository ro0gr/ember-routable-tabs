import Ember from 'ember';

const {
  computed,
  isEmpty,
  assign,
  ArrayProxy,
  get,
  setProperties,
  inject: { service }
} = Ember;

export default ArrayProxy.extend({
  routing: service('-routing'),

  router: computed('routing', function() {
    return this.get('routing').router.router;
  }),

  assignTab(tab) {
    let incomingInfos;

    if (!tab) {
      incomingInfos = get(this, 'router').activeTransition.handlerInfos;
    } else {
      incomingInfos = this._recognize(tab);
    }

    tab = fromHandlerInfos(incomingInfos);
    let existingTab = this.findOpened(incomingInfos);

    if (!existingTab) {
      this.addObject(tab);
      existingTab = tab;
    } else {
      setProperties(existingTab, tab);
    }
  },

  _recognize({ routeName, params = null }) {
    const routeRecognizer = get(this, 'router').recognizer;

    let url = routeRecognizer.generate(routeName, params)

    let recognized = routeRecognizer.recognize(url)
    return recognized.slice().map(hi => assign({}, hi, {
      name: hi.handler
    }));
  },

  findOpened(incomingInfos) {
    return this.map(this._recognize.bind(this))
      .find(infos => this.haveSimilarRoot(infos, incomingInfos));
  },

  haveSimilarRoot(handlerInfos1, handlerInfos2) {
    let lastHI1 = handlerInfos1[handlerInfos1.length - 1];
    let lastHI2 = handlerInfos2[handlerInfos2.length - 1];

    return lastHI1.handler === lastHI2.handler;
  },

  isEmpty() {
    return !get(this, 'length');
  }
});

function getParamNames(handlerInfos) {
    return handlerInfos.reduce((prev, current) => {
      return prev.concat(get(current, '_names'));
    }, []);
}

function getParamsHash(handlerInfos) {
    return assign.apply(null, handlerInfos.map(hi => {
      return JSON.parse(JSON.stringify(hi.params));
    }));
}

function leafName(handlerInfos) {
    return handlerInfos.slice(-1).name;
}

function extractTabSettings(routeHandler) {
    let tab = get(routeHandler._handler, 'tab');

    return typeof tab === 'function' ?  tab.call(routeHandler, routeHandler.context) : tab;
}

function fromHandlerInfos(handlerInfos) {
  // merge tab settings form all the route handlers
  let tabSettingsList = handlerInfos.map(extractTabSettings)
      .filter(tab => !isEmpty(tab))
      .map(tab => JSON.parse(JSON.stringify(tab)));

  if (!tabSettingsList.length) {
    throw new Error("tab settings not found for", handlerInfos[handlerInfos.length - 1].name);
  }

  let tab = assign.apply(null, tabSettingsList);
  tab.routeName = leafName(handlerInfos);
  tab.params = getParamsHash(handlerInfos);

  return tab;
}

