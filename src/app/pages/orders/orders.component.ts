import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { BranchesService } from '../branches/branches.service';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomersService } from '../customers/customers.service';

const moment = _moment;
  
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
    activeTab:number = 0;
    branches:any = [];
    type:string;
    filter:any = [
        {id: 1, name:'LAST_HOUR'},
        {id: 2, name:'TODAY'},
        {id: 3, name:'LAST_WEEK'},
        {id: 4, name:'LAST_MONTH'},
        {id: 5, name:'LAST_YEAR'}
    ]
    customerId:string = '';
    branchId:string = '';
    dateFrom:any = null;
    dateTo:any = null;
    selectedDateFrom:string = null;
    selectedDateTo:string = null;
    durationType:number = null;
    FilterForm: FormGroup;
    customers:any = [];
    customersFilter:string = '';

    constructor(private fb: FormBuilder,
                private branchesService:BranchesService,
                private route: ActivatedRoute,
                private customersService: CustomersService, ) {}

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
        this.activeTab = e.index;
    }


    initFilterForm() {
		this.FilterForm = this.fb.group({
		  customerId: [
			this.customerId || null
		  ],
		  branchId: [
			this.branchId || null
		  ],
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

    getBranches() {
        this.branchesService.getBranchesByUser({}).subscribe((data) => {
            this.branches = data.result.branches.items;
        });
    }

    changeBranch(e) {
        this.branchId = e.value;
    }

    changeCustomer(e) {
        this.customerId = e.value;
    }

    printTable(): void {
		let printContents, popupWin;
        let styles = document.getElementsByTagName('style');
        let a = '<style>';
        for(let i = 0; i < styles.length; i++) {
            a += styles[i].innerHTML;
        }
        a += '.mat-column-actions, .mat-menu-trigger{display: none;}'
        a += '</style>';
        console.log(a);
		printContents = document.getElementsByTagName('mat-table')[0].innerHTML;
		popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1000px');
		popupWin.document.open();
		popupWin.document.write(`
		  <html>
			<head>
			    <title>Order Details</title>
                ${a}
			</head>
			<body onload="window.print();window.close()">${printContents}</body>
		  </html>`
		);
		popupWin.document.close();
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

    changeFilterType(e) {
        this.durationType = e.value;
        this.FilterForm.get('dateFrom').setValue(null);
        this.FilterForm.get('dateTo').setValue(null);
        this.dateFrom = null;
        this.dateTo = null;
    }

    getDateFormat(date) {
		if(!date)
		   return '----';

		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + (d.getDate()),
			year = d.getFullYear();
			
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [ day, month, year,].join('/');
	}

    getDate(date) {
        console.log(moment(new Date(date)), "DD/MM/YYYY");
        return moment(new Date(date), "DD/MM/YYYY");
    }

    replaceAll(string, search, replace) {
		return string.split(search).join(replace);
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
        this.branchId = null;
        this.customerId = null;
    }

    ngOnInit() {
        localStorage.removeItem('gridFilter');
        localStorage.removeItem('pageSize');
        localStorage.removeItem('pageIndex');
        this.initFilterForm();
        this.getBranches();
        this.getCustomers();
        this.route.params.subscribe((data) => {
            this.type = data.type;
            let filter = data.filter;
            switch (this.type) {
                case 'new':
                case 'bd0a4950-4559-40ce-a6fe-4d081aa7a880':
                    this.activeTab = 0;
                    break;
                case 'accepted':
                case 'c91d4598-1bfd-42bb-abaf-c161151cb127':
                    this.activeTab = 1;
                    break;
                case 'rejected':
                case 'f18a701e-55a7-476a-bcaa-c7c894041a29':
                    this.activeTab = 2;
                    break;
                case 'sent':
                case '8ce0ae9c-511b-4992-84a0-b05fa61d1e78':
                    this.activeTab = 3;
                    break;
                case 'delivered':
                case '0d014e78-7887-4f53-ab63-94f9fad40193':
                    this.activeTab = 4;
                    break;
                case 'all':
                    this.activeTab = 5;
                    break;
            
                default:
                    break;
            }

            if(!filter?.includes('to') && !filter?.includes('-') && filter?.length === 1) {
                this.durationType = Number(filter);
            }
            else if(!filter?.includes('to') && filter?.includes('-') && filter?.length > 1) {
                this.customerId = String(filter);
            }
            else if(!filter?.includes('to') && !filter?.includes('-') && filter?.length > 1) {
                localStorage.setItem('gridFilter', filter);
            }
            else if(filter?.includes('to')) {
                let arr = filter.split('to');
                arr[0] = this.replaceAll(arr[0],'-','/')
                arr[1] = this.replaceAll(arr[1],'-','/')
                console.log(arr[0]);
                console.log(arr[1]);
                this.selectedDateFrom = arr[0];
                this.dateFrom =  arr[0];
                this.selectedDateTo = arr[1];
                this.dateTo = arr[1];
            }
            this.initFilterForm();
        });
    }
}
