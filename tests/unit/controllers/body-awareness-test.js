import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | body-awareness', function (hooks) {
  setupTest(hooks);

  test('it sets existing data', async function (assert) {
    let controller = this.owner.lookup('controller:body-awareness');
    assert.notOk(controller.existingText);

    await controller.setExistingData({ file: new Blob(['Ember Rules!']) });

    assert.equal(controller.existingText, 'Ember Rules!');
  });

  test('it writes the user entries into a file when submitting the form', function (assert) {
    let controller = this.owner.lookup('controller:body-awareness');
    controller.existingText = `City,Singer,Age,created_at\n,Austin,Beyonce,31,2019-01-01\n`;

    assert.equal(controller.fileName, 'body-awareness.csv');
    assert.notOk(controller.download);
    assert.notOk(controller.downloadUrl);

    controller.submitForm([
      { name: 'City', value: 'Atlanta' },
      { name: 'Singer', value: 'Rhianna' },
      { name: 'Age', value: '28' },
    ]);

    assert.equal(controller.download, 'body-awareness.csv');
    assert.ok(controller.downloadUrl.includes(`blob:${window.origin}`));
  });
});
