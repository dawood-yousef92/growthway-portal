import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
    constructor() {}
    permissions = localStorage.getItem('permissions');
    customActions:any[] = [];
    displayedColumns: string[] = ['Client', 'OrderDate', 'ItemsCount', 'Price', 'Status', 'SentDate'];
    actions:any = [];
    gridData:any[] = [];

    actionsEvent(event) {
        if(event.type === 'edit') {
            alert('edit');
        }
        else if(event.type === 'delete') {
            alert('delete');
        }
    }

    checkPermissions() {
        // if(this.permissions.includes('Products.UpdateProduct')) {
        this.customActions.push({name: 'edit', icon:'flaticon2-edit text-warning'})
        // }
        // if(this.permissions.includes('Products.DeleteProduct')) {
        this.customActions.push({name: 'delete', icon:'flaticon2-trash text-danger'})
        // }
        // if(this.customActions.length > 0) {
        this.displayedColumns.push('actions');
        // }
    }

    ngOnInit() {
        this.checkPermissions();
        setTimeout(() => {
            this.gridData = [
                {
                    Client:'Zaid Yosif',
                    OrderDate:'29/2/2021',
                    ItemsCount:'3',
                    Price:'22',
                    Status:'Sent',
                    SentDate:'10/10/2021',
                },
                {
                    Client:'Dawood Yosif',
                    OrderDate:'29/2/2021',
                    ItemsCount:'3',
                    Price:'22',
                    Status:'Sent',
                    SentDate:'10/10/2021',
                },
                {
                    Client:'Abood Yosif',
                    OrderDate:'29/2/2021',
                    ItemsCount:'3',
                    Price:'22',
                    Status:'Sent',
                    SentDate:'10/10/2021',
                },
            ];
        }, 500);
    }
}
