import { module, test } from 'qunit';
import { visit, click, currentURL, fillIn, find } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | body awareness', function (hooks) {
  setupApplicationTest(hooks);

  hooks.afterEach(async function() {
    await visit('/');
  });

  test('it renders the page (initial state)', async function (assert) {
    await visit('/body-awareness');

    assert.equal(currentURL(), '/body-awareness');
    assert.dom('[data-test-page-header]').includesText('Body awareness scale');
    assert.dom('[data-test-page-description]').includesText('Please choose for each question pair the number that you find describes best how you\'re currently feeling');

    assert.dom('[data-test-page-uploader="body-awareness"]').doesNotExist();
    assert.dom('[data-test-page-preliminary-information]').includesText('Did you use the scale before');
    assert.dom('[data-test-page-preliminary-information="yes"]').includesText('Yes');
    assert.dom('[data-test-page-preliminary-information="no"]').includesText('No');
    assert.dom('[data-test-page-form="body-awareness"]').doesNotExist();
    assert.dom('[data-test-page-download-link]').doesNotExist();
  });

  module('new user', function () {
    test('it renders the page (after confirming first visit)', async function (assert) {
      await visit('/body-awareness');
      await click('[data-test-page-preliminary-information="no"]');

      assert.dom('[data-test-page-header]').includesText('Body awareness scale');
      assert.dom('[data-test-page-description]').includesText('Please choose for each question pair the number that you find describes best how you\'re currently feeling');

      assert.dom('[data-test-page-uploader="body-awareness"]').doesNotExist();
      assert.dom('[data-test-page-preliminary-information]').doesNotExist();

      assert.dom('[data-test-page-form="body-awareness"]').exists();

      assertInitialFormStateIsRendered(assert);

      assert.dom('[data-test-page-download-link]').doesNotExist();
    });

    test('it allows filling out the form', async function (assert) {
      await visit('/body-awareness');
      await click('[data-test-page-preliminary-information="no"]');

      await fillOutForm();

      assert.dom('[data-test-forms-slider="body-likeness"] [data-test-forms-slider-current-value]').includesText('-5');
      assert.dom('[data-test-forms-slider="hopefulness"] [data-test-forms-slider-current-value]').includesText('-5');
      assert.dom('[data-test-forms-slider="curiosity"] [data-test-forms-slider-current-value]').includesText('-4');
      assert.dom('[data-test-forms-slider="presence"] [data-test-forms-slider-current-value]').includesText('-4');
      assert.dom('[data-test-forms-slider="relaxation"] [data-test-forms-slider-current-value]').includesText('-3');
      assert.dom('[data-test-forms-slider="free-of-pain"] [data-test-forms-slider-current-value]').includesText('-3');
      assert.dom('[data-test-forms-slider="self-efficiency"] [data-test-forms-slider-current-value]').includesText('-2');
      assert.dom('[data-test-forms-slider="dynamic"] [data-test-forms-slider-current-value]').includesText('-2');
      assert.dom('[data-test-forms-slider="energetic"] [data-test-forms-slider-current-value]').includesText('-1');
      assert.dom('[data-test-forms-slider="power"] [data-test-forms-slider-current-value]').includesText('-1');
      assert.dom('[data-test-forms-slider="alive"] [data-test-forms-slider-current-value]').includesText('1');
      assert.dom('[data-test-forms-slider="colorful"] [data-test-forms-slider-current-value]').includesText('1');
    });

    test('it allows downloading the results', async function (assert) {
      await visit('/body-awareness');
      await click('[data-test-page-preliminary-information="no"]');

      await fillOutForm();

      assert.dom('[data-test-forms-pairs-submit]').isNotDisabled();
      assert.dom('[data-test-page-download-link]').doesNotExist();

      await click('[data-test-forms-pairs-submit]');

      assert.dom('[data-test-forms-pairs-submit]').isDisabled();
      assert.dom('[data-test-page-download-link]').includesText('Download');

      let downloadUrl = find('[data-test-page-download-link]').href;
      assert.ok(downloadUrl.includes(`blob:${window.origin}`));
      assert.dom('[data-test-page-download-link]').hasAttribute('download', 'body-awareness.csv');
    });
  });

  module('recurring user', function () {
    test('it renders the page (after confirming recurring visit)', async function (assert) {
      await visit('/body-awareness');
      await click('[data-test-page-preliminary-information="yes"]');

      assert.dom('[data-test-page-header]').includesText('Body awareness scale');
      assert.dom('[data-test-page-description]').includesText('Please choose for each question pair the number that you find describes best how you\'re currently feeling');

      assert.dom('[data-test-page-uploader="body-awareness"]').exists();
      assert.dom('[data-test-forms-uploader-instructions]').includesText('Update your entries');
      assert.dom('[data-test-page-preliminary-information]').doesNotExist();
      assert.dom('[data-test-page-form="body-awareness"]').doesNotExist();
      assert.dom('[data-test-page-download-link]').doesNotExist();
    });
  });
});


