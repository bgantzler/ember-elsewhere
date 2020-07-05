import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | to elsewhere', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('template:components/x-foo', hbs`Hello World from Foo`);
    this.owner.register('template:components/x-bar', hbs`Hello World from Bar`);
    this.owner.register('template:components/x-baz', hbs`{{outsideParams.greeting}} from Baz`);
    this.owner.register('template:components/x-blip', hbs`{{outsideParams.greeting}} from Blip`);
  });

  test('it works with inline from-elsewhere', async function(assert) {
    await render(hbs`<div class="my-target">{{from-elsewhere name="my-target"}}</div><div class="source">{{to-elsewhere named="my-target" send=(component "x-foo")}}</div>`);
    assert.dom(this.element.querySelector('.my-target')).hasText('Hello World from Foo');
  });

  test('it works with block-form from-elsewhere', async function(assert) {
    await render(hbs`<div class="my-target">{{#from-elsewhere name="my-target" as |c|}}{{component c}}{{/from-elsewhere}}</div><div class="source">{{to-elsewhere named="my-target" send=(component "x-foo")}}</div>`);
    assert.dom(this.element.querySelector('.my-target')).hasText('Hello World from Foo');
  });

  // This is a duplicate of 'it works with inline from-elsewhere'
  // test('destination can come before source', async function(assert) {
  //   await render(hbs`<div class="my-target">{{from-elsewhere name="my-target"}}</div><div class="source">{{to-elsewhere named="my-target" send=(component "x-foo")}}</div>`);
  //   assert.dom(this.element.querySelector('.my-target')).hasText('Hello World from Foo');
  // });

  test('source can come before destination', async function(assert) {
    await render(hbs`<div class="source">{{to-elsewhere named="my-target" send=(component "x-foo")}}</div><div class="my-target">{{from-elsewhere name="my-target"}}</div>`);
    assert.dom(this.element.querySelector('.my-target')).hasText('Hello World from Foo');
  });

  test('it accepts an outsideParams object for block form', async function(assert) {
    await render(hbs`
      <div class="source">
        {{to-elsewhere named="my-target" send=(component "x-blip") outsideParams=(hash greeting="Hello World")}}
      </div>
      <div class="my-target">
        {{#from-elsewhere name="my-target" as |content outsideParams|}}
            {{component content outsideParams=outsideParams}}
        {{/from-elsewhere}}
      </div>
    `);
    assert.dom(this.element.querySelector('.my-target')).hasText('Hello World from Blip');
  });

  test('from-elsewhere inline works with block form of to-elsewhere', async function(assert) {
    await render(hbs`
      <div class="my-target">
        {{from-elsewhere name="my-target"}}
      </div>
      <div class="source">
        {{#to-elsewhere named="my-target"}}
            {{x-foo}}
        {{/to-elsewhere}}
      </div>
    `);
    assert.dom(this.element.querySelector('.my-target')).hasText('Hello World from Foo');
  });

  test('from-elsewhere block-form works with block form of to-elsewhere', async function(assert) {
    await render(hbs`
      <div class="my-target">
          {{#from-elsewhere name="my-target" as |c|}}
              {{component c}}
          {{/from-elsewhere}}
      </div>
      <div class="source">
        {{#to-elsewhere named="my-target"}}
            {{x-foo}}
        {{/to-elsewhere}}
      </div>
    `);
    assert.dom(this.element.querySelector('.my-target')).hasText('Hello World from Foo');
  });

  test('from-elsewhere block form with append true works with  block form of to-elsewhere', async function (assert) {
    await render(hbs`
        <div class="my-target">
          {{#from-elsewhere name="my-target" append=true as |c|}}
              {{component c}}
          {{/from-elsewhere}}
        </div>
        <div class="source">
          {{#to-elsewhere named="my-target"}}
              {{x-foo}}
          {{/to-elsewhere}}
        </div>
        <div class="source">
          {{#to-elsewhere named="my-target"}}
              {{x-bar}}
          {{/to-elsewhere}}
        </div>
      `);
    assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Hello World from Foo'), -1);
    assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Hello World from Bar'), -1);
  });

  module('multiple-from-elsewhere', function() {
    test('it works with with inline multiple-from-elsewhere', async function (assert) {
      await render(hbs`
      <div class="my-target">
        {{multiple-from-elsewhere name="my-target"}}
      </div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-foo")}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-bar")}}</div>
    `);
      assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Hello World from Foo'), -1);
      assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Hello World from Bar'), -1);
    });

    test('it works with with block-form multiple-from-elsewhere', async function (assert) {
      await render(hbs`
      <div class="my-target">
        {{#multiple-from-elsewhere name="my-target" as |c|}}{{component c}}{{/multiple-from-elsewhere}}
      </div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-foo")}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-bar")}}</div>
    `);
      assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Hello World from Foo'), -1);
      assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Hello World from Bar'), -1);
    });

    test('it accepts an outsideParams object for block form', async function(assert) {
      await render(hbs`
      <div class="my-target">
        {{#multiple-from-elsewhere name="my-target" as |c outsideParams|}}{{component c outsideParams=outsideParams}}{{/multiple-from-elsewhere}}
      </div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-baz") outsideParams=(hash greeting='Morning')}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-blip") outsideParams=(hash greeting='Afternoon')}}</div>
    `);
      assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Morning from Baz'), -1);
      assert.notEqual(this.element.querySelector('.my-target').textContent.trim().indexOf('Afternoon from Blip'), -1);
    });

    test('when order is not provided, it rendered based on logical ordering', async function (assert) {
      await render(hbs`
      <div class="my-target">
        {{#multiple-from-elsewhere name="my-target" as |c|}}{{component c}}{{/multiple-from-elsewhere}}
      </div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-foo" id="foo")}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-bar" id="bar")}}</div>
    `);
      assert.equal(this.element.querySelector('#foo').nextElementSibling, document.querySelector('#bar'));
    })

    test('when order is provided, it rendered elements based on the given order', async function (assert) {
      await render(hbs`
      <div class="my-target">
        {{#multiple-from-elsewhere name="my-target" as |c|}}{{component c}}{{/multiple-from-elsewhere}}
      </div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-foo" id="foo") order=20}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-bar" id="bar") order=10}}</div>
    `);

      assert.equal(this.element.querySelector('#bar').nextElementSibling, document.querySelector('#foo'));
    })

    test('when some elements has no order but some does, it uses mixture of natural ordering and provided ordering', async function (assert) {
      await render(hbs`
      <div class="my-target">
        {{#multiple-from-elsewhere name="my-target" as |c|}}{{component c}}{{/multiple-from-elsewhere}}
      </div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-blip" id="blip") outsideParams=(hash greeting='Afternoon')}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-foo" id="foo") order=20}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-bar" id="bar") order=10}}</div>
      <div class="source">{{to-elsewhere named="my-target" send=(component "x-baz" id="baz") outsideParams=(hash greeting='Morning')}}</div>
    `);
      assert.equal(this.element.querySelector('#blip').nextElementSibling, document.querySelector('#bar'));
      assert.equal(this.element.querySelector('#bar').nextElementSibling, document.querySelector('#foo'));
      assert.equal(this.element.querySelector('#foo').nextElementSibling, document.querySelector('#baz'));
    })
  });

});
