# ember-elsewhere

[![NPM][npm-badge-img]][npm-badge-link]
[![Ember Observer Score][ember-observer-badge]][ember-observer-url]
![Ember Version][ember-version]

This addon makes it easy to manage sidebars, toolbars, popups, modals, or any piece of DOM that you want to lift outside your normal route hiearchy.

It is similar to [ember-wormhole](https://github.com/yapplabs/ember-wormhole), but is a better choice when your target is within your own Ember app (as opposed to arbitrary, potentially foreign DOM). It is also easier to compose with animations and it's based on 100% public API.

The best documentation is the sample application in `tests/dummy`, which is also running at [http://ef4.github.io/ember-elsewhere/](http://ef4.github.io/ember-elsewhere/).

## Install

```no-highlight
ember install ember-elsewhere
```

## Components

Create a target named "my-right-sidebar":

```hbs
{{from-elsewhere name="my-right-sidebar"}}
```

Anywhere else in your app, declare the content to render in the target using the block form of to-elsewhere.

```hbs
{{#to-elsewhere named="my-right-sidebar"}}
    {{cool-thing  model=model launch=(action "launchIt")}}
{{/to-elsewhere}}
```

Or send which component should render in the target -- complete with bound inputs and actions:

```hbs
{{to-elsewhere named="my-right-sidebar" send=(component "cool-thing" model=model launch=(action "launchIt"))}}
```

## Rendering multiple components into a single target

There might be use cases where you would like to render multiple component into a single target, for example a from-elsewhere "actions" might receive multiple action buttons via to-elsewhere. Pass the multiple property true. This only works for the block form of to-elsewhere. 

```hbs
{{from-elsewhere name="actions" multiple=true}}
<!-- ... -->
{{#to-elsewhere named="actions"}}
  {{test-button text="Button1"}}
{{/to=elsewhere}}
{{#to-elsewhere named="actions"}}
  {{test-button text="Button3"}}
{{/to=elsewhere}}
{{#to-elsewhere named="actions"}}
  {{test-button text="Button2"}}
{{/to=elsewhere}}
```

When sending components, instead of from-elsewhere use the complementary **multiple-from-elsewhere** component.

```hbs
{{multiple-from-elsewhere name="actions"}}
<!-- ... -->
{{to-elsewhere named="actions" send=(component "test-button" text="Button1")}}
{{to-elsewhere named="actions" send=(component "test-button" text="Button3")}}
{{to-elsewhere named="actions" send=(component "test-button" text="Button2")}}
```

## Passing additional state through to the target

When you're using the block form of `from-elsewhere`, you can pass additional state to the target with the `outsideParams` property. Here is an example of a modal that supports an `onOutsideClick` action while providing shared layout for the background and container:

```hbs
{{#to-elsewhere named="modal"
   outsideParams=(hash onOutsideClick=(action "close") 
                      title="modal title"
                 )
}}
   {{warning-message}}
{{/to-elsewhere}}
```

```hbs
{{#from-elsewhere name="modal" as |modal outsideParams|}}
    <div class="modal-container">
      <div class="modal-background" onclick={{action outsideParams.onOutsideClick}}></div>
      <div class="modal-dialog" >
        <div class="modal-title">{{outsideParams.title}}</div>
        {{component modal}}
      </div>
    </div>
{{/from-elsewhere}}
```

Currently, animation only works when sending components, here is an example.

```hbs
{{#from-elsewhere name="modal" as |modal|}}
  {{#liquid-bind modal as |currentModal|}}
    <div class="modal-background"></div>
    <div class="modal-container">
      {{component modal}}
    </div>
  {{/liquid-bind}}
{{/from-elsewhere}}
```


## Crossing Engines

Engines deliberately are deliberately isolated from each other, so a `to-elsewhere` in one engine cannot target a `from-elsewhere` in another. But you can optionally share the ember-elsewhere service between them to make it work, see https://github.com/ef4/ember-elsewhere/issues/26#issuecomment-432217049

### Linting

* `ember server`
* Visit your app at http://localhost:4200.

### Running tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

[npm-badge-img]: https://badge.fury.io/js/ember-elsewhere.svg
[npm-badge-link]: http://badge.fury.io/js/ember-elsewhere
[ember-observer-badge]: http://emberobserver.com/badges/ember-elsewhere.svg
[ember-observer-url]: http://emberobserver.com/addons/ember-elsewhere
[ember-version]: https://embadge.io/v1/badge.svg?start=2.3.2
