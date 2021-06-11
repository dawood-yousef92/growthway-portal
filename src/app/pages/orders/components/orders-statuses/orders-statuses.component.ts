import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { OrdersService } from '../../orders.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-orders-statuses',
  templateUrl: './orders-statuses.component.html',
  styleUrls: ['./orders-statuses.component.scss']
})
export class OrdersStatusesComponent implements OnInit {
	@ViewChild('changeStatusModal', { static: false }) changeStatusModal: ElementRef;
	@ViewChild('orderDetailsModal', { static: false }) orderDetailsModal: ElementRef;
	@Input() statusId:string;
	@Input() branchId:any;
	@Input() customerId:any;
	@Input() durationType:any;
	@Input() dateFrom:string;
	@Input() dateTo:string;
	@Input() branches:any[];
	permissions = localStorage.getItem('permissions');
	customActions:any[] = [];
	displayedColumns: string[] = ['orderNumber', 'createdOn', 'createdTime', 'customerName', 'customerPhone', 'status', 'totalDueAmount'];
	actions:any = [];
	gridData:any[] = [];
	orderId:string;
	eventStatus:string;
	orderDetails:any;
	originalOrderDetailsItems:any;
	minDate:Date = new Date();

	acceptOrderForm: FormGroup;
	rejectOrderForm: FormGroup;
	sentOrderForm: FormGroup;
	drivers:any;
	driversFilter:string = '';

	constructor(private OrdersService:OrdersService,
		private loderService: LoaderService,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private toaster: ToastrService,
		private translate: TranslateService,) {}

	ngOnChanges(changes: SimpleChanges) {
		this.getOrders();
	}

	search(e,type) {
		if(type === 'drivers') {
		  this.driversFilter = e;
		}
	}

	getCompanyDrivers() {
		this.OrdersService.getCompanyDrivers({}).subscribe((data) => {
			this.drivers = data.result.driverItems;
		});
	}

