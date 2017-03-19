import Ember from 'ember';

const {
	get
} = Ember;

import routableTabs from '../utils/routable-tabs';

export default Ember.Controller.extend({
	tabs: routableTabs('main'),

	actions: {
		closeTab(tab, e) {
      e.preventDefault();
      e.stopPropagation();

			get(this, 'tabs').detach(tab);

			return false;
		}
	}
});
