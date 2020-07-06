import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('in-element', function() {
    this.route('second');
    this.route('third');
    this.route('fourth');
  });
  this.route('component', function() {
    this.route('second');
    this.route('third');
    this.route('fourth');
  });
});

export default Router;
