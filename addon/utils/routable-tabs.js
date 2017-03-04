import Ember from 'ember';

const {
  getOwner,
  computed
} = Ember;


/**
 * Returns tabs root container 
 *
 * @param	{string}	name	root name
 * @return	{Model.TabsContainer}
 */
export default function routableTabs(name) {
  return computed(function() {
    return getOwner(this)
      .lookup('service:tabs')
      .containerFor(name);
  })
}
