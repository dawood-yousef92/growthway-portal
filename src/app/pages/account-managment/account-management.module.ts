import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProfileComponent } from './components/profile/profile.component';
import { ChangeEmailComponent } from './components/change-email/change-email.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { MatTabsModule } from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ProfileDataComponent } from './components/profile/profile-data/profile-data.component';
import { PersonalDataComponent } from './components/profile/personal-data/personal-data.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ProfileComponent, ChangeEmailComponent, ChangePasswordComponent, ProfileDataComponent, PersonalDataComponent],
  imports: [
    CommonModule,
    TranslationModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'change-email',
        component: ChangeEmailComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
    ]),

    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
})
export class AccountManagement {}
