import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnChanges {
  @Input() settings:any;
  @Output() emmitSettings: EventEmitter<any> = new EventEmitter();

  userSettings: FormGroup;
  constructor(private fb: FormBuilder,) { 
    this.initForm();
  }

  initForm() {
    this.userSettings = this.fb.group(
    {
      id: [
        this.settings?.id || '',
      ],
      allowedCharacters: [
        this.settings?.allowedUserNameCharacters || '',
      ],
      setActive: [
        this.settings?.newUsersActiveByDefault || false,
      ],
    });
  }

  submit() {
    this.emmitSettings.emit(
      {
        userSettings: {
          id: this.userSettings.controls.id.value,
          allowedUserNameCharacters: this.userSettings.controls.allowedCharacters.value,
          newUsersActiveByDefault: this.userSettings.controls.setActive.value
        },
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initForm();
  }

}
