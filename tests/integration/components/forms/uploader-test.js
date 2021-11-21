import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, triggerEvent } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

import { a11yAudit } from 'ember-a11y-testing/test-support';

module('Integration | Component | forms/uploader', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('dummyAction', () => {});
  });

  test('it renders', async function (assert) {
    await render(hbs`<Forms::Uploader @onUpload={{this.dummyAction}} />`);

    assert.dom('[data-test-forms-uploader]').exists({ count: 1 });
    assert.dom('[data-test-forms-uploader-input]').exists({ count: 1 });
    assert
      .dom('[data-test-forms-uploader-instructions]')
      .includesText('Update your entries by uploading your .csv');
  });

  test('it offers uploads of .csvs', async function (assert) {
    await render(hbs`<Forms::Uploader @onUpload={{this.dummyAction}} />`);

    assert.dom('[data-test-forms-uploader-input]').hasAttribute('type', 'file');
    assert
      .dom('[data-test-forms-uploader-input]')
      .hasAttribute('accept', 'text/csv');
  });

  test('it is accessible', async function (assert) {
    await render(hbs`<Forms::Uploader @onUpload={{this.dummyAction}} />`);

    await a11yAudit();
    assert.ok(true, 'no a11y errors detected!');
  });

  test('it sends the @onUpload action on changes to the upload input element', async function (assert) {
    assert.expect(1);

    this.set('onUpload', async (value) => {
      let parsedData = await value.file.text();
      assert.equal(parsedData, 'Ember Rules!');
    });

    await render(hbs`<Forms::Uploader @onUpload={{this.onUpload}} />`);
    await triggerEvent('[data-test-forms-uploader-input]', 'change', {
      files: [new Blob(['Ember Rules!'])],
    });
  });

  test('it displays the success message after a file has been uploaded', async function (assert) {
    await render(hbs`<Forms::Uploader @onUpload={{this.dummyAction}} />`);

    assert.dom('[data-test-forms-uploader-instructions]').exists();
    assert.dom('[data-test-forms-uploader-success-message]').doesNotExist();

    await triggerEvent('[data-test-forms-uploader-input]', 'change', {
      files: [new Blob(['Ember Rules!'])],
    });

    assert.dom('[data-test-forms-uploader-instructions]').doesNotExist();
    assert
      .dom('[data-test-forms-uploader-success-message]')
      .includesText('has been uploaded');
  });
});
