import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BranchesService } from '../branches/branches.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
    branchId:string = '';
    activeTab:number = 0;
    branches:any = [];
    type:string;

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
        a += '.mat-column-actions {display: none;}'
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

    ngOnInit() {
        this.getBranches();
        this.route.params.subscribe((data) => {
            this.type = data.type;
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
        });
    }
}
