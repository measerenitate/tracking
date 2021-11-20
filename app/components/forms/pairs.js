import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FormsPairsComponent extends Component {
  @tracked
  currentValue = 0;

  @tracked
  pairs = null;

  constructor() {
    super(...arguments);
    this.pairs = this.args.pairs;
  }

  @action
  updateForm(key, value) {
    this.pairs.findBy('name', key).value = value;
  }
}
