import { isPresent } from '@ember/utils';

export function getColorsFromRange(min, max, value, options) {
  let colors = options?.colors || [
    // reds
    '#E684B4',
    // oranges
    '#F6B4A6',
    // yellows
    '#F0E3A1',
    // greens
    '#ABCB9A',
    // blues
    '#84AAF5',
  ];

  let range = parseInt(max) - parseInt(min);

  let additionalValue = Math.sign(min) > -1 ? 0 : Math.abs(min);
  let positiveValue = parseInt(value) + additionalValue;

  let lastIndex = colors.length - 1;
  let index1 = Math.floor(positiveValue / 5);
  let nextIndex = parseInt(value) === parseInt(min) ? 0 : index1 + 1;
  let index2 = isPresent(colors[nextIndex]) ? nextIndex : lastIndex;

  let topRangeColor = colors[index1];
  let bottomRangeColor = colors[index2];

  return {
    topColor: topRangeColor,
    bottomColor: bottomRangeColor,
  };
}

export function getColorGradient(topColor, bottomColor) {
  let gradient = `linear-gradient(${bottomColor}, ${topColor})`;
  return `background: ${gradient};`;
}

export default {
  getColorsFromRange,
  getColorGradient,
}
