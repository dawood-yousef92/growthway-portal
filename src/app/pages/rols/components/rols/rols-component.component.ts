import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { RolsService } from '../../rols.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rols-component',
  templateUrl: './rols-component.component.html',
  styleUrls: ['./rols-component.component.scss'],
})
export class RolsListComponent implements OnInit {
  permissions = localStorage.getItem('permissions');
  selectedRolId:string;
  dataSettings:any = {
    selectedRolesIds: [],
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: 10,
    selectedPageSize: 0
  }

  displayedColumns: string[] = ['name', 'isDefault', 'createdOn'];
  customActions:any[] = [];
  pagingData:any = {length: 100, pageSize: 10, pageIndex: 1};
  gridData:any[];

  @ViewChild('deleteModal', { static: false }) deleteModal: ElementRef;

  constructor(private rolsService:RolsService, private toaster: ToastrService, private router: Router,
              private loderService: LoaderService, private modalService: NgbModal) {}

  getRols() {
    this.loderService.setIsLoading = true;
    this.rolsService.getRols(this.dataSettings).subscribe((data) => {
      if(data.result.roles.items) {
        this.gridData = data.result.roles.items.map((item) => {
          if(item.isDefault) {
            item.isDefault = '<span class="label label-lg label-light-success label-inline">Defalt</span>';
          }
          else {
            item.isDefault = '<span class="label label-lg label-light-danger label-inline">Not defalt</span>';
          }
          item.createdOn = this.getDateFormat(item.createdOn);
          return item;
        })
        this.gridData = data.result.roles.items;
      }
      else {
        this.gridData = [];
      }
      this.pagingData.length = data.result.roles.totalRows;
      this.pagingData.pageSize = data.result.roles.totalRowsPerPage;
      this.pagingData.pageIndex = data.result.roles.currentPage - 1;
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    })
  }

  getDateFormat(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [ day, month, year,].join('/');
  }

  ngOnInit() {
    this.getRols();
    this.checkPermissions();
  }

  checkPermissions() {
    if(this.permissions.includes('Roles.UpdateRole')) {
      this.customActions.push({name: 'edit', icon:'flaticon2-edit text-warning'})
    }
    if(this.permissions.includes('Roles.DeleteRole')) {
      this.customActions.push({name: 'delete', icon:'flaticon2-trash text-danger'})
    }
    if(this.customActions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  actionsEvent(event) {
    this.selectedRolId = event.rowId;
    if(event.type === 'view') {
      alert('view');
    }
    else if(event.type === 'edit') {
      this.router.navigate([`/rols/edit-rol/${this.selectedRolId}`]);
    }
    else if(event.type === 'delete') {
      this.openCentred(this.deleteModal);
    }
  }

  changePagingEvent(event) {
    this.dataSettings.pageNumber = event.pageIndex + 1;
    this.dataSettings.rowsPerPage = event.pageSize;
    this.getRols();
  }
  
  filterEvent(event) {
    this.dataSettings.pageNumber = 0;
    this.dataSettings.sortBy = "";
    this.dataSettings.searchText = event.filter;
    this.getRols();
  }
  
  sortEvent(event) {
    this.dataSettings.sortBy = this.capitalizeFLetter(event.active)+' '+event.direction;
    this.getRols();
  }

  capitalizeFLetter(value) { 
    var string = value; 
    return string[0].toUpperCase() + string.slice(1); 
  }

  confirmDeleteRol() {
    this.loderService.setIsLoading = true;
    this.rolsService.deleteRol(this.selectedRolId).subscribe((data) => {
      this.loderService.setIsLoading = false;
      this.toaster.success(data.result);
      this.getRols();
      this.modalService.dismissAll();
    },(error)=>{
      this.loderService.setIsLoading = false;
      this.modalService.dismissAll();
    });
  }

  openCentred(content) {
    this.modalService.open(content, { centered: true } );
  }
}
