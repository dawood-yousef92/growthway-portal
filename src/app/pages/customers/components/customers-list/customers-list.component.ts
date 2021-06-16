import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
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
  filter:any = [
    {id: 1, name:'LAST_HOUR'},
    {id: 2, name:'TODAY'},
    {id: 3, name:'LAST_WEEK'},
    {id: 4, name:'LAST_MONTH'},
    {id: 5, name:'LAST_YEAR'}
  ]
  dataSettings:any = {
    selectedRolesIds: [],
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: null,
    selectedPageSize: 0
  }

  displayedColumns: string[] = ['logo', 'name', 'email', 'isVerified', 'phoneNumber'];
  actions:any = [];
  pagingData:any = {length: 100, pageSize: 10, pageIndex: 1};
  gridData:any[] = [];
  durationType:number = null;
  dateFrom:any = null;
  dateTo:any = null;
  FilterForm: FormGroup;
  
  constructor(private customersService: CustomersService,
              private loderService: LoaderService,
              private toaster: ToastrService,
              private router: Router,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private translate: TranslateService,) { }

  checkPermissions() {
    this.customActions.push({name: 'View', icon:'flaticon-eye text-warning'})

    if (this.permissions.includes('Orders.GetOrders')) {
      this.customActions.push({ name: 'View Orders', icon: 'flaticon2-box text-primary' })
    }
    if (this.customActions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  initFilterForm() {
		this.FilterForm = this.fb.group({
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

  changeFilterType(e) {
    let durationType = {};
    if(e.value) {
      this.FilterForm.get('dateFrom').setValue(null);
      this.FilterForm.get('dateTo').setValue(null);
      this.dateFrom = null;
      this.dateTo = null;
      this.durationType = e.value;
      durationType = {'durationType': e.value};
    }
    this.getCustomers(durationType);
  }

  changeDate(start,end) {
    if(end) {
      this.FilterForm.get('durationType').setValue(null);
      this.durationType = null;
      this.dateFrom = start;
      this.dateTo = end;
      this.getCustomers(
        {
          dateFrom: new Date(Number(start?.split('/')[2]),Number(start?.split('/')[1]) -1,Number(start?.split('/')[0]) + 1),
          dateTo: new Date(Number(end?.split('/')[2]),Number(end?.split('/')[1]) -1,Number(end?.split('/')[0]) + 1),
        }
      );
    }
  }

  clear() {
    this.FilterForm.get('dateFrom').setValue(null);
    this.FilterForm.get('dateTo').setValue(null);
    this.FilterForm.get('durationType').setValue(null);
    this.dateTo = null;
    this.dateFrom = null;
    this.durationType = null;
    this.getCustomers({});
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

  getCustomers(filterData) {
    this.loderService.setIsLoading = true;
    this.customersService.getCustomers(filterData).subscribe((data) => {
      this.gridData = data.result.item.items.map((item) => {
        item.logo = `<img src="${item.logo || './assets/images/default-img.png'}" class="img-table-col"/>`;
        if(item.isVerified) {
          item.isVerified =  '<span class="label label-lg label-light-success label-inline">' + this.translate.instant('TITLE.VERIFIED') + '</span>';
        }
        else {
          item.isVerified = '<span class="label label-lg label-light-danger label-inline">' + this.translate.instant('TITLE.NOT_VERIFIED') + '</span>';
        }
        return item;
      })
      this.gridData = data.result.item.items;
      this.loderService.setIsLoading = false;
      this.gridData = data.result.item.items;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getCustomerById() {
    this.loderService.setIsLoading = true;
    this.customersService.getCustomerById({id:this.selectedCustomerId}).subscribe((data) => {
      this.customer = data.result.customerModel;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  openCentred(content) {
		this.modalService.open(content, { centered: true, size: 'lg', } );
	}

  replaceAll(string, search, replace) {
		return string.split(search).join(replace);
	}

  ngOnInit(): void {
    this.initFilterForm();
    this.checkPermissions();

    this.route.params.subscribe((data) => {
      let filter = data.filter;

      if(!filter?.includes('to') && !filter?.includes('-') && filter?.length === 1) {
          this.durationType = Number(filter);
          this.getCustomers({
            "durationType": this.durationType,
            "sortBy": "",
            "pageNumber": 0,
            "rowsPerPage": 0,
            "selectedPageSize": 0
          });
      }
      else if(filter?.includes('to')) {
          let arr = filter.split('to');
          arr[0] = this.replaceAll(arr[0],'-','/')
          arr[1] = this.replaceAll(arr[1],'-','/')
          this.dateFrom = new Date(Number(arr[0]?.split('/')[2]),Number(arr[0]?.split('/')[1]) -1,Number(arr[0]?.split('/')[0]));
          this.dateTo = new Date(Number(arr[1]?.split('/')[2]),Number(arr[1]?.split('/')[1]) -1,Number(arr[1]?.split('/')[0]));
          this.getCustomers({
            "dateFrom": new Date(Number(arr[0]?.split('/')[2]),Number(arr[0]?.split('/')[1]) -1,Number(arr[0]?.split('/')[0]) + 1),
            "dateTo": new Date(Number(arr[1]?.split('/')[2]),Number(arr[1]?.split('/')[1]) -1,Number(arr[1]?.split('/')[0]) + 1),
            "sortBy": "",
            "pageNumber": 0,
            "rowsPerPage": 0,
            "selectedPageSize": 0
          });
      }
      else {
        this.getCustomers({ 
          "searchText": "",
          "sortBy": "",
          "pageNumber": 0,
          "rowsPerPage": 0,
          "selectedPageSize": 0
        });
      }
      this.initFilterForm();
    });
  }

}
