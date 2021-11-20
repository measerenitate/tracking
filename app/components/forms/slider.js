import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FormsSliderComponent extends Component {
  @tracked
  currentValue = 0;

  constructor() {
    super(...arguments);
    this.currentValue = this.args.entry.value;
  }

  get label() {
    return `${this.args.entry.negative} or ${this.args.entry.positive}`;
  }

  @action
  updateRange(data, ev) {
    this.currentValue = ev.target.value;
    this.args.onUpdate(data, ev.target.value);
  }
}
