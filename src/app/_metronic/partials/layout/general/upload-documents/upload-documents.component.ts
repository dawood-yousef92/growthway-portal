import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-upload-documents',
  templateUrl: './upload-documents.component.html',
  styleUrls: ['./upload-documents.component.css']
})

export class UploadDocumentsComponent implements OnInit {

  @Input() selectedFiles: File[];

  @Output() selectFiles: EventEmitter<any> = new EventEmitter();

  errorImageSize:boolean = false;

  constructor() { }

  readfiles(files) {
    if (files.length > 0) {
      for (var i = 0; i < files.length; i++) {
        if(files[i].size > 2000000 
          || (!files[i].type.includes('doc')
          && !files[i].type.includes('docs') 
          && !files[i].type.includes('pdf')
          && !files[i].type.includes('text')
          && !files[i].type.includes('docx')
          && !files[i].type.includes('jpg')
          && !files[i].type.includes('jpeg')
          && !files[i].type.includes('png')
        )) {
          this.errorImageSize = true;
          // this.selectedFiles = [];
          this.emitFiles();
          return;
        }
        else {
          this.errorImageSize = false;
          this.selectedFiles.push(files[i]);
        }
      }
    }
    this.emitFiles();
  }

  readURL(e) {
    let inputTarget = e.target;
    if (inputTarget.files.length > 0) {
      for (var i = 0; i < inputTarget.files.length; i++) {
        if(inputTarget.files[i].size > 2000000 
          || (!inputTarget.files[i].type.includes('doc')
          && !inputTarget.files[i].type.includes('docs') 
          && !inputTarget.files[i].type.includes('pdf')
          && !inputTarget.files[i].type.includes('text')
          && !inputTarget.files[i].type.includes('docx')
          && !inputTarget.files[i].type.includes('jpg')
          && !inputTarget.files[i].type.includes('jpeg')
          && !inputTarget.files[i].type.includes('png')
        )) {
          this.errorImageSize = true;
          // this.selectedFiles = [];
          this.emitFiles();
          return;
        }
        else {
          this.errorImageSize = false;
          this.selectedFiles.push(inputTarget.files[i]);
        }
      }
    }
    this.emitFiles();
  }

  dragOverEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dragendEvent(event) {
    event.stopPropagation();
    event.preventDefault();
  }

  dropEvent(event) {
    event.stopPropagation();
    event.preventDefault();
    this.readfiles(event.dataTransfer.files);
  }

  clickInput() {
    let element = document.getElementById('dropFiles');
    element.click();
  }

  deleteFile(index) {
    this.selectedFiles.splice(index, 1);
    this.emitFiles();
    (document.getElementById('dropFiles') as HTMLInputElement).value = null;
  }

  getFileIcon(index) {
    if(this.selectedFiles[index].type.includes('pdf'))
    {
      return 'pdf.png';
    }
    else if(this.selectedFiles[index].type.includes('text')) {
      return 'txt.png';
    }
    else if(this.selectedFiles[index].type.includes('doc') || this.selectedFiles[index].type.includes('docs') || this.selectedFiles[index].type.includes('docsx')) {
      return 'doc.png';
    }
    else {
      return 'default.png';
    }
  }

  emitFiles() {
    this.selectFiles.emit({documents:this.selectedFiles});
  }

  ngOnInit(): void {
  }


}
