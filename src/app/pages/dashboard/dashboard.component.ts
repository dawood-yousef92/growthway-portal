import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/_metronic/core';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  colorsGrayGray100: string;
  colorsGrayGray700: string;
  colorsThemeBaseSuccess: string;
  colorsThemeLightSuccess: string;
  fontFamily: string;
  chartOptions: any = {};
  filter:any = [
    {id: 1, name:'LAST_HOUR'},
    {id: 2, name:'TODAY'},
    {id: 3, name:'LAST_WEEK'},
    {id: 4, name:'LAST_MONTH'},
    {id: 5, name:'LAST_YEAR'}
  ]
  months:any = [
    {id:1, name:'January'},
    {id:2, name:'February'},
    {id:3, name:'March'},
    {id:4, name:'April'},
    {id:5, name:'May'},
    {id:6, name:'June'},
    {id:7, name:'July'},
    {id:8, name:'August'},
    {id:9, name:'September'},
    {id:10, name:'October'},
    {id:11, name:'November'},
    {id:12, name:'December'},
  ]
	displayedColumns: string[] = ['orderNumber', 'createdOn', 'customerName', 'customerPhoneNumber', 'expectedDeliveryDate', 'statusName', 'totalDueAmount'];
  customActions:any = [];
  gridData:any = [];
  newOrders:any = [0];
  acceptedOrders:any = [0];
  rejectedOrders:any = [0];
  sentOrders:any = [0];
  deliveredOrders:any = [0];
  totalOrders:any;
  totalCustomers:any;
  topItems:any = [];
  topCustomers:any = [];
  expectedDeliveredOrders:any = [];
  targetTopItemsMonth:number = null;
  targetTopCustomersMonth:number = null;
  durationType:number = null;
  dateFrom:string = null;
  dateTo:string = null;


  constructor(private layout: LayoutService,private loderService: LoaderService,private dashboardService:DashboardService) {
    this.colorsGrayGray100 = this.layout.getProp('js.colors.gray.gray100');
    this.colorsGrayGray700 = this.layout.getProp('js.colors.gray.gray700');
    this.colorsThemeBaseSuccess = this.layout.getProp(
      'js.colors.theme.base.success'
    );
    this.colorsThemeLightSuccess = this.layout.getProp(
      'js.colors.theme.light.success'
    );
    this.fontFamily = this.layout.getProp('js.fontFamily');
  }

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions(70);
    this.getTotalOrdersGroupedByStatus({});
    this.getTopItems();
    this.getTopCustomers();
    this.getExpectedDeliveryOrders();
  }

  changeFilterType(e) {
    let durationType = {};
    if(e.value) {
      this.dateFrom = null;
      this.dateTo = null;
      this.durationType = e.value;
      durationType = {'durationType': e.value};
    }
    this.getTotalOrdersGroupedByStatus(durationType);
  }

  changeDate(start,end) {
    if(end) {
      this.durationType = null;
      this.dateFrom = start;
      this.dateTo = end;
      this.getTotalOrdersGroupedByStatus(
        {
          dateFrom: new Date(Number(start?.split('/')[2]),Number(start?.split('/')[1]) -1,Number(start?.split('/')[0]) + 1),
          dateTo: new Date(Number(end?.split('/')[2]),Number(end?.split('/')[1]) -1,Number(end?.split('/')[0]) + 1),
        }
      );
    }
  }

  getTotalOrdersGroupedByStatus(filterData) {
    this.loderService.setIsLoading = true;
    this.dashboardService.getTotalOrdersGroupedByStatus(filterData).subscribe((data) => {
      let total = data.result.statusGroups.Pending+
                  data.result.statusGroups.Accepted+
                  data.result.statusGroups.Sent+
                  data.result.statusGroups.Rejected+
                  data.result.statusGroups.Delivered;
      this.newOrders = [this.getPercentage(data.result.statusGroups.Pending, total)];
      this.acceptedOrders = [this.getPercentage(data.result.statusGroups.Accepted, total)];
      this.rejectedOrders = [this.getPercentage(data.result.statusGroups.Rejected, total)];
      this.sentOrders = [this.getPercentage(data.result.statusGroups.Sent, total)];
      this.deliveredOrders = [this.getPercentage(data.result.statusGroups.Delivered, total)];
      this.totalOrders = [data.result.totalOrders];
      this.totalCustomers = [data.result.totalCustomers];
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getPercentage(num, total) {
    let per = ((num / total) * 100).toFixed(0);
    if(!Number(per)) {
      return 0;
    }
    return per;
  }

  actionsEvent(e) { }

  getChartOptions(num) {
    const strokeColor = '#D13647';
    return {
      series: [num],
      chart: {
        type: 'radialBar',
        height: 200,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '75%',
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false,
              fontWeight: '700',
            },
            value: {
              color: this.colorsGrayGray700,
              fontSize: '30px',
              fontWeight: '700',
              offsetY: 12,
              show: true,
            },
          },
          track: {
            background: '#D0D1CC',
            strokeWidth: '100%',
          },
        },
      },
      stroke: {
        lineCap: 'round',
      },
    };
  }

  changeMonthItems(e) {
    this.targetTopItemsMonth = e.value;
    this.getTopItems();
  }

  changeMonthCustomers(e) {
    this.targetTopCustomersMonth = e.value;
    this.getTopCustomers();
  }

  getTopItems() {
    this.loderService.setIsLoading = true;
    this.dashboardService.getTopItems({"targetMonth": this.targetTopItemsMonth,}).subscribe((data) => {
      this.topItems = data.result.items;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getTopCustomers() {
    this.loderService.setIsLoading = true;
    this.dashboardService.getTopCustomers({"targetMonth": this.targetTopCustomersMonth,}).subscribe((data) => {
      this.topCustomers = data.result.items;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  getExpectedDeliveryOrders() {
    this.loderService.setIsLoading = true;
    this.dashboardService.getExpectedDeliveryOrders().subscribe((data) => {
      data.result.item.items.map((item) => {
				item.orderNumber = item.orderNumber.toString();
				item.totalDueAmount = item.totalDueAmount.toFixed(2).toString();
				item.createdOn = this.getDateTimeFormat(item.createdOn);
        item.expectedDeliveryDate = this.getDateFormat(item.expectedDeliveryDate);
			})
      this.expectedDeliveredOrders = data.result.item.items;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
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
		return new Date(date).toLocaleString();
	}

  getFilterHeader() {
    if(this.durationType) {
      return this.durationType;
    }
    else if(this.dateFrom && this.dateTo){
      return new Date(this.dateFrom) + '|' + new Date(this.dateTo);
    }
    return '-'
  }
}
