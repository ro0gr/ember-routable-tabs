import Ember from 'ember';

const {
    set,
    get
} = Ember;

import routableTabs from 'ember-routable-tabs/utils/routable-tabs';

const AppRouteBase = Ember.Route.extend({
    actions: {
        didTransition() {
            this.tabs.attach()
        },

        closeTab(tab, e) {
            e.preventDefault();
            e.stopPropagation();
            this.tabs.detach(tab);

            return false;
        }
    }
});

export default class AppRoute extends AppRouteBase {
    init() {
        this._tabs = routableTabs('main');
    }

    get tabs() {
        return get(this, '_tabs');
    }

    setupController(controller) {
        super.setupController(...arguments);

        set(controller, 'tabs', this.tabs);

        this.tabs.attach({
            title: 'Main',
            routeName: 'application',
            sticky: true
        })
    }
}
