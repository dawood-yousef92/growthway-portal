import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-classification',
  templateUrl: './add-classification.component.html',
  styleUrls: ['./add-classification.component.scss']
})
export class AddClassificationComponent implements OnInit {

  classificationForm: FormGroup;
  constructor(private fb: FormBuilder,) { }

  initForm() {
    this.classificationForm = this.fb.group(
    {
      name: [
        ''
      ],
      description: [
        ''
      ],
    });
  }

  submit() {
    alert('saved');
  }

  ngOnInit(): void {
    this.initForm();
  }

}
