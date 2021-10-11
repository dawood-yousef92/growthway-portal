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
import { ServicesComponent } from './services.component';
import { AddServiceComponent } from './components/add-service/add-service.component';
import { ServicesListComponent } from './components/services-list/services-list.component';
import {MatIconModule} from '@angular/material/icon';
import { ImageCropperModule } from 'ngx-image-cropper';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';


@NgModule({
  declarations: [ServicesComponent, AddServiceComponent, ServicesListComponent],
  imports: [
    CommonModule,
    TranslationModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule.forChild([
      {
        path: '',
        component: ServicesComponent,
        children: [
            {
                path: '',
                component: ServicesListComponent,
                canActivate: [RoleGuard], 
                data: { 
                  expectedRole: 'Products.GetProducts'
                }     
            },
            {
                path: 'add-service',
                component: AddServiceComponent,
                canActivate: [RoleGuard], 
                data: { 
                  expectedRole: 'Products.CreateProduct'
                }
            },
            {
                path: 'edit-service/:id',
                component: AddServiceComponent,
                canActivate: [RoleGuard], 
                data: { 
                  expectedRole: 'Products.UpdateProduct'
                }
            },
        ]
      },
    ]),

    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatTabsModule,
    GeneralModule,
    MatIconModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,

  ],
  exports: [RouterModule],
})
export class ServicesModule {}
