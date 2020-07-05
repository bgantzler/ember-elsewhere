import Component from '@ember/component';
import { inject as service } from '@ember/service';
import {get} from '@ember/object';
import layout from '../templates/components/elsewhere-target';

export default Component.extend({
  layout,
  tagName: '',
  service: service('ember-elsewhere'),

  didInsertElement() {
    let name = get(this, 'name');
    get(this, 'service').registerTarget(name, {
      name,
      multiple: get(this, 'multiple'),
      element: document.querySelector(`[name='${name}']`)
    });
  },

});
