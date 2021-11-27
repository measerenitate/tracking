import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { a11yAudit } from 'ember-a11y-testing/test-support';

module('Integration | Component | forms/slider', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('dummyAction', () => {});
    this.set('pair', {
      name: 'dessert',
      minLabel: 'Chocolate Cake',
      maxLabel: 'Strawberry Cake',
      rangeMin: 0,
      rangeMax: 10,
      value: 1,
    });
  });

  test('it renders (default = horizontal)', async function (assert) {
    await render(
      hbs`<Forms::Slider @entry={{this.pair}} @onUpdate={{this.dummyAction}} />`
    );

    assert.dom('[data-test-forms-slider]').exists({ count: 1 });
    assert.dom('[data-test-forms-slider-input]').hasValue('1');
    assert
      .dom('[data-test-forms-slider-label]')
      .includesText('Chocolate Cake or Strawberry Cake');
    assert
      .dom('[data-test-forms-slider-left-label]')
      .includesText('Chocolate Cake');
    assert
      .dom('[data-test-forms-slider-right-label]')
      .includesText('Strawberry Cake');
    assert.dom('[data-test-forms-slider-current-value]').includesText(1);
  });

  test('it renders (vertical)', async function (assert) {
    await render(
      hbs`<Forms::Slider @entry={{this.pair}} @onUpdate={{this.dummyAction}} @isVertical={{true}} />`
    );

    assert.dom('[data-test-forms-slider]').exists({ count: 1 });
    assert.dom('[data-test-forms-slider-input]').hasValue('1');
    assert
      .dom('[data-test-forms-slider-label]')
      .includesText('Chocolate Cake or Strawberry Cake');
    assert
      .dom('[data-test-forms-slider-left-label]')
      .includesText('Chocolate Cake');
    assert
      .dom('[data-test-forms-slider-right-label]')
      .includesText('Strawberry Cake');
    assert.dom('[data-test-forms-slider-current-value]').includesText(1);
  });

  test('it is accessible', async function (assert) {
    await render(
      hbs`<Forms::Slider @entry={{this.pair}} @onUpdate={{this.dummyAction}} />`
    );

    await a11yAudit();
    assert.ok(true, 'no a11y errors detected!');
  });

  test('it is accessible (vertical)', async function (assert) {
    await render(
      hbs`<Forms::Slider @entry={{this.pair}} @onUpdate={{this.dummyAction}} @isVertical={{true}} />`
    );

    await a11yAudit();
    assert.ok(true, 'no a11y errors detected!');
  });

  test('it sends the name and value when changing the slider position', async function (assert) {
    assert.expect(2);

    this.set('onUpdate', (name, value) => {
      assert.equal(name, 'dessert');
      assert.equal(value, '8');
    });

    await render(
      hbs`<Forms::Slider @entry={{this.pair}} @onUpdate={{this.onUpdate}} />`
    );

    await fillIn('[data-test-forms-slider-input]', 8);
  });

  test('it displays the current value', async function (assert) {
    await render(
      hbs`<Forms::Slider @entry={{this.pair}} @onUpdate={{this.dummyAction}} />`
    );

    assert.dom('[data-test-forms-slider-current-value]').includesText(1);

    await fillIn('[data-test-forms-slider-input]', 8);

    assert.dom('[data-test-forms-slider-current-value]').includesText('8');
  });
});
