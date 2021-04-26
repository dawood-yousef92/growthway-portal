import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
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
	@Input() branches:any[];
	permissions = localStorage.getItem('permissions');
	customActions:any[] = [];
	displayedColumns: string[] = ['orderNumber', 'customerName', 'status', 'totalDueAmount'];
	actions:any = [];
	gridData:any[] = [];
	orderId:string;
	eventStatus:string;
	orderDetails:any;

	acceptOrderForm: FormGroup;
	rejectOrderForm: FormGroup;

	constructor(private OrdersService:OrdersService,
		private loderService: LoaderService,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private toaster: ToastrService,) {}

	ngOnChanges(changes: SimpleChanges) {
		this.getOrders();
	}

	initAcceptOrderForm() {
		this.acceptOrderForm = this.fb.group({
		  branchId: [
			this.getBranchId() || ''
		  ],
		  expectedDeliveryDate: [
			this.getEstimatedDeliveryDate() || ''
		  ]
		})
	}

	initRejectOrderForm() {
		this.rejectOrderForm = this.fb.group({
		  notes: [
			''
		  ]
		})
	}

	getDateFormat(date) {
		if(!date)
		   return '----';

		var d = new Date(date),
			month = '' + (d.getMonth() + 1),
			day = '' + (d.getDate() + 1),
			year = d.getFullYear();
	
		if (month.length < 2) 
			month = '0' + month;
		if (day.length < 2) 
			day = '0' + day;
	
		return [ day, month, year,].join('/');
	}

	getBranchId() {
		return this.gridData.find(item => item.id === this.orderId).branchId;
	}

	getEstimatedDeliveryDate() {
		return this.gridData.find(item => item.id === this.orderId).expectedDeliveryDate;
	}

	actionsEvent(event) {
		this.orderId = event.rowId;
		this.eventStatus = event?.type.toUpperCase();
		if(event.type === 'Accept' || event.type === 'Reject' || event.type === 'Send') {
			this.initAcceptOrderForm();
			this.initRejectOrderForm();
			this.openCentred(this.changeStatusModal);
		}
		if(event.type === 'View') {
      	this.getOrder();
			this.openCentred(this.orderDetailsModal);
		}
	}

	openCentred(content) {
		this.modalService.open(content, { centered: true } );
	}

	  
	acceptOrder() {
		this.loderService.setIsLoading = true;
		let nextStatus = '';
		if(this.eventStatus === 'ACCEPT') {
			nextStatus = 'c91d4598-1bfd-42bb-abaf-c161151cb127';
		}
		else if(this.eventStatus === 'SEND') {
			nextStatus = '8ce0ae9c-511b-4992-84a0-b05fa61d1e78';
		}
		this.OrdersService.updateOrder({
			statusId: nextStatus,
			id: this.orderId,
			branchId: this.acceptOrderForm.controls.branchId.value,
			expectedDeliveryDate: this.acceptOrderForm.controls.expectedDeliveryDate.value
		}).subscribe((data) => {
			this.toaster.success(data.result);
			this.loderService.setIsLoading = false;
			this.getOrders();
			this.modalService.dismissAll();
		}, (error) => {
			this.loderService.setIsLoading = false;
		});
	}

	rejectOrder() {
		this.loderService.setIsLoading = true;
		this.OrdersService.updateOrder({
			statusId: 'f18a701e-55a7-476a-bcaa-c7c894041a29',
			id: this.orderId,
			notes: this.rejectOrderForm.controls.notes.value,
		}).subscribe((data) => {
			this.toaster.success(data.result);
			this.loderService.setIsLoading = false;
			this.getOrders();
			this.modalService.dismissAll();
		}, (error) => {
			this.loderService.setIsLoading = false;
		});
	}

	getOrder() {
		this.OrdersService.getOrder(this.orderId).subscribe((data) => {
			this.orderDetails = data.result.orderItemForEdit;
		});
	}

	checkPermissions() {
   		if(this.permissions.includes('Orders.GetOrder')) {
		  	this.customActions.push({name: 'View', icon:'flaticon-eye text-warning'})
		}
		if((this.permissions.includes('Orders.UpdateOrder') || true) && this.statusId === 'bd0a4950-4559-40ce-a6fe-4d081aa7a880') {
			this.customActions.push({name: 'Accept', icon:'flaticon2-check-mark text-success'});
			this.customActions.push({name: 'Reject', icon:'flaticon2-cancel-music text-danger'});
		}
		if((this.permissions.includes('Orders.UpdateOrder') || true) && this.statusId === 'c91d4598-1bfd-42bb-abaf-c161151cb127') {
			this.customActions.push({name: 'Send', icon:'flaticon2-delivery-truck text-success'});
		}
		if(this.customActions.length > 0) {
		  	this.displayedColumns.push('actions');
		}
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
