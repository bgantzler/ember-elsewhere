import Component from '@ember/component';
import layout from '../templates/components/elsewhere-portal';
import {computed} from '@ember/object';
import { schedule } from '@ember/runloop';
import { Promise } from 'rsvp';

export default Component.extend({
  layout,
  tagName: '',

  initialized: false,

  init() {
    this._super();

    new Promise(resolve => {
      schedule('afterRender', () => {
        if (!this.isDestroyed) {
          this.set('initialized', true);
        }
        resolve();
      });
    });
  },

  targetElement: computed('name', function() {
    return document.querySelector(`[name='${this.name}']`);
  })
});