	initAcceptOrderForm() {
		this.acceptOrderForm = this.fb.group({
		  branchId: [
			this.getBranchId() || '',
			Validators.compose([
				Validators.required,
			]),
		  ],
		  expectedDeliveryDate: [
			this.getEstimatedDeliveryDate() || '',
			Validators.compose([
				Validators.required,
			]),
		  ],
		  driverId: [
			this.getDriver() || null
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

	initSentOrderForm() {
		this.sentOrderForm = this.fb.group({
			deliveryDate: [
				'',
				Validators.compose([
					Validators.required,
				]),
			],
			driverId: [
				this.getDriver() || null
			]
		})
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

	getDateTimeFormat(date) {
		if(!date)
		   return '----';

		// var d = new Date(date),
		// 	hours = '' + (d.getHours()),
		// 	minutes = '' + (d.getTime())
	
		// return [ hours, minutes,].join(':');
		return new Date(date).toLocaleTimeString();
	}

	generatePDF() {

		let data = document.getElementById('contentToConvert');  
		let height = (data as HTMLElement).offsetHeight - 100;
		html2canvas(data).then(canvas => {
		  const contentDataURL = canvas.toDataURL('image/png')
		  let pdf = new jsPDF('portrait', 'px', 'a4');
		  pdf.addImage(contentDataURL, 'PNG', 10, 10, 400, height);  
		  pdf.save(`order-${this.orderDetails?.orderNumber}.pdf`);   
		}); 
	}

	replaceAll(string, search, replace) {
		return string.split(search).join(replace);
	}

	print(): void {
		let printContents, popupWin;
		let logo = (document.getElementById('company_logo') as HTMLElement).innerHTML;
		logo = '<div class="logo-container">'+logo+'</div>'
		let rtl = '';
		if(document.getElementById('rtl-file')) {
			rtl = 'body {direction: rtl;}.logo-container h6 {text-align: left;} .text-left{text-align: right;}.text-right{text-align: left;}';
		}
		else {
			rtl = '.logo-container h6 {text-align: right;} .text-left{text-align: left;}.text-right{text-align: right;}';
		}
		printContents = document.getElementById('contentToConvert').innerHTML;
		popupWin = window.open('', '_blank', 'top=0,left=0,height=900px,width=900px');
		popupWin.document.open();
		popupWin.document.write(`
		  <html>
			<head>
			  <title></title>
			  <style>
			  /*** print **/
				@media print {
					${rtl}
					table.print-friendly tr td, table.print-friendly tr th, table.print-friendly tr, table.print-friendly {
						page-break-inside: avoid;
					}
					.row {
						display: flex;
						flex-wrap: wrap;
					}
					.col-md-6 {
						flex: 0 0 50%;
						padding: 0 10px;
						margin-bottom: 1px;
						box-sizing: border-box;
					}
					.col-md-3 {
						flex: 0 0 25%;
						padding: 0 10px;
						margin-bottom: 3px;
						box-sizing: border-box;
					}
					.col-md-11 {
						flex: 0 0 100%;
						padding: 0 10px;
						margin-bottom: 3px;
						box-sizing: border-box;
					}
					.col-md-6 p, .col-12 p, .col-md-3 p, .col-md-11 p {
						margin-bottom: 0px;
					}
					.col-12 {
						flex: 0 0 100%;
						margin-bottom: 0px;
					}
					.font-weight-boldest {
						font-weight: 700;
					}
					.company-logo {
						height: 60px;
						display: block;
						margin-bottom: 5px;
					}
					.logo-container {
						display: flex;
						align-items: center;
					}
					.logo-container h6 {
						font-size: 25px;
						font-weight: 700;
						margin: 0 10px;
						flex: 1 1 auto !important;
					}
					.table {
						width: 100%;
						margin-bottom: 1rem;
						color: #3F4254;
						background-color: transparent;
					}
					th, td, tr {
						border: 1px solid #444;
						padding: 3px;
						text-align: center;
					}
					.d-none {
						display: none;
					}
					.no-border {
						border: 0;
					}
				}
				/*** end print **/
			  </style>
			</head>
			<body onload="window.print();window.close()">
			<h5 style="margin-bottom:0!important; text-align:center; line-height: 5px;">${this.translate.instant('INPUT.ORDER_NUMBER')} ${this.orderDetails?.orderNumber}<h5>
			${logo}${printContents}
			</body>
		  </html>`
		);
		popupWin.document.close();
	}

	getBranchId() {
		return this.gridData.find(item => item.id === this.orderId).branchId;
	}

	getEstimatedDeliveryDate() {
		return this.gridData.find(item => item.id === this.orderId).expectedDeliveryDate;
	}

	getDriver() {
		return this.gridData.find(item => item.id === this.orderId).driverId;
	}

	getTotalQuantity(items) {
		return items?.map((item) => {
			return item.quantity
		}).reduce((a, b) => a + b, 0);
	}

	actionsEvent(event) {
		this.orderId = event.rowId;
		this.eventStatus = event?.type.toUpperCase();
		if(event.type === 'Accept' || event.type === 'Reject' || event.type === 'Send' || event.type === 'Delivered' || event.type === 'Reset') {
			this.getOrder();
			this.initAcceptOrderForm();
			this.initRejectOrderForm();
			this.initSentOrderForm();
			this.openCentred(this.changeStatusModal);
		}
		if(event.type === 'View' || event.type === 'Edit') {
      		this.getOrder();
			this.openCentred(this.orderDetailsModal);
		}
	}

	openCentred(content) {
		this.modalService.open(content, { centered: true, size: 'xl'} );
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
			driverId: this.acceptOrderForm.controls.driverId.value,
			expectedDeliveryDate:  new Date(this.acceptOrderForm.controls.expectedDeliveryDate.value).toLocaleString('en')
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

	deliverOrder() {
		this.loderService.setIsLoading = true;
		this.OrdersService.updateOrder({
			statusId: '0d014e78-7887-4f53-ab63-94f9fad40193',
			id: this.orderId,
			deliveryDate: this.sentOrderForm.controls.deliveryDate.value,
			driverId: this.sentOrderForm.controls.driverId.value,
		}).subscribe((data) => {
			this.toaster.success(data.result);
			this.loderService.setIsLoading = false;
			this.getOrders();
			this.modalService.dismissAll();
		}, (error) => {
			this.loderService.setIsLoading = false;
		});
	}

	resetOrder() {
		this.loderService.setIsLoading = true;
		let prevStatus = ''
		if(this.statusId === 'c91d4598-1bfd-42bb-abaf-c161151cb127' || this.statusId === 'f18a701e-55a7-476a-bcaa-c7c894041a29') {
			prevStatus = 'bd0a4950-4559-40ce-a6fe-4d081aa7a880';
		}
		else if(this.statusId === '8ce0ae9c-511b-4992-84a0-b05fa61d1e78'){
			prevStatus = 'c91d4598-1bfd-42bb-abaf-c161151cb127';
		}
		else if(this.statusId === '0d014e78-7887-4f53-ab63-94f9fad40193'){
			prevStatus = '8ce0ae9c-511b-4992-84a0-b05fa61d1e78';
		}
		this.OrdersService.updateOrder({
			statusId: prevStatus,
			id: this.orderId,
			notes: '',
			deliveryDate: null,
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
		this.loderService.setIsLoading = true;
		this.OrdersService.getOrder(this.orderId).subscribe((data) => {
			this.orderDetails = data.result.orderItemForEdit;
			this.originalOrderDetailsItems = data.result.orderItemForEdit.orderDetailItems.map(item => item.preTaxPrice);
			this.loderService.setIsLoading = false;
		}, (error) => {
			this.loderService.setIsLoading = false;
		});
	}

	checkPermissions() {
   		if(this.permissions.includes('Orders.GetOrder') && this.statusId !== 'bd0a4950-4559-40ce-a6fe-4d081aa7a880') {
		  	this.customActions.push({name: 'View', icon:'flaticon-eye text-warning'})
		}
		if((this.permissions.includes('Orders.UpdateOrder')) && this.statusId === 'bd0a4950-4559-40ce-a6fe-4d081aa7a880') {
			this.customActions.push({name: 'Edit', icon:'flaticon-edit text-warning'});
			this.customActions.push({name: 'Accept', icon:'flaticon2-check-mark text-success'});
			this.customActions.push({name: 'Reject', icon:'flaticon2-cancel-music text-danger'});
		}
		if((this.permissions.includes('Orders.UpdateOrder')) && this.statusId === 'c91d4598-1bfd-42bb-abaf-c161151cb127') {
			this.customActions.push({name: 'Send', icon:'flaticon2-delivery-truck text-success'});
			this.customActions.push({name: 'Reset', icon:'flaticon2-circular-arrow text-success'});
		}
		if((this.permissions.includes('Orders.UpdateOrder')) && this.statusId === '8ce0ae9c-511b-4992-84a0-b05fa61d1e78') {
			this.customActions.push({name: 'Delivered', icon:'flaticon2-box text-success'});
			this.customActions.push({name: 'Reset', icon:'flaticon2-circular-arrow text-success'});
		}
		if((this.permissions.includes('Orders.UpdateOrder')) && (this.statusId === '0d014e78-7887-4f53-ab63-94f9fad40193' || this.statusId === 'f18a701e-55a7-476a-bcaa-c7c894041a29' )) {
			// this.customActions.push({name: 'Reset', icon:'flaticon2-circular-arrow text-success'});
		}
		if(this.customActions.length > 0) {
		  	this.displayedColumns.push('actions');
		}
	}

	getOrders() {
		this.loderService.setIsLoading = true;
		this.OrdersService.getOrders({
			dateFrom: new Date(Number(this.dateFrom?.split('/')[2]),Number(this.dateFrom?.split('/')[1]) -1,Number(this.dateFrom?.split('/')[0]) + 1),
			dateTo: new Date(Number(this.dateTo?.split('/')[2]),Number(this.dateTo?.split('/')[1]) -1,Number(this.dateTo?.split('/')[0]) + 1),
			durationType: this.durationType,
			branchId: this.branchId,
			customerId: this.customerId,
			statusId: this.statusId,
			rowsPerPage: 5000000,}).subscribe((data) => {
			data.result.orderItems.items.map((item) => {
				item['createdTime'] = new Date(item.createdOn).toLocaleTimeString();
				item.orderNumber = item.orderNumber.toString();
				item.totalDueAmount = item.totalDueAmount.toFixed(2).toString();
				item.createdOn = this.getDateFormat(item.createdOn);
			})
			this.gridData = data.result.orderItems.items;
			this.loderService.setIsLoading = false;
		}, (error) => {
			this.loderService.setIsLoading = false;
		});
	}

	getCreatedOn() {
		if(this.orderId) {
			let createdDate = this.gridData?.find(item => item.id === this.orderId)?.createdOn;
			if(!createdDate) {
				return;
			}
			return new Date(Number(createdDate?.split('/')[2]),Number(createdDate?.split('/')[1]) -1,Number(createdDate?.split('/')[0]))
		}
	}

	ngOnInit() {
		this.checkPermissions();
		this.getCompanyDrivers();
	}

	getTax() {
		return this.orderDetails?.orderDetailItems.map((item) => {
			return ((item?.preTaxPrice * (item?.tax/100)) * item.quantity)?.toFixed(2);
		}).reduce((a, b) => Number(a) + Number(b), 0)?.toFixed(2);
	}

	changeQuantity(e,productId) {
		if(Number(e.target.value) < 0) {
			e.target.value = 0;
		}
		let index = this.orderDetails?.orderDetailItems.indexOf(this.orderDetails?.orderDetailItems.find(item => item.productId === productId));
		this.orderDetails.orderDetailItems[index].quantity = Number(e.target.value);
		this.orderDetails.orderDetailItems[index].postTaxLineTotal = ((this.orderDetails.orderDetailItems[index].preTaxPrice + (this.orderDetails.orderDetailItems[index].preTaxPrice * (this.orderDetails.orderDetailItems[index].tax / 100))) * Number(this.orderDetails.orderDetailItems[index].quantity)).toFixed(2);
		this.setTotalDueAmount();
	}

	changeUnitPrice(e,productId) {
		if(Number(e.target.value) < 0) {
			e.target.value = 0;
		}
		let index = this.orderDetails?.orderDetailItems.indexOf(this.orderDetails?.orderDetailItems.find(item => item.productId === productId));
		if(Number(e.target.value) > this.originalOrderDetailsItems[index]) {
			e.target.value = this.originalOrderDetailsItems[index];
		}
		this.orderDetails.orderDetailItems[index].unitPriceDiscount = Number(e.target.value);
		this.orderDetails.orderDetailItems[index].preTaxPrice = this.originalOrderDetailsItems[index] - Number(e.target.value);
		this.orderDetails.orderDetailItems[index].postTaxLineTotal = ((this.orderDetails.orderDetailItems[index].preTaxPrice + (this.orderDetails.orderDetailItems[index].preTaxPrice * (this.orderDetails.orderDetailItems[index].tax / 100))) * Number(this.orderDetails.orderDetailItems[index].quantity)).toFixed(2);
		this.setTotalDueAmount();
	}

	setTotalDueAmount() {
		this.orderDetails.totalDueAmount = this.orderDetails?.orderDetailItems.map((item) => {
			return item.postTaxLineTotal;
		}).reduce((a, b) => Number(a) + Number(b), 0);
	}

	updateOrderItems() {
		this.loderService.setIsLoading = true;
		let orderLines = this.orderDetails?.orderDetailItems?.map(item => {
			return {productId: item.productId, quantity: item.quantity, discount: item.unitPriceDiscount}
		});

		let data = {
			id: this.orderDetails?.id,
			orderLines: orderLines
		}
		this.OrdersService.updateOrder(data).subscribe((data) => {
			this.getOrders();
			this.modalService.dismissAll();
		}, (error) => {
			this.loderService.setIsLoading = false;
		});
	}
}
