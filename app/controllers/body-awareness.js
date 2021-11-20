import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import * as Papa from 'papaparse';

export default class BodyAwarenessController extends Controller {
  fileName = 'body-awareness.csv';

  questionPairs = [
    {
      name: 'body-likeness',
      negative: 'I dislike my body',
      positive: 'I like my body',
      rangeMin: '-5',
      rangeMax: '5',
      value: 0,
    },
    {
      name: 'hopefulness',
      negative: "Hopeless",
      positive: "I'm full of hope",
      rangeMin: '-5',
      rangeMax: '5',
      value: 0,
    },
  ];

  @tracked
  parsedData = null;

  @tracked
  download = null;

  @tracked
  downloadUrl = null;

  parseToCSV(rawData) {
    let data = [];

    this.addNewEntry(data, rawData);

    let result = Papa.unparse(data, {
      skipEmptyLines: false,
    });

    return result;
  }

  addNewEntry(existingData, rawData) {
    let newEntry = {};

    rawData.forEach(entry => {
      let key = entry.name;
      newEntry[key] = entry.value;
    });

    newEntry['created_at'] = new Date();
    existingData.push(newEntry);
  }

  prepareDownload(csv, filename) {
    let csvFile = new Blob([csv], {type: "text/csv"});
    this.download = filename;
    this.downloadUrl = window.URL.createObjectURL(csvFile);
  }

  @action
  submitForm(data, event) {
    event?.preventDefault();
    // prepare download of data...
    this.parsedData = this.parseToCSV(data);
    this.prepareDownload(this.parsedData, this.fileName);
  }
}
