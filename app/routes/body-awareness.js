import Route from '@ember/routing/route';
import questions from 'serenitate-one/data/body-awareness';

export default class BodyAwarenessRoute extends Route {
  setupController(controller, model) {
    super.setupController(...arguments);
    controller.questionPairs = [...questions];
  }

  resetController(controller, model) {
    super.resetController(...arguments);
    controller.questionPairs = null;
  }
}
