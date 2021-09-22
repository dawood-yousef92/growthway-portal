import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { RfqService } from '../../rfq.service';

@Component({
  selector: 'app-rfq-from-customers',
  templateUrl: './rfq-from-customers.component.html',
  styleUrls: ['./rfq-from-customers.component.scss']
})
export class RfqFromCustomersComponent implements OnInit {
  @ViewChild('deleteModal', { static: false }) deleteModal: ElementRef;
  @ViewChild('acceptModal', { static: false }) acceptModal: ElementRef;
  minDate:Date = new Date();
  @Input() statusId:string;
	// @Input() branchId:any;
	@Input() customerId:any;
	@Input() durationType:any;
	@Input() dateFrom:string;
	@Input() dateTo:string;
	// @Input() branches:any[];
  rfqItems:any = [];
  remainingText:string;
  dayText:string;
  hourText:string;
  menutesText:string;
  andText:string;
  selectedItem: string;
  selectedIndex: number;
  selectedLine: any;
  endReq:boolean = false;
  orderDetails:any = null;

  constructor(private loaderService: LoaderService,
		private modalService: NgbModal,
		private toaster: ToastrService,
    private rfqService:RfqService,
    private translateService: TranslateService) { }

  ngOnInit(): void {
    this.remainingText = this.translateService.instant('INPUT.REMAINING');
    this.dayText = this.translateService.instant('LOOKUPS.DAY');
    this.hourText = this.translateService.instant('LOOKUPS.HOUR');
    this.menutesText = this.translateService.instant('LOOKUPS.MINUTES');
    this.andText = this.translateService.instant('LOOKUPS.AND');
    if(this.statusId === '57CD94B0-BD05-4A99-82E3-BCCA10E1D638') {
      // setInterval(() => {this.timeDifference()}, 60000);
    }
  }

  getRfqs() {
    let data = {
			dateFrom: new Date(Number(this.dateFrom?.split('/')[2]),Number(this.dateFrom?.split('/')[1]) -1,Number(this.dateFrom?.split('/')[0]) + 1),
			dateTo: new Date(Number(this.dateTo?.split('/')[2]),Number(this.dateTo?.split('/')[1]) -1,Number(this.dateTo?.split('/')[0]) + 1),
			durationType: this.durationType,
			// branchId: this.branchId,
			customerId: this.customerId,
			statusId: this.statusId,
			rowsPerPage: -1,
    }
    this.rfqService.getRfqs(data).subscribe((data) => {
      this.rfqItems = data.result.rfqItems.items;
      // setTimeout(() => {this.timeDifference();}, 1000);
      this.loaderService.setIsLoading = false;
      this.endReq = true;
    }, () => {
      this.loaderService.setIsLoading = false;
      this.endReq = true;
    });
  }

  getPriceAfterTax(item) {
    return (Number(item.preTaxPrice) + Number(item.preTaxPrice * (item.tax / 100))).toFixed(2);
  }

  getLinetotal(item) {
    return ((Number(item.preTaxPrice) + Number((item.preTaxPrice * (item.tax / 100)))) * Number(item.quantity)).toFixed(2);
  }

  changeUnitPrice(e,product,line) {
		if(Number(e.target.value) < 0) {
			e.target.value = 0;
		}
    this.rfqItems.find(item => item.id === line.id).rfqDetailsItems.find(item2 => item2.id === product.id).preTaxPrice = Number(e.target.value);
	}

  getTotalDueAmmount(line) {
    let sum = 0;
    line.rfqDetailsItems.map(item => {
      sum += Number(this.getLinetotal(item));
    })
    return sum.toFixed(2);
  }

  toTimestamp(strDate){
    var parts = strDate.split("/");
    let a = parseInt(parts[1]) + '/' + parseInt(parts[0]) + '/' + parts[2].replace(',','')
    var datum = Date.parse(a);
    return datum/1000;
  }

  checkDisabled(index) {
    let elem = (document.getElementById(`expiry${index}`) as HTMLInputElement)
    if(elem && elem.value) {
      return false;
    }
    else {
      return true;
    }
  }

  timeDifference(rfqExpiryDate) {
      let currentTime = new Date();
      var difference = (rfqExpiryDate * 1000) - currentTime.getTime();
      var daysDifference = Math.floor(difference/1000/60/60/24);
      difference -= daysDifference*1000*60*60*24
  
      var hoursDifference = Math.floor(difference/1000/60/60);
      difference -= hoursDifference*1000*60*60
  
      var minutesDifference = Math.floor(difference/1000/60);
      difference -= minutesDifference*1000*60
  
      let xxx = (this.remainingText + ' ' +
        daysDifference + ' ' + this.dayText + ' ' + this.andText + ' ' +
        hoursDifference + ' ' + this.hourText  + ' ' + this.andText + ' ' +
        minutesDifference + ' ' + this.menutesText);
        return xxx;
  }

