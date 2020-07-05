import Service from '@ember/service';
import { run } from '@ember/runloop';
import EmObject from '@ember/object';
import { A as emArray } from '@ember/array';

export default Service.extend({
  init() {
    this._super();
    this.set('actives', EmObject.create());
    this._alive = {};
    this._targets = {};
    this._counter = 1;
  },

  registerTarget(name, options) {
    this._targets[name] = {
      name,
      options
    };
  },

  deregisterTarget(name) {
    delete this._targets[name];
  },

  targetFor(name) {
    return this._targets[name];
  },

  show(sourceId, name, component, outsideParams, order = 0) {
    // if current component has specific order that is greater than current internal count
    // update internal count so any subsequent component that does not provide order will
    // be after.
    if (this._counter < order) {
      this._counter = order + 1
    }
    this._alive[sourceId] = {
      target: name || 'default',
      component,
      order: order || this._counter++,
      outsideParams
    };
    this._schedule();
  },

  clear(sourceId) {
    delete this._alive[sourceId];
    this._schedule();
  },

  _schedule() {
    run.scheduleOnce('afterRender', this, this._process);
  },

  _process() {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    // this is for {{multiple-from-elsewhere}}
    this.set('actives', this._createActives());
    // this is for {{from-elsewhere}}
    this.set('activeInfo', this._createActiveInfo());
  },

  _createActiveInfo() {
    let activeInfo = {};

    Object.keys(this._alive).forEach((sourceId) => {
      let { target } = this._alive[sourceId];
      activeInfo[target] = this._alive[sourceId];
    });

    return activeInfo;
  },

  _createActives() {
    let newActives = {};
    let alive = this._alive;

    Object.keys(alive).forEach((sourceId) => {
      let { target, component, order, outsideParams } = alive[sourceId];
      newActives[target] = newActives[target] || emArray();
      let newActive = {component, order, outsideParams};
      newActives[target].push(newActive);
    });
    Object.keys(newActives).forEach((target) => {
      newActives[target] = emArray(newActives[target].sortBy('order'));
    });

    return EmObject.create(newActives);
  }
});
