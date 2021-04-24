import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { OrdersService } from '../../orders.service';

@Component({
  selector: 'app-orders-statuses',
  templateUrl: './orders-statuses.component.html',
  styleUrls: ['./orders-statuses.component.scss']
})
export class OrdersStatusesComponent implements OnInit {
	@ViewChild('changeStatusModal', { static: false }) changeStatusModal: ElementRef;
	@ViewChild('orderDetailsModal', { static: false }) orderDetailsModal: ElementRef;
  @Input() statusId:string;
  @Input() branchId:string;
	permissions = localStorage.getItem('permissions');
	customActions:any[] = [];
	displayedColumns: string[] = ['orderNumber', 'customerName', 'branchName', 'status', 'totalDueAmount'];
	actions:any = [];
	gridData:any[] = [];
	orderId:string;
	eventStatus:string;
	
	constructor(private OrdersService:OrdersService,private loderService: LoaderService, private modalService: NgbModal) {}

  ngOnChanges(changes: SimpleChanges) {
    this.getOrders();
  }

	actionsEvent(event) {
		console.log(event)
		this.orderId = event.rowId;
		this.eventStatus = event?.type.toUpperCase();
		// this.openCentred(this.changeStatusModal);
		// if(event.type === 'Accept') {
		// 	alert('edit');
		// }
		// else if(event.type === 'Reject') {
		// 	alert('delete');
			// this.openCentred(this.changeStatusModal);
		// }
		if(event.type === 'View') {
			this.openCentred(this.orderDetailsModal);
		}
	}

	openCentred(content) {
		this.modalService.open(content, { centered: true } );
	}

	  
	changeStatus() {
		alert(this.eventStatus);
	}

	checkPermissions() {
    // if(this.permissions.includes('Products.DeleteProduct')) {
		this.customActions.push({name: 'View', icon:'flaticon-eye text-warning'})
		// }
		// if(this.permissions.includes('Products.UpdateProduct')) {
		// this.customActions.push({name: 'Accept', icon:'flaticon2-check-mark text-success'})
		// }
		// if(this.permissions.includes('Products.DeleteProduct')) {
		// this.customActions.push({name: 'Reject', icon:'flaticon2-cancel-music text-danger'})
		// }
		// if(this.customActions.length > 0) {
		this.displayedColumns.push('actions');
		// }
	}

	getOrders() {
		this.loderService.setIsLoading = true;
		this.OrdersService.getOrders({branchId: this.branchId, statusId: this.statusId,rowsPerPage: 5000000,}).subscribe((data) => {
      data.result.orderItems.items.map((item) => {
        item.orderNumber = item.orderNumber.toString();
        item.totalDueAmount = item.totalDueAmount.toString();
      })
			this.gridData = data.result.orderItems.items;
			this.loderService.setIsLoading = false;
		}, (error) => {
			this.loderService.setIsLoading = false;
		});
	}

	ngOnInit() {
		this.checkPermissions();
	}


}
