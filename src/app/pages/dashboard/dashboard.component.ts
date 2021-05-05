import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/_metronic/core';

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
    {id: 1, name:'today'},
    {id: 2, name:'last week'},
    {id: 3, name:'last month'},
    {id: 4, name:'last year'}
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

  constructor(private layout: LayoutService) {
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
    this.chartOptions = this.getChartOptions();
    this.gridData = [
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
      {orderNumber:'342355', createdOn:'10/10/2020', customerName:'David', customerPhone:'797164481', status:'Sent', totalDueAmount:'299'},
    ]
  }

  actionsEvent(e) { }

  getChartOptions() {
    const strokeColor = '#D13647';
    return {
      series: [50],
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
            background: this.colorsThemeLightSuccess,
            strokeWidth: '100%',
          },
        },
      },
      colors: [this.colorsThemeBaseSuccess],
      stroke: {
        lineCap: 'round',
      },
      labels: ['Progress'],
      legend: {},
      dataLabels: {},
      fill: {},
      xaxis: {},
      yaxis: {},
      states: {},
      tooltip: {},
      markers: {},
    };
  }
}
