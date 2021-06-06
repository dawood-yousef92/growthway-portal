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
import { AuthGuard } from 'src/app/modules/auth/_services/auth.guard';
import { RoleGuardService as RoleGuard } from 'src/app/modules/auth/_services/role-guard.service';
import { CustomersComponent } from './customers.component';
import { CustomersListComponent } from './components/customers-list/customers-list.component';
import { ClassificationsComponent } from './components/classifications/classifications.component';
import { AddClassificationComponent } from './components/add-classification/add-classification.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';



@NgModule({
  declarations: [CustomersComponent, CustomersListComponent, ClassificationsComponent, AddClassificationComponent],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        // component: CustomersComponent,
        component: CustomersListComponent,
        canActivate: [RoleGuard], 
        data: { 
          expectedRole: 'Customers.GetCustomers'
        },
        children: [
          {
            path: 'customers-list',
            component: CustomersListComponent,
            canActivate: [RoleGuard], 
            data: { 
              expectedRole: 'Customers.GetCustomers'
            }
          },
          // {
          //   path: 'classifications',
          //   component: ClassificationsComponent,
          // },
          // {
          //   path: 'classifications/add-classification',
          //   component: AddClassificationComponent,
          // },
        ]
      },
    ]),

    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    GeneralModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,

  ],
  exports: [RouterModule],
})
export class CustomersModule {}
