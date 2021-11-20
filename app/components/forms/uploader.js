import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class FormsUploaderComponent extends Component {
  @tracked
  file = null;

  @action
  uploadFile(ev) {
    let file = ev.target.files[0];
    this.args.onUpload({ file });
    this.file = file;
  }
}
