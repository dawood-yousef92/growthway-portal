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
    {id: 'today', name:'TODAY'},
    {id: 'lastWeek', name:'LAST_WEEK'},
    {id: 'lastMonth', name:'LAST_MONTH'},
    {id: 'lastYear', name:'LAST_YEAR'}
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
	displayedColumns: string[] = ['orderNumber', 'createdOn', 'customerName', 'customerPhone', 'status', 'totalDueAmount'];
  customActions:any = [];
  gridData:any = [];
  newOrders:any = [0];
  acceptedOrders:any = [0];
  rejectedOrders:any = [0];
  sentOrders:any = [0];
  deliveredOrders:any = [0];
  totalOrders:any;
  totalCustomers:any;

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
    this.gridData = [
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
    ]

    this.getTotalOrdersGroupedByStatus({});
  }

  changeFilterType(e) {
    let type;
    if(e.value) {
      let selectedKey = e.value;
      if(selectedKey === 'today') {
        type = {
          "today": true
        };
      }
      else if(selectedKey === 'lastWeek') {
        type = {
          "lastWeek": true,
        }
      }
      else if(selectedKey === 'lastMonth') {
        type = {
          "lastMonth": true
        };
      }
      else if(selectedKey === 'lastYear') {
        type = {
          "lastYear": true
        };
      }
      this.getTotalOrdersGroupedByStatus(type);
    }
  }

  changeDate(start,end) {
    if(end) {
      this.getTotalOrdersGroupedByStatus(
        {
          "dateFrom": new Date(start),
          "dateTo": new Date(end),
        }
      );
    }
  }

  getTotalOrdersGroupedByStatus(filterData) {
    this.loderService.setIsLoading = true;
    this.dashboardService.getTotalOrdersGroupedByStatus(filterData).subscribe((data) => {
      console.log(data);
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
    return ((num / total) * 100).toFixed(0);
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

}
