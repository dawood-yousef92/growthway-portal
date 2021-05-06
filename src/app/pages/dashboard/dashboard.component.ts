import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/_metronic/core';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';

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
    {id: 1, name:'TODAY'},
    {id: 2, name:'LAST_WEEK'},
    {id: 3, name:'LAST_MONTH'},
    {id: 4, name:'LAST_YEAR'}
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
  newOrders = [22];
  acceptedOrders = [34];
  rejectedOrders = [99];
  sentOrders = [78];
  deliveredOrders = [66];

  constructor(private layout: LayoutService,private loderService: LoaderService) {
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
    // setTimeout(() => {
    //   this.loderService.setIsLoading = true;
    //   this.newOrders = [55];
    //   this.acceptedOrders = [35];
    //   this.rejectedOrders = [33];
    //   this.sentOrders = [78];
    //   this.deliveredOrders = [54];
    //   this.loderService.setIsLoading = false;
    // },2500);
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

  getPercentage(num) {
    return num;
  }
}
