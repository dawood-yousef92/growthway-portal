import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslationModule } from 'src/app/modules/i18n/translation.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { GeneralModule } from 'src/app/_metronic/partials/layout/general/general.module';
import { AuthGuard } from 'src/app/modules/auth/_services/auth.guard';
import { RoleGuardService as RoleGuard } from 'src/app/modules/auth/_services/role-guard.service';
import { BranchesComponent } from './branches.component';
import { BranchesListComponent } from './components/branches-list/branches-list.component';
import { AddBranchComponent } from './components/add-branch/add-branch.component';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [BranchesComponent, BranchesListComponent, AddBranchComponent],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BranchesComponent,
        children: [
            {
                path: '',
                component: BranchesListComponent,
                canActivate: [RoleGuard], 
                data: { 
                  expectedRole: 'Branches.GetBranches'
                }     
            },
            {
                path: 'add-branch',
                component: AddBranchComponent,
                canActivate: [RoleGuard], 
                data: { 
                  expectedRole: 'Branches.CreateBranch'
                }
            },
            {
                path: 'edit-branch/:id',
                component: AddBranchComponent,
                canActivate: [RoleGuard], 
                data: { 
                  expectedRole: 'Branches.UpdateBranch'
                }
            },
        ]
      },
    ]),

    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    GeneralModule,
    NgxMatSelectSearchModule

  ],
  exports: [RouterModule],
})
export class BranchessModule {}
