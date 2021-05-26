import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { BranchesService } from '../branches/branches.service';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { FormBuilder, FormGroup } from '@angular/forms';

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
    branchId:string = '';
    dateFrom:any = null;
    dateTo:any = null;
    selectedDateFrom:string = null;
    selectedDateTo:string = null;
    durationType:number = null;
    FilterForm: FormGroup;

    constructor(private fb: FormBuilder,private branchesService:BranchesService, private route: ActivatedRoute,) {}

    changeActiveTab(e) {
        this.activeTab = e.index;
    }


    initFilterForm() {
		this.FilterForm = this.fb.group({
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
        this.branchesService.getBranches({}).subscribe((data) => {
            this.branches = data.result.branches.items;
        });
    }

    changeBranch(e) {
        this.branchId = e.value;
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
        if(e.value) {
          this.durationType = e.value;
          this.FilterForm.get('dateFrom').setValue(null);
          this.FilterForm.get('dateTo').setValue(null);
          this.dateFrom = null;
          this.dateTo = null;
        }
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
        this.dateTo = null;
        this.dateFrom = null;
        this.durationType = null;
        this.branchId = null;
    }

    ngOnInit() {
        this.initFilterForm();
        this.getBranches();
        this.route.params.subscribe((data) => {
            this.type = data.type;
            let filter = data.filter;
            switch (this.type) {
                case 'new':
                    this.activeTab = 0;
                    break;
                case 'accepted':
                    this.activeTab = 1;
                    break;
                case 'rejected':
                    this.activeTab = 2;
                    break;
                case 'sent':
                        this.activeTab = 3;
                        break;
                case 'delivered':
                    this.activeTab = 4;
                    break;
                case 'all':
                    this.activeTab = 5;
                    break;
            
                default:
                    break;
            }

            if(!filter?.includes('to') && !filter?.includes('-')) {
                this.durationType = Number(filter);
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
        });
    }
}
