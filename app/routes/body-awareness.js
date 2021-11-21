import Route from '@ember/routing/route';
import questions from 'serenitate-one/data/body-awareness';

export default class BodyAwarenessRoute extends Route {
  model() {
    return this.createModelDeepCopy(questions);
  }

  createModelDeepCopy(modelData) {
    return JSON.parse(JSON.stringify(modelData));
  }
}
