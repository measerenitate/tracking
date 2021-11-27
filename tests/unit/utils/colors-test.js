import { getColorsFromRange, getColorGradient } from 'serenitate-one/utils/colors';
import { module, test } from 'qunit';

module('Unit | Utility | colors', function () {
  module('getColorsFromRange', function (hooks) {
    hooks.beforeEach(function() {
      this.colors = [
        '#ff0000',
        '#dd77dd',
        '#eeff00',
        '#ABCB9A',
        '#84AAF5',
      ];
    });

    test('it returns a top color from a numeric value', function (assert) {
      let result = getColorsFromRange(-10, 10, 2, { colors: this.colors });
      assert.equal(result.topColor, '#eeff00');
    });

    test('it returns a bottom color from a numeric value', function (assert) {
      let result = getColorsFromRange(-10, 10, 2, { colors: this.colors });
      assert.equal(result.bottomColor, '#ABCB9A');
    });

    test('the top and bottom color differ for medium values', function (assert) {
      let result = getColorsFromRange(-10, 10, 2, { colors: this.colors });
      assert.notEqual(result.bottomColor, result.topColor);
    });

    test('the top and bottom color are equal for end of range values', function (assert) {
      let result = getColorsFromRange(-10, 10, 10, { colors: this.colors });
      assert.equal(result.bottomColor, result.topColor);
    });

    test('it works with all positive values', function (assert) {
      let result = getColorsFromRange(0, 15, 10, { colors: this.colors });
      assert.equal(result.bottomColor, '#ABCB9A');
      assert.equal(result.topColor, '#eeff00');
    });

    test('it returns the default color palette if no options are passed', function (assert) {
      let result = getColorsFromRange(-10, 10, 2);
      assert.equal(result.bottomColor, '#ABCB9A');
      assert.equal(result.topColor, '#F0E3A1');
    });

    test('it returns the same top and bottom color for start of range values', function (assert) {
      let result = getColorsFromRange(-20, 10, -20, { colors: this.colors });
      assert.equal(result.bottomColor, '#ff0000');
      assert.equal(result.topColor, '#ff0000');
    });
  });

  module('getColorsFromRange', function () {
    test('it returns a background style', function (assert) {
      let result = getColorGradient('#ff00ff', '#00dd77');
      assert.equal(result, 'background: linear-gradient(#00dd77, #ff00ff);');
    });
  });
});
