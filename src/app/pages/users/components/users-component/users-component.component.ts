import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { UsersService } from '../../users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


@Component({
  selector: 'app-users-component',
  templateUrl: './users-component.component.html',
  styleUrls: ['./users-component.component.scss'],
})
export class UsersListComponent implements OnInit {
  permissions = localStorage.getItem('permissions');
  customActions: any[] = [];
  selectedUserId: string;
  dataSettings: any = {
    selectedRolesIds: [],
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: 5000000,
    selectedPageSize: 0
  }

  displayedColumns: string[] = ['userName', 'email', 'isActive', 'createdOn'];
  actions: any = [];
  pagingData: any = { length: 100, pageSize: 10, pageIndex: 1 };
  gridData: any[];

  @ViewChild('deleteModal', { static: false }) deleteModal: ElementRef;

  constructor(private usersService: UsersService, private toaster: ToastrService, private router: Router,
    private loderService: LoaderService, private modalService: NgbModal) { }

  getUsers() {
    this.loderService.setIsLoading = true;
    this.usersService.getUsers(this.dataSettings).subscribe((data) => {
      if (data.result.users.items) {
        this.gridData = data.result.users.items.map((item) => {
          if (item.isActive) {
            item.isActive = '<span class="label label-lg label-light-success label-inline">Active</span>';
          }
          else {
            item.isActive = '<span class="label label-lg label-light-danger label-inline">' + item.isActive + '</span>';
          }
          item.createdOn = this.getDateFormat(item.createdOn);
          return item;
        })
        this.gridData = data.result.users.items;
      }
      else {
        this.gridData = [];
      }
      this.pagingData.length = data.result.users.totalRows;
      this.pagingData.pageSize = data.result.users.totalRowsPerPage;
      this.pagingData.pageIndex = data.result.users.currentPage - 1;
      this.loderService.setIsLoading = false;
    }, (error) => {
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

    return [day, month, year,].join('/');
  }

  ngOnInit() {
    this.getUsers();
    this.checkPermissions();
  }

  checkPermissions() {
    // console.log(this.permissions);
    if (this.permissions.includes('Users.GetUserPermissions')) {
      this.customActions.push({ name: 'permissions', icon: 'flaticon2-lock text-success' })
    }
    if (this.permissions.includes('Users.UpdateUser')) {
      this.customActions.push({ name: 'edit', icon: 'flaticon2-edit text-warning' })
    }
    if (this.permissions.includes('Users.DeleteUser')) {
      this.customActions.push({ name: 'delete', icon: 'flaticon2-trash text-danger' })
    }
    if (this.customActions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  actionsEvent(event) {
    this.selectedUserId = event.rowId;
    if (event.type === 'view') {
      alert('view');
    }
    else if (event.type === 'edit') {
      this.router.navigate([`/users/edit-user/${this.selectedUserId}`]);
    }
    else if (event.type === 'delete') {
      this.openCentred(this.deleteModal);
    }
    else if (event.type === 'permissions') {
      this.router.navigate([`/users/edit-user-permissions/${this.selectedUserId}`]);
    }
  }

  changePagingEvent(event) {
    this.dataSettings.pageNumber = event.pageIndex + 1;
    this.dataSettings.rowsPerPage = event.pageSize;
    this.getUsers();
  }

  filterEvent(event) {
    this.dataSettings.pageNumber = 0;
    this.dataSettings.sortBy = "";
    this.dataSettings.searchText = event.filter;
    this.getUsers();
  }

  sortEvent(event) {
    this.dataSettings.sortBy = this.capitalizeFLetter(event.active) + ' ' + event.direction;
    this.getUsers();
  }

  capitalizeFLetter(value) {
    var string = value;
    return string[0].toUpperCase() + string.slice(1);
  }

  confirmDeleteUser() {
    this.usersService.deleteUser(this.selectedUserId).subscribe((data) => {
      this.toaster.success(data.result);
      this.getUsers();
      this.modalService.dismissAll();
    });
  }

  openCentred(content) {
    this.modalService.open(content, { centered: true });
  }
}
