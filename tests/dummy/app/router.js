import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('second');
  this.route('third');
  this.route('fourth');
  this.route('send-component', function() {
    this.route('fourth');
    this.route('second');
    this.route('third');
  });

  this.route('in-element', function() {
    this.route('fourth');
    this.route('second');
    this.route('third');
  });
});

export default Router;
