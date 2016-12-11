import Ember from 'ember';

const {
  ArrayProxy,
  get,
  setProperties
} = Ember;

export default ArrayProxy.extend({
  isEmpty() {
    return !get(this, 'length');
  },

  assignTab(tab) {
    let existingTab = this.findByParams(tab.params);
    if (!existingTab) {
      this.addObject(tab);
      existingTab = tab;
    } else {
      setProperties(existingTab, tab);
    }
  },

  findByParams(params = []) {
    if (!params || !params.length) {
      throw new Error('params not specified');
    }

    const [routeName, model] = params;
    if (model) {
      return this.find((currentTab) => currentTab.params[1] === model);
    } else {
      return this.find((currentTab) => currentTab.params[0] === routeName);
    }
  }
});
