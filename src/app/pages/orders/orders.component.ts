import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNumber } from '@ng-bootstrap/ng-bootstrap/util/util';
import { BranchesService } from '../branches/branches.service';
import * as _moment from 'moment';
import { Moment } from 'moment';

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
    dateFrom:string = null;
    dateTo:string = null;
    selectedDateFrom:string = null;
    selectedDateTo:string = null;
    durationType:number = null;

    constructor( private branchesService:BranchesService, private route: ActivatedRoute,) {}

    changeActiveTab(e) {
        this.activeTab = e.index;
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
            this.selectedDateFrom = null;
            this.selectedDateTo = null;
            this.dateFrom = start;
            this.dateTo = end;
            this.durationType = null;
        }
    }

    changeFilterType(e) {
        if(e.value) {
          this.durationType = e.value;
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

    ngOnInit() {
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

            console.log(filter);
            if(!filter.includes('|') && !filter.includes('-')) {
                this.durationType = Number(filter);
            }
            else if(filter.includes('|')) {
                let arr = filter.split('|');
                this.selectedDateFrom = this.getDateFormat(new Date(arr[0]));
                this.dateFrom = this.getDateFormat(new Date(arr[0]));
                this.selectedDateTo = this.getDateFormat(new Date(arr[1]));
                this.dateTo = this.getDateFormat(new Date(arr[1]));
            }
        });
    }
}
