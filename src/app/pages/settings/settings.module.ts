import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralModule } from 'src/app/_metronic/partials/layout/general/general.module';
import { SettingsComponent } from './settings.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';
import { SigninSettingsComponent } from './components/signin-settings/signin-settings.component';
import { PasswordSettingsComponent } from './components/password-settings/password-settings.component';
import { LockoutSettingsComponent } from './components/lockout-settings/lockout-settings.component';
import { FileStorageSettingsComponent } from './components/file-storage-settings/file-storage-settings.component';
import { TokenSettingsComponent } from './components/token-settings/token-settings.component';
import {MatRadioModule} from '@angular/material/radio';



@NgModule({
  declarations: [SettingsComponent, UserSettingsComponent, SigninSettingsComponent, PasswordSettingsComponent, LockoutSettingsComponent, FileStorageSettingsComponent, TokenSettingsComponent],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
      },
    ]),

    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    GeneralModule,
    MatRadioModule,

  ],
  exports: [RouterModule],
})
export class SettingsModule {}
