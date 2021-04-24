import { Component, OnInit } from '@angular/core';
import { BranchesService } from '../branches/branches.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
    branchId:string = '';
    activeTab:number = 0;
    branches:any = [];

    constructor( private branchesService:BranchesService,) {}

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

    ngOnInit() {
        this.getBranches();
    }
}