  acceptRequest() {
    let noteToBuyer = (document.getElementById(`note-to-buyer${this.selectedIndex}`) as HTMLInputElement).value;
    let expiry = (document.getElementById(`expiry${this.selectedIndex}`) as HTMLInputElement).value;
    let expiryDateTume = this.toTimestamp(expiry);
    let items = this.selectedLine.rfqDetailsItems.map((elem) => {
      return {id: elem.id, productId:elem.productId, preTaxPrice:elem.preTaxPrice, quantity:elem.quantity}
    })

    let data = {
      id: this.selectedLine.id,
      rfqExpiryDate: expiryDateTume,
      rfqLines: items,
      noteToBuyer: noteToBuyer
    }

    this.loaderService.setIsLoading = true;
    this.rfqService.updateRfqOrder(data).subscribe((data) => {
      this.loaderService.setIsLoading = false;
      this.toaster.success(data.result);
      this.getRfqs();
      this.modalService.dismissAll();
    }, (error) => {
      this.loaderService.setIsLoading = false;
      this.modalService.dismissAll();
    });
  }

  rejectRequest() {
    this.loaderService.setIsLoading = true;
    let data = {
      id: this.selectedItem,
      statusId: '180924D3-9F8C-4AE3-8DF7-1F7A9FDBA070'
    }
    this.rfqService.updateRfq(data).subscribe((data) => {
      this.loaderService.setIsLoading = false;
      this.toaster.success(data.result);
      this.getRfqs();
      this.modalService.dismissAll();
    }, (error) => {
      this.loaderService.setIsLoading = false;
      this.modalService.dismissAll();
    });
  }

  openCentred(content) {
    this.modalService.open(content, { centered: true } );
  }

  deleteRfq(id) {
    this.selectedItem = id;
    this.openCentred(this.deleteModal);
  }

  acceptRfq(line, index) {
    this.selectedLine = line;
    this.selectedIndex = index;
    this.openCentred(this.acceptModal);
  }

  ngOnChanges(changes: SimpleChanges) {
		this.getRfqs();
	}

  getDataToPrint(e, id) {
    e.stopPropagation();
    this.loaderService.setIsLoading = true;
    this.orderDetails = null;
    this.rfqService.getRfq({id:id}).subscribe((data) => {
      this.orderDetails = data.result.orderItemForEdit;
      this.loaderService.setIsLoading = false;
      setTimeout(() => {
        this.print();
      }, 500);
    }, (error) => {
      this.loaderService.setIsLoading = false;
    });
  }

  print(): void {
    if(!this.orderDetails) {
      return;
    }
		let printContents, popupWin;
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
					.logo-container p {
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
					input.w-70px {
						display: none;
					}
					input.w-70px + span.d-none {
						display: block;
					}
					.buyer-logo {
						height: 35px;
						margin: 0 10px;
						vertical-align: middle;
					}
					.border {
						border: 1px solid #444;
					}
          .company_logo {
            display: flex;
            align-items: center;
          }
				}
        .phone-number {
          direction: ltr;
          display: inline-block;
        }
				/*** end print **/
			  </style>
			</head>
			<body onload="window.print();window.close()">
			<h5 style="margin-bottom:0!important; text-align:center; line-height: 5px;">${this.translateService.instant('TITLE.RFQ_NUMBER')} ${this.orderDetails?.orderNumber}<h5>
			${printContents}
			</body>
		  </html>`
		);
		popupWin.document.close();
	}

  getTax() {
		return this.orderDetails?.orderDetailItems.map((item) => {
			return (((item?.preTaxPrice - item?.unitPriceDiscount) * (item?.tax/100)) * item.quantity)?.toFixed(2);
		}).reduce((a, b) => Number(a) + Number(b), 0)?.toFixed(2);
	}

  getTotalQuantity(items) {
		return items?.map((item) => {
			return item.quantity
		}).reduce((a, b) => a + b, 0);
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
		return new Date(date).toLocaleTimeString();
	}

  seen(item) {
    if(item.seen) {
      return;
    }
    item.seen = true;
    this.rfqService.seen({id:item.id}).subscribe((data) => {});
  }
}
