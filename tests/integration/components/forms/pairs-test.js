import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | forms/pairs', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set('dummyAction', () => {});
    this.set('isSubmitted', false);
    this.set('pairs', [{
      name: 'dessert',
      negative: 'Chocolate Cake',
      positive: 'Strawberry Cake',
      rangeMin: 0,
      rangeMax: 10,
      value: 1,
    }, {
      name: 'breakfast',
      negative: 'Bread',
      positive: 'Toast',
      rangeMin: 0,
      rangeMax: 10,
      value: 2,
    }, {
      name: 'lunch',
      negative: 'Sandwich',
      positive: 'SOS Roll',
      rangeMin: 0,
      rangeMax: 10,
      value: 3,
    }]);
  });

  test('it renders', async function (assert) {
    await render(hbs`<Forms::Pairs @pairs={{this.pairs}} @onSubmit={{this.dummyAction}} @isSubmitted={{this.isSubmitted}} />`);

    assert.dom('[data-test-forms-pairs]').exists({ count: 1 });

    assert.dom('[data-test-forms-pairs-entry]').exists({ count: 3 });
    assert.dom('[data-test-forms-pairs-entry="dessert"]').exists({ count: 1 });
    assert.dom('[data-test-forms-pairs-entry="breakfast"]').exists({ count: 1 });
    assert.dom('[data-test-forms-pairs-entry="lunch"]').exists({ count: 1 });
    assert.dom('[data-test-forms-pairs-submit]').includesText('Save');
  });

  test('it enables the submit button by default', async function (assert) {
    await render(hbs`<Forms::Pairs @pairs={{this.pairs}} @onSubmit={{this.dummyAction}} @isSubmitted={{false}} />`);

    assert.dom('[data-test-forms-pairs-submit]').isNotDisabled();
  });

  test('it disables the submit button if the @isSubmitted flag is set', async function (assert) {
    await render(hbs`<Forms::Pairs @pairs={{this.pairs}} @onSubmit={{this.dummyAction}} @isSubmitted={{true}} />`);

    assert.dom('[data-test-forms-pairs-submit]').isDisabled();
  });

  test('it triggers the onSubmit action if the form is submitted', async function (assert) {
    assert.expect(1);

    this.set('onSubmit', (value) => {
      assert.ok(value);
    })
    await render(hbs`<Forms::Pairs @pairs={{this.pairs}} @onSubmit={{this.onSubmit}} @isSubmitted={{this.isSubmitted}} />`);

    await click('[data-test-forms-pairs-submit]');
  });

  test('it allows entering values and submitting them', async function (assert) {
    assert.expect(4);

    let expectedValues = [{
      name: 'dessert',
      negative: 'Chocolate Cake',
      positive: 'Strawberry Cake',
      rangeMin: 0,
      rangeMax: 10,
      value: '2',
    }, {
      name: 'breakfast',
      negative: 'Bread',
      positive: 'Toast',
      rangeMin: 0,
      rangeMax: 10,
      value: '4',
    }, {
      name: 'lunch',
      negative: 'Sandwich',
      positive: 'SOS Roll',
      rangeMin: 0,
      rangeMax: 10,
      value: '8',
    }];

    this.set('onSubmit', (value) => {
      assert.deepEqual(value, expectedValues);
    })

    await render(hbs`<Forms::Pairs @pairs={{this.pairs}} @onSubmit={{this.onSubmit}} @isSubmitted={{this.isSubmitted}} />`);

    await fillIn('[data-test-forms-pairs-entry="dessert"]', 2);
    await fillIn('[data-test-forms-pairs-entry="breakfast"]', 4);
    await fillIn('[data-test-forms-pairs-entry="lunch"]', 8);

    assert.dom('[data-test-forms-pairs-entry="dessert"]').hasValue('2');
    assert.dom('[data-test-forms-pairs-entry="breakfast"]').hasValue('4');
    assert.dom('[data-test-forms-pairs-entry="lunch"]').hasValue('8');

    await click('[data-test-forms-pairs-submit]');
  });
});
