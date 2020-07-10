import Component from '@ember/component';
import layout from '../templates/components/elsewhere-portal';
import {computed, get} from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  service: service('ember-elsewhere'),
  tagName: '',

  target: computed('name', 'service.targets', function() {
    let target = get(this, `service.targets.${get(this, 'name')}`) || {};
    return target[get(this, 'targetId')];
  }),

});
