import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { CustomersService } from '../../customers.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  @ViewChild('viewCustomerModal', { static: false }) viewCustomerModal: ElementRef;
  permissions = localStorage.getItem('permissions');
  customActions:any[] = [];
  selectedCustomerId:string;
  customer:any;
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
              private router: Router,
              private modalService: NgbModal,) { }

  checkPermissions() {
    this.customActions.push({name: 'View', icon:'flaticon-eye text-warning'})

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
    else if(event.type === 'View') {
      this.openCentred(this.viewCustomerModal);
      this.getCustomerById();
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

  getCustomerById() {
    this.loderService.setIsLoading = true;
    this.customersService.getCustomerById({id:this.selectedCustomerId}).subscribe((data) => {
      console.log(data);
      this.customer = data.result.customerModel;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  openCentred(content) {
		this.modalService.open(content, { centered: true, size: 'lg', } );
	}

  ngOnInit(): void {
    this.checkPermissions();
    this.getCustomers();
  }

}
