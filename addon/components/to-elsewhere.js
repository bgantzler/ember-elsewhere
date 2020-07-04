import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from '../templates/components/to-elsewhere';

export default Component.extend({
  layout,
  service: service('ember-elsewhere'),
  tagName: '',
  // Its unfortunate send was used as a param name as there is a function named send on Component
  send: null,
  didReceiveAttrs() {
    if (this.get('name')) {
      throw new Error(`to-elsewhere takes a "named=" parameter, not "name="`);
    }
    this.get('service').show(guidFor(this), this.get('named'), this.get('send'), this.get('outsideParams'), this.get('order'));
  },
  willDestroyElement() {
    this.get('service').clear(guidFor(this));
  }

});
