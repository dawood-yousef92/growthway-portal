import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { OrdersService } from '../../orders.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
	minDate:Date = new Date();

	acceptOrderForm: FormGroup;
	rejectOrderForm: FormGroup;
	sentOrderForm: FormGroup;
testImage:any;

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
		var data = (document.getElementById('contentToConvert').innerHTML as string);

		const doc = new jsPDF('portrait', 'px', 'a4');
		data = this.replaceAll(data, "<p", "<p style='width:700px; font-size:8px;line-height:5px;margin:0px;'");
		data = this.replaceAll(data, "<span", "<span style='font-size:8px;line-height:5px;margin:0px;'");
		data = this.replaceAll(data, "<div", "<div style='font-size:8px;line-height:5px;margin:0px;'");
		data = this.replaceAll(data, '<hr ', "<p style='color:#aaa;width:700px; font-size:8px;line-height:8px;margin-top:8px;margin-bottom:0px;'>-----------------------------------------------------------</p><hr ");
		doc.html(data, {x:10,y:10});
		setTimeout(() => {
			doc.save('Order.pdf');
		}, 2000);

		// html2canvas(data).then(canvas => {
		// 	console.log(canvas);
		//   var imgWidth = 100;
		//   var imgHeight = canvas.height * imgWidth / canvas.width;
		//   const contentDataURL = canvas.toDataURL('image/png')
		//   console.log(contentDataURL);
		//   this.testImage = contentDataURL;
		//   let pdf = new jspdf.jsPDF('p', 'mm', 'a4');
		//   var position = 0;
		//   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
		//   setTimeout(() => {
		// 	  pdf.save('Order.pdf');
		//   }, 1000);
		// });
	}

	replaceAll(string, search, replace) {
		return string.split(search).join(replace);
	}

	print(): void {
		let printContents, popupWin;
		printContents = document.getElementById('contentToConvert').innerHTML;
		popupWin = window.open('', '_blank', 'top=0,left=0,height=1000px,width=1000px');
		popupWin.document.open();
		popupWin.document.write(`
		  <html>
			<head>
			  <title>Order Details</title>
			  <style>
			  //........Customized style.......
			  </style>
			</head>
			<body onload="window.print();window.close()">${printContents}</body>
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

	actionsEvent(event) {
		this.orderId = event.rowId;
		this.eventStatus = event?.type.toUpperCase();
		if(event.type === 'Accept' || event.type === 'Reject' || event.type === 'Send' || event.type === 'Delivered') {
			this.initAcceptOrderForm();
			this.initRejectOrderForm();
			this.initSentOrderForm();
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
			expectedDeliveryDate: new Date(this.acceptOrderForm.controls.expectedDeliveryDate.value).toLocaleString()
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
		if((this.permissions.includes('Orders.UpdateOrder') || true) && this.statusId === '8ce0ae9c-511b-4992-84a0-b05fa61d1e78') {
			this.customActions.push({name: 'Delivered', icon:'flaticon2-box text-success'});
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
			return new Date(this.gridData?.find(item => item.id === this.orderId).createdOn);
		}
	}

	ngOnInit() {
		this.checkPermissions();
	}


}
