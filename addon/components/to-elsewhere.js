import { guidFor } from '@ember/object/internals';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import {get, computed} from '@ember/object';
import { next } from '@ember/runloop';
import layout from '../templates/components/to-elsewhere';

export default Component.extend({
  layout,
  service: service('ember-elsewhere'),
  tagName: '',
  // Its unfortunate send was used as a param name as there is a function named send on Component
  send: null,
  show([options]) {
    options.sourceId = get(this, 'sourceId');
    console.log("show", options);
    get(this, 'service').show(options);
  },

  sourceId: computed(function() {
    return guidFor(this);
  }),

  didReceiveAttrs() {
    if (this.get('name')) {
      throw new Error(`to-elsewhere takes a "named=" parameter, not "name="`);
    }
    // next(() => {
    //   console.log("show comp for target ", this.get('named'));
    //
    //   this.get('service').show(
    //     guidFor(this),
    //     this.get('named'),
    //     this.get('send') || this.get("targetPortal"),
    //     this.get('outsideParams'),
    //     this.get('order')
    //   );
    // });
  },
  willDestroyElement() {
    get(this, 'service').clear(get(this, 'sourceId'));
  },

});
