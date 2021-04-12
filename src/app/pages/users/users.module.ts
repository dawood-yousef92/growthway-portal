import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsersListComponent } from './components/users-component/users-component.component';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddUserComponent } from './components/add-user/add-user.component';
import { UsersComponent } from './users.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralModule } from 'src/app/_metronic/partials/layout/general/general.module';
import { RoleGuardService as RoleGuard } from 'src/app/modules/auth/_services/role-guard.service';



@NgModule({
  declarations: [UsersComponent,UsersListComponent, AddUserComponent],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    RouterModule.forChild([
      {
        path: '',
        component: UsersComponent,
        children: [
          {
            path: '',
            component: UsersListComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Users.GetUsers'
            }
          },
          {
            path: 'add-user',
            component: AddUserComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Users.CreateUser'
            }
          },
          {
            path: 'edit-user/:id',
            component: AddUserComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Users.UpdateUser'
            }
          },
          {
            path: 'edit-user-permissions/:id',
            component: AddUserComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Users.GetUserPermissions'
            }
          },
        ]
      },
    ]),

    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    GeneralModule

  ],
  exports: [RouterModule],
})
export class UsersModule {}
