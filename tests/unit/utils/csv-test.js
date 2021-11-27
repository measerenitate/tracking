import {
  fileHasExistingData,
  fileToText,
  generateFileText,
  listToText,
  mapByKey,
  writeLineToFile,
} from 'serenitate-one/utils/csv';
import { module, test } from 'qunit';

module('Unit | Utility | csv', function () {
  module('fileHasExistingData', function () {
    test('is true if data is present', async function (assert) {
      let result = fileHasExistingData('zelda');
      assert.ok(result);
    });

    test('is false if data is absent', async function (assert) {
      let result = fileHasExistingData('');
      assert.notOk(result);
    });
  });

  module('fileToText', function () {
    test('it reads from a file blob', async function (assert) {
      let fileBlob = new Blob(['Ember Rules!']);
      let result = await fileToText(fileBlob);
      assert.equal(result, 'Ember Rules!');
    });

    test('it reads from an empty file file blob', async function (assert) {
      let fileBlob = new Blob(['']);
      let result = await fileToText(fileBlob);
      assert.equal(result, '');
    });
  });

  module('generateFileText', function (hooks) {
    hooks.beforeEach(function () {
      this.newEntry = [
        {
          name: 'least',
          value: 'Tree Cake',
        },
        {
          name: 'ok',
          value: 'Marmelade',
        },
        {
          name: 'favorite',
          value: 'Chocolate Truffles',
        },
      ];
      this.newDate = new Date('2020-01-01').toISOString();
    });

    test('it appends text to already existing data', async function (assert) {
      let text = generateFileText(
        'Coconut Ice Cream,Bounty,Snickers,1990-01-01T00:00:00.000Z',
        this.newEntry,
        this.newDate
      );
      assert.equal(
        text,
        `Coconut Ice Cream,Bounty,Snickers,1990-01-01T00:00:00.000Z\nTree Cake,Marmelade,Chocolate Truffles,2020-01-01T00:00:00.000Z\n`
      );
    });

    test('it appends headers and text if no data exists yet', async function (assert) {
      let text = generateFileText('', this.newEntry, this.newDate);
      assert.equal(
        text,
        `least,ok,favorite,created_at\nTree Cake,Marmelade,Chocolate Truffles,2020-01-01T00:00:00.000Z\n`
      );
    });

    test('it appends headers and text if data is null', async function (assert) {
      let text = generateFileText(null, this.newEntry, this.newDate);
      assert.equal(
        text,
        `least,ok,favorite,created_at\nTree Cake,Marmelade,Chocolate Truffles,2020-01-01T00:00:00.000Z\n`
      );
    });
  });

  module('listToText', function () {
    test('it returns a comma separated string generated from a list', async function (assert) {
      let list = ['shiba', 'dachs', 'golden'];
      let result = listToText(list);
      assert.equal(result, 'shiba,dachs,golden');
    });
  });

  module('mapByKey', function (hooks) {
    hooks.beforeEach(function () {
      this.drinks = [
        {
          name: 'Pepsi',
          flavour: 'great',
          value: 0.2,
        },
        {
          name: 'Dr. Pepper',
          flavour: 'excellent',
          value: 10,
        },
      ];
    });

    test('it maps an array by a key', function (assert) {
      let result = mapByKey(this.drinks, 'flavour');
      assert.deepEqual(result, ['great', 'excellent']);
    });

    test('it maps an array by value by default', function (assert) {
      let result = mapByKey(this.drinks);
      assert.deepEqual(result, [0.2, 10]);
    });

    test('it allows adding additional values', function (assert) {
      let result = mapByKey(this.drinks, 'name', { add: '7even Up' });
      assert.deepEqual(result, ['Pepsi', 'Dr. Pepper', '7even Up']);
    });
  });

  module('writeLineToFile', function () {
    test('it adds a string to an empty string', async function (assert) {
      let existingText = '';
      let newText = 'mario';
      let result = writeLineToFile(existingText, newText);
      assert.equal(result, 'mario\n');
    });

    test('it creates a string if none exists yet', async function (assert) {
      let existingText = null;
      let newText = 'peach';
      let result = writeLineToFile(existingText, newText);
      assert.equal(result, 'peach\n');
    });

    test('it adds a new line to existing text', async function (assert) {
      let existingText = 'waluigi';
      let newText = 'toad';
      let result = writeLineToFile(existingText, newText);
      assert.equal(result, 'waluigi\ntoad\n');
    });
  });
});
