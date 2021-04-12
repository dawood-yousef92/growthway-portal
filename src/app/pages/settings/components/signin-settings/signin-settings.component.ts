import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-signin-settings',
  templateUrl: './signin-settings.component.html',
  styleUrls: ['./signin-settings.component.scss']
})
export class SigninSettingsComponent implements OnChanges {
  @Input() settings:any;
  @Output() emmitSettings: EventEmitter<any> = new EventEmitter();
  
  signinSettings: FormGroup;
  constructor(private fb: FormBuilder,) { 
    this.initForm();
  }

  initForm() {
    this.signinSettings = this.fb.group(
    {
      id: [
        this.settings?.id || false,
      ],
      confirmedAccount: [
        this.settings?.requireConfirmedAccount || false,
      ],
    });
  }

  submit() {
    this.emmitSettings.emit(
      {
        signinSettings: {
          id: this.signinSettings.controls.id.value,
          requireConfirmedAccount: this.signinSettings.controls.confirmedAccount.value,
        },
      }
    )
  }
  
  ngOnChanges(changes: SimpleChanges) {
    this.initForm();
  }
}
