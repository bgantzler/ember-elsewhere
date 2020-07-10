import Component from '@ember/component';
import { inject as service } from '@ember/service';
import {get, set} from '@ember/object';
import layout from '../templates/components/elsewhere-target';
import { guidFor } from '@ember/object/internals';

export default Component.extend({
  layout,
  tagName: '',
  service: service('ember-elsewhere'),
  targetElement: undefined,

  getOptions() {
    let name = get(this, 'name');
    return {
      targetId: get(this, 'targetId'),
      name,
      multiple: get(this, 'multiple'),
      targetElement: get(this, 'targetElement')
    };
  },

  didInsertElement() {
    let name = get(this, 'name');
    set(this, 'targetElement', document.querySelector(`[name='${name}']`));
    get(this, 'service').registerTarget(this.getOptions(name) );
  },
  willDestroy() {
    let name = get(this, 'name');
    this.get('service').deregisterTarget(this.getOptions(name));
  }

});
