import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import FileReader from 'ember-file-upload/system/file-reader';

export default class BodyAwarenessController extends Controller {
  fileName = 'body-awareness.csv';

  @tracked
  parsedData = null;

  @tracked
  download = null;

  @tracked
  downloadUrl = null;

  @tracked
  existingData = null;

  @tracked
  hasUsedScaleBefore = null;

  @tracked
  hasConfirmedUse = false;

  parseToCSV(rawData) {
    let data = this.existingData || '';

    let headerData = this.getHeaders(data, rawData);
    let entryData = this.getNewEntry(headerData, rawData);

    return entryData;
  }

  getHeaders(existingData, rawData) {
    if (!existingData) {
      let filteredData = rawData.map((category) => {
        let entry = {};
        entry.name = category.name;
        entry.value = category.value;
        return entry;
      });

      filteredData.push({
        name: 'created_at',
        value: new Date().toISOString(),
      });
      let names = filteredData.mapBy('name').join(',');
      existingData += names + `\n`;
    }
    return existingData;
  }

  getNewEntry(existingData, rawData) {
    let filteredData = rawData.map((category) => {
      let entry = {};
      entry.name = category.name;
      entry.value = category.value;
      return entry;
    });

    filteredData.push({ name: 'created_at', value: new Date().toISOString() });

    this.checkIfSourceFileCorrect(existingData, filteredData);

    let values = filteredData.mapBy('value').join(',');

    if (!existingData.endsWith(`\n`)) {
      existingData += '\n';
    }
    existingData += values + `\n`;
    return existingData;
  }

  checkIfSourceFileCorrect(existingData, newData) {
    let parsedExistingData = existingData.split(',');
    let oldHeaders = parsedExistingData;
    let newHeaders = Object.keys(newData);
  }

  prepareDownload(csv, filename) {
    let csvFile = new Blob([csv], { type: 'text/csv' });
    this.download = filename;
    this.downloadUrl = window.URL.createObjectURL(csvFile);
  }

  get isShowingForm() {
    return (
      (this.hasConfirmedUse && !this.hasUsedScaleBefore) ||
      (this.hasConfirmedUse && this.existingData)
    );
  }

  @action
  confirmPreviousUse(value) {
    this.hasUsedScaleBefore = value;
    this.hasConfirmedUse = true;
  }

  @action
  async setExistingData(data) {
    let objectURL = window.URL.createObjectURL(data.file);
    let reader = new FileReader();
    let parsedData = await reader.readAsText(data.file);

    this.existingData = parsedData;
  }

  @action
  submitForm(data, event) {
    event?.preventDefault();
    // prepare download of data...
    this.parsedData = this.parseToCSV(data);
    this.prepareDownload(this.parsedData, this.fileName);
  }
}
