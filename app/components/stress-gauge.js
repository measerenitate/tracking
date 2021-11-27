import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { getColorsFromRange, getColorGradient } from 'serenitate-one/utils/colors';

export default class StressGaugeComponent extends Component {
  @tracked
  backgroundTopColor = null;

  @tracked
  backgroundBottomColor = null;

  settings = {
    name: 'stress-gauge',
    minLabel: 'Hypoaroused',
    maxLabel: 'Hyperaroused',
    rangeMin: '-10',
    rangeMax: '10',
    value: 0,
  };

  colors = [
    // blues
    '#84AAF5',
    // greens
    '#ABCB9A',
    // yellows
    '#F0E3A1',
    // oranges
    '#F6B4A6',
    // reds
    '#E684B4',
  ];

  constructor() {
    super(...arguments);
    this.updateBackground(this.settings.value);
  }

  get backgroundStyle() {
    return getColorGradient(this.backgroundTopColor, this.backgroundBottomColor);
  }

  updateBackground(value) {
    let min = this.settings.rangeMin;
    let max = this.settings.rangeMax;
    let colors = getColorsFromRange(min, max, value, { colors: this.colors });
    this.backgroundTopColor = colors.topColor;
    this.backgroundBottomColor = colors.bottomColor;
  }

  @action
  updateForm(a, b, c) {
    let key = a;
    let value = b;
    console.log({ a, b, c });
    this.updateBackground(value);
  }
}
