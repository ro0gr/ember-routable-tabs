import { collection, text, clickable } from 'ember-cli-page-object';

export default {
  scope: '.routable-tabs',

  items: collection({
    itemScope: '.routable-tabs__tab-item',
    item: {
      title: text(),
      click: clickable('a')
    }
  })

};
