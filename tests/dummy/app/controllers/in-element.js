import Controller from '@ember/controller';

export default Controller.extend({
  toolsAnimationRules
});

function toolsAnimationRules() {
  this.transition(
    this.fromValue(false),
    this.toValue(true),
    this.use('to-down'),
    this.reverse('to-up')
  );
  this.transition(
    this.fromValue(true),
    this.toValue(true),
    this.use('fade')
  );
}
