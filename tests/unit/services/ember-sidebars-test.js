import { typeOf } from '@ember/utils';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Service | ember elsewhere', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.service = this.owner.lookup('service:ember-elsewhere@ember-elsewhere');
  })

  test('it exposes currently active component', function(assert) {
    let component = {};

    run(() => {
      this.service.show('source', 'my-sidebar', component);
    });

    assert.equal(typeOf(this.service.get('actives.my-sidebar')), 'array', 'it returns an array');
    assert.equal(this.service.get('actives.my-sidebar.lastObject.component'), component, 'last object in the array is the active component');
  });

  test('it removes cleared component', function(assert) {
    let component = {};

    run(() => {
      this.service.show('source', 'my-sidebar', component);
    });

    run(() => {
      this.service.clear('source');
    });

    assert.equal(this.service.get('actives.my-sidebar'), undefined);
  });

  test('last shown source wins', function(assert) {
    let componentA = { x: 'foo' };
    let componentB = { x: 'bar' };

    run(() => {
      this.service.show('sourceA', 'my-sidebar', componentA);
      this.service.show('sourceB', 'my-sidebar', componentB);
    });

    assert.equal(this.service.get('actives.my-sidebar.lastObject.component'), componentB);

    run(() => {
      this.service.show('sourceB', 'my-sidebar', componentB);
      this.service.show('sourceA', 'my-sidebar', componentA);
    });

    assert.equal(this.service.get('actives.my-sidebar.lastObject.component'), componentA);
  });

  test('earlier shown source takes back over when later source clears', function(assert) {
    let componentA = {};
    let componentB = {};

    run(() => {
      this.service.show('sourceA', 'my-sidebar', componentA);
      this.service.show('sourceB', 'my-sidebar', componentB);
    });

    assert.equal(this.service.get('actives.my-sidebar.lastObject.component'), componentB);

    run(() => {
      this.service.clear('sourceB');
    });

    assert.equal(this.service.get('actives.my-sidebar.lastObject.component'), componentA);
  });

  test('includes all the source', function(assert) {
    let componentA = {};
    let componentB = {};

    run(() => {
      this.service.show('sourceA', 'my-sidebar', componentA);
      this.service.show('sourceB', 'my-sidebar', componentB);
    });

    assert.equal(typeOf(this.service.get('actives.my-sidebar')), 'array', 'it returns an array');
    assert.equal(this.service.get('actives.my-sidebar.firstObject.component'), componentA);
    assert.equal(this.service.get('actives.my-sidebar.lastObject.component'), componentB);
  });
});
