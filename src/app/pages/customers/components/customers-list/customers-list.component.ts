import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  permissions = localStorage.getItem('permissions');
  customActions:any[] = [];
  selectedCustomerId:string;
  dataSettings:any = {
    selectedRolesIds: [],
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: null,
    selectedPageSize: 0
  }

  displayedColumns: string[] = ['name', 'email', 'phoneNumber'];
  actions:any = [];
  pagingData:any = {length: 100, pageSize: 10, pageIndex: 1};
  gridData:any[] = [];
  
  constructor(private customersService: CustomersService,
              private loderService: LoaderService,
              private toaster: ToastrService,
              private router: Router) { }

  checkPermissions() {
    if (this.permissions.includes('Orders.GetOrders')) {
      this.customActions.push({ name: 'View Orders', icon: 'flaticon2-box text-primary' })
    }
    if (this.customActions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  actionsEvent(event) {
    this.selectedCustomerId = event.rowId;
    if (event.type === 'View Orders') {
      this.router.navigate([`/orders/all/${this.selectedCustomerId}`]);
    }
  }

  getCustomers() {
    this.loderService.setIsLoading = true;
    this.customersService.getCustomers({
      "searchText": "",
      "sortBy": "",
      "pageNumber": 0,
      "rowsPerPage": 0,
      "selectedPageSize": 0
    }).subscribe((data) => {
      this.gridData = data.result.item.items;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  ngOnInit(): void {
    this.checkPermissions();
    this.getCustomers();
  }

}
