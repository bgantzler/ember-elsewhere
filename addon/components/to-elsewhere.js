import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import {get, set, computed} from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/to-elsewhere';

export default Component.extend({
  layout,
  service: service('ember-elsewhere'),
  tagName: '',
  sourceId: computed(function() {
    return guidFor(this);
  }),
  didReceiveAttrs() {
    if (get(this, 'name')) {
      throw new Error(`to-elsewhere takes a "named=" parameter, not "name="`);
    }

    if (!get(this, 'send') && get(this, 'sendToPortal') === undefined) {
      throw new Error(`to-elsewhere must be passed a "send" component or a "sendToPortal" boolean`);
    }

    if (get(this, 'send') && get(this, 'sendToPortal') === undefined) {
      set(this, 'sendToPortal', true);
    }

    this.get('service').show(get(this, 'sourceId'), this.get('named'), this.get('send'), this.get('outsideParams'), this.get('order'));
  },
  willDestroyElement() {
    get(this, 'service').clear(get(this, 'sourceId'));
  }

});
