import FileReader from 'ember-file-upload/system/file-reader';
import { isPresent } from '@ember/utils';

export async function fileToText(file) {
  let objectURL = window.URL.createObjectURL(file);
  let reader = new FileReader();
  return await reader.readAsText(file);
}

export function mapByKey(json, valueKey, options) {
  let key = valueKey || 'value';
  let list = json.mapBy(key);

  if (options?.add) {
    list.push(options.add);
  }

  return list;
}

export function listToText(list) {
  return list.join(',');
}

export function writeLineToFile(existingText, newText) {
  let baseText = existingText || '';

  if (isPresent(existingText) && !existingText.endsWith(`\n`)) {
    baseText += '\n';
  }

  baseText += newText + `\n`;
  return baseText;
}

export function generateFileText(existingFileText, entryAsJSON, currentDate) {
  let updatedText = existingFileText || '';

  if (fileHasExistingData(existingFileText)) {
    if (hasDataMismatch(existingFileText, entryAsJSON)) {
      return;
    }
  } else {
    let headerText = getHeaders(entryAsJSON);
    updatedText = writeLineToFile(updatedText, headerText);
  }

  let bodyText = getNewEntry(entryAsJSON, currentDate);
  return writeLineToFile(updatedText, bodyText);
}

export function fileHasExistingData(data) {
  return isPresent(data);
}

export function hasDataMismatch() {
  return false;
}

export function getHeaders(data) {
  let headerList = mapByKey(data, 'name', { add: 'created_at' });
  return listToText(headerList);
}

export function getNewEntry(data, currentDate) {
  let entryList = mapByKey(data, 'value', { add: currentDate });
  return listToText(entryList);
}

export default {
  fileToText,
  listToText,
  writeLineToFile,
  generateFileText,
  fileHasExistingData,
  getHeaders,
  getNewEntry,
};
