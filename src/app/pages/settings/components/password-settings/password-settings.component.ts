import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-password-settings',
  templateUrl: './password-settings.component.html',
  styleUrls: ['./password-settings.component.scss']
})
export class PasswordSettingsComponent implements OnChanges {
  @Input() settings:any;
  @Output() emmitSettings: EventEmitter<any> = new EventEmitter();
  
  passwordSettings: FormGroup;
  constructor(private fb: FormBuilder,) {
    this.initForm();
  }

  initForm() {
    this.passwordSettings = this.fb.group(
    {
      id: [
        this.settings?.id || '',
      ],
      requireLength: [
        this.settings?.requiredLength || '',
      ],
      requireUniqueCharacters: [
        this.settings?.requiredUniqueChars || '',
      ],
      requireDigits: [
        this.settings?.requireDigit || false,
      ],
      requireLowerCaseChar: [
        this.settings?.requireLowercase || false,
      ],
      requirenonAlphanumeric: [
        this.settings?.requireNonAlphanumeric || false,
      ],
      requireUpperCaseChar: [
        this.settings?.requireUppercase || false,
      ],
    });
  }

  submit() {
    this.emmitSettings.emit(
      {
        passwordSettings: {
          id: this.passwordSettings.controls.id.value,
          requiredLength: this.passwordSettings.controls.requireLength.value,
          requiredUniqueChars: this.passwordSettings.controls.requireUniqueCharacters.value,
          requireDigit: this.passwordSettings.controls.requireDigits.value,
          requireLowercase: this.passwordSettings.controls.requireLowerCaseChar.value,
          requireNonAlphanumeric: this.passwordSettings.controls.requirenonAlphanumeric.value,
          requireUppercase: this.passwordSettings.controls.requireUpperCaseChar.value,
        },
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initForm();
  }
}
