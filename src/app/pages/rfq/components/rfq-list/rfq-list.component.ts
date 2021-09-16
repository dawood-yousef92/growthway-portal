import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomersService } from 'src/app/pages/customers/customers.service';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';


@Component({
  selector: 'app-rfq-list',
  templateUrl: './rfq-list.component.html',
  styleUrls: ['./rfq-list.component.scss']
})
export class RfqListComponent implements OnInit {
    activeTab:number = 0;
    // branches:any = [];
    type:string;
    filter:any = [
        {id: 1, name:'LAST_HOUR'},
        {id: 2, name:'TODAY'},
        {id: 3, name:'LAST_WEEK'},
        {id: 4, name:'LAST_MONTH'},
        {id: 5, name:'LAST_YEAR'}
    ]
    customerId:string = null;
    // branchId:string = null;
    dateFrom:any = null;
    dateTo:any = null;
    selectedDateFrom:string = null;
    selectedDateTo:string = null;
    durationType:number = null;
    FilterForm: FormGroup;
    customers:any = [];
    customersFilter:string = '';

  constructor( private loaderService: LoaderService,
    private customersService: CustomersService,
    private fb: FormBuilder,) {}

  ngOnInit() {
    this.initFilterForm();
    // this.getBranches();
    this.getCustomers();
  }

  getCustomers() {
    this.customersService.getCustomers({
        "searchText": "",
        "sortBy": "",
        "pageNumber": 0,
        "rowsPerPage": 0,
        "selectedPageSize": 0
        }).subscribe((data) => {
            this.customers = data.result.item.items;
        });
    }

    search(e,type) {
        if(type === 'customers') {
        this.customersFilter = e;
        }
    }

    changeActiveTab(e) {
      this.loaderService.setIsLoading = true;
      this.activeTab = e.index;
    }

    initFilterForm() {
		this.FilterForm = this.fb.group({
		  customerId: [
			this.customerId || null
		  ],
		  // branchId: [
			// this.branchId || null
		  // ],
		  durationType: [
			this.durationType || null
		  ],
		  dateFrom: [
			this.dateFrom || null
		  ],
		  dateTo: [
			this.dateTo || null
		  ],
		})
	}

  // getBranches() {
  //     this.branchesService.getBranchesByUser({}).subscribe((data) => {
  //         this.branches = data.result.branches.items;
  //     });
  // }

  // changeBranch(e) {
  //     this.branchId = e.value;
  // }

  changeCustomer(e) {
      this.customerId = e.value;
  }

  changeFilterType(e) {
    this.durationType = e.value;
    this.FilterForm.get('dateFrom').setValue(null);
    this.FilterForm.get('dateTo').setValue(null);
    this.dateFrom = null;
    this.dateTo = null;
  }

  changeDate(start,end) {
    if(end) {
        this.FilterForm.get('durationType').setValue(null);
        this.selectedDateFrom = null;
        this.selectedDateTo = null;
        this.durationType = null;
        this.dateFrom = start;
        this.dateTo = end;
    }
  }

  clear() {
    this.selectedDateFrom = null;
    this.selectedDateTo = null;
    this.FilterForm.get('dateFrom').setValue(null);
    this.FilterForm.get('dateTo').setValue(null);
    this.FilterForm.get('durationType').setValue(null);
    this.FilterForm.get('branchId').setValue(null);
    this.FilterForm.get('customerId').setValue(null);
    this.dateTo = null;
    this.dateFrom = null;
    this.durationType = null;
    // this.branchId = null;
    this.customerId = null;
  }

}