function assertInitialFormStateIsRendered(assert) {
  // renders question 1
  assert.dom('[data-test-forms-slider="body-likeness"] [data-test-forms-slider-left-label]').includesText('I dislike my body');
  assert.dom('[data-test-forms-slider="body-likeness"] [data-test-forms-slider-right-label]').includesText('I like my body');
  assert.dom('[data-test-forms-pairs-entry="body-likeness"]').hasValue('0');

  // renders question 2
  assert.dom('[data-test-forms-slider="hopefulness"] [data-test-forms-slider-left-label]').includesText('Hopeless');
  assert.dom('[data-test-forms-slider="hopefulness"] [data-test-forms-slider-right-label]').includesText('I\'m full of hope');
  assert.dom('[data-test-forms-pairs-entry="hopefulness"]').hasValue('0');

  // renders question 3
  assert.dom('[data-test-forms-slider="curiosity"] [data-test-forms-slider-left-label]').includesText('Apathetic');
  assert.dom('[data-test-forms-slider="curiosity"] [data-test-forms-slider-right-label]').includesText('Curious');
  assert.dom('[data-test-forms-pairs-entry="curiosity"]').hasValue('0');

  // renders question 4
  assert.dom('[data-test-forms-slider="presence"] [data-test-forms-slider-left-label]').includesText('Absentminded');
  assert.dom('[data-test-forms-slider="presence"] [data-test-forms-slider-right-label]').includesText('Present');
  assert.dom('[data-test-forms-pairs-entry="presence"]').hasValue('0');

  // renders question 5
  assert.dom('[data-test-forms-slider="relaxation"] [data-test-forms-slider-left-label]').includesText('Tense');
  assert.dom('[data-test-forms-slider="relaxation"] [data-test-forms-slider-right-label]').includesText('Relaxed');
  assert.dom('[data-test-forms-pairs-entry="relaxation"]').hasValue('0');

  // renders question 6
  assert.dom('[data-test-forms-slider="free-of-pain"] [data-test-forms-slider-left-label]').includesText('Experiencing pain');
  assert.dom('[data-test-forms-slider="free-of-pain"] [data-test-forms-slider-right-label]').includesText('Free of pain');
  assert.dom('[data-test-forms-pairs-entry="free-of-pain"]').hasValue('0');

  // renders question 7
  assert.dom('[data-test-forms-slider="self-efficiency"] [data-test-forms-slider-left-label]').includesText('Helpless');
  assert.dom('[data-test-forms-slider="self-efficiency"] [data-test-forms-slider-right-label]').includesText('Self-efficient');
  assert.dom('[data-test-forms-pairs-entry="self-efficiency"]').hasValue('0');

  // renders question 8
  assert.dom('[data-test-forms-slider="dynamic"] [data-test-forms-slider-left-label]').includesText('Frozen or numb');
  assert.dom('[data-test-forms-slider="dynamic"] [data-test-forms-slider-right-label]').includesText('Dynamic or lively');
  assert.dom('[data-test-forms-pairs-entry="dynamic"]').hasValue('0');

  // renders question 9
  assert.dom('[data-test-forms-slider="energetic"] [data-test-forms-slider-left-label]').includesText('Sluggish');
  assert.dom('[data-test-forms-slider="energetic"] [data-test-forms-slider-right-label]').includesText('Full of energy');
  assert.dom('[data-test-forms-pairs-entry="energetic"]').hasValue('0');

  // renders question 10
  assert.dom('[data-test-forms-slider="power"] [data-test-forms-slider-left-label]').includesText('Weak');
  assert.dom('[data-test-forms-slider="power"] [data-test-forms-slider-right-label]').includesText('Powerful');
  assert.dom('[data-test-forms-pairs-entry="power"]').hasValue('0');

  // renders question 11
  assert.dom('[data-test-forms-slider="alive"] [data-test-forms-slider-left-label]').includesText('Lifeless');
  assert.dom('[data-test-forms-slider="alive"] [data-test-forms-slider-right-label]').includesText('Alive');
  assert.dom('[data-test-forms-pairs-entry="alive"]').hasValue('0');

  // renders question 12
  assert.dom('[data-test-forms-slider="colorful"] [data-test-forms-slider-left-label]').includesText('The world seems grey and flat');
  assert.dom('[data-test-forms-slider="colorful"] [data-test-forms-slider-right-label]').includesText('The world is colorful');
  assert.dom('[data-test-forms-pairs-entry="colorful"]').hasValue('0');
}

async function fillOutForm() {
  await fillIn('[data-test-forms-pairs-entry="body-likeness"]', -5);
  await fillIn('[data-test-forms-pairs-entry="hopefulness"]', -5);
  await fillIn('[data-test-forms-pairs-entry="curiosity"]', -4);
  await fillIn('[data-test-forms-pairs-entry="presence"]', -4);
  await fillIn('[data-test-forms-pairs-entry="relaxation"]', -3);
  await fillIn('[data-test-forms-pairs-entry="free-of-pain"]', -3);
  await fillIn('[data-test-forms-pairs-entry="self-efficiency"]', -2);
  await fillIn('[data-test-forms-pairs-entry="dynamic"]', -2);
  await fillIn('[data-test-forms-pairs-entry="energetic"]', -1);
  await fillIn('[data-test-forms-pairs-entry="power"]', -1);
  await fillIn('[data-test-forms-pairs-entry="alive"]', 1);
  await fillIn('[data-test-forms-pairs-entry="colorful"]', 1);
}
