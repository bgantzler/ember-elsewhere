import Component from '@ember/component';
import layout from '../templates/components/elsewhere-portal';
import {computed} from '@ember/object';
import { schedule } from '@ember/runloop';
import { Promise } from 'rsvp';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  service: service('ember-elsewhere'),
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
  }),
  targetAppend: computed('name', function() {
    let target = this.get('service').targetFor(this.get('name'));
    return target ? target.options.append : false;
  })

});
