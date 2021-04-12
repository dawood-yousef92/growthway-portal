import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RolsListComponent } from './components/rols/rols-component.component';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AddRolComponent } from './components/add-rol/add-rol.component';
import { RolsComponent } from './rols.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralModule } from 'src/app/_metronic/partials/layout/general/general.module';
import { RoleGuardService as RoleGuard } from 'src/app/modules/auth/_services/role-guard.service';



@NgModule({
  declarations: [RolsComponent,RolsListComponent, AddRolComponent],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: RolsComponent,
        children: [
          {
            path: '',
            component: RolsListComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Roles.GetRoles'
            }
          },
          {
            path: 'add-rol',
            component: AddRolComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Roles.CreateRole'
            }
          },
          {
            path: 'edit-rol/:id',
            component: AddRolComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Roles.UpdateRole'
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
    GeneralModule,

  ],
  exports: [RouterModule],
})
export class RolsModule {}
