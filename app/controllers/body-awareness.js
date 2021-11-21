import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import FileReader from 'ember-file-upload/system/file-reader';

import { fileToText, generateFileText } from 'serenitate-one/utils/csv';

export default class BodyAwarenessController extends Controller {
  fileName = 'body-awareness.csv';

  @tracked
  download = null;

  @tracked
  downloadUrl = null;

  @tracked
  existingText = null;

  @tracked
  hasUsedScaleBefore = null;

  @tracked
  hasConfirmedUse = false;

  @tracked
  hasSubmittedForm = false;

  writeToFile(existingFileText, newData, fileName) {
    let currentDate = new Date().toISOString();
    let text = generateFileText(existingFileText, newData, currentDate);

    let csvFile = new Blob([text], { type: 'text/csv' });
    this.download = fileName;
    this.downloadUrl = window.URL.createObjectURL(csvFile);
    this.hasSubmittedForm = true;
  }

  get isShowingForm() {
    return (
      (this.hasConfirmedUse && !this.hasUsedScaleBefore) ||
      (this.hasConfirmedUse && this.existingText)
    );
  }

  @action
  confirmPreviousUse(value) {
    this.hasUsedScaleBefore = value;
    this.hasConfirmedUse = true;
  }

  @action
  async setExistingData(data) {
    this.existingText = await fileToText(data.file);
  }

  @action
  submitForm(data, event) {
    event?.preventDefault();
    // prepare download of data...
    this.writeToFile(this.existingText, data, this.fileName);
  }
}
