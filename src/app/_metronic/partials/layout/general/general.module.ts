import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfflineTableComponent } from './offline-table/offline-table.component';
import { TranslateModule } from '@ngx-translate/core';
import { MapComponent } from './map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [DynamicTableComponent, OfflineTableComponent, MapComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GoogleMapsModule
  ],
  exports: [DynamicTableComponent, OfflineTableComponent, MapComponent],
})
export class GeneralModule { }
