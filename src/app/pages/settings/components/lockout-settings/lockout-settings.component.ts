import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lockout-settings',
  templateUrl: './lockout-settings.component.html',
  styleUrls: ['./lockout-settings.component.scss']
})
export class LockoutSettingsComponent implements OnChanges {
  @Input() settings:any;
  @Output() emmitSettings: EventEmitter<any> = new EventEmitter();

  lockoutSettings: FormGroup;
  constructor(private fb: FormBuilder,) { }

  initForm() {
    this.lockoutSettings = this.fb.group(
    {
      id: [
        this.settings?.id || false
      ],
      alloweNewUser: [
        this.settings?.allowedForNewUsers || false
      ],
      maximumFieldAccessAttempts: [
        this.settings?.maxFailedAccessAttempts || null,
      ],
      lockoutTimeSpan: [
        this.settings?.defaultLockoutTimeSpan || null,
      ],
    });
  }

  submit() {
    this.emmitSettings.emit(
      {
        lockoutSettings: {
          id: this.lockoutSettings.controls.id.value,
          allowedForNewUsers: this.lockoutSettings.controls.alloweNewUser.value,
          maxFailedAccessAttempts: this.lockoutSettings.controls.maximumFieldAccessAttempts.value,
          defaultLockoutTimeSpan: this.lockoutSettings.controls.lockoutTimeSpan.value,
        },
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initForm();
  }

}
