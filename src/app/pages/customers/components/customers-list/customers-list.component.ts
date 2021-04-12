import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  permissions = localStorage.getItem('permissions');
  customActions:any[] = [];
  selectedUserId:string;
  dataSettings:any = {
    selectedRolesIds: [],
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: 10,
    selectedPageSize: 0
  }

  displayedColumns: string[] = ['name', 'phone', 'email', 'country', 'city', 'classifications', 'status',];
  actions:any = [];
  pagingData:any = {length: 100, pageSize: 10, pageIndex: 1};
  gridData:any[] = [
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-success label-inline">Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-success label-inline">Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-danger label-inline">Not Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-danger label-inline">Not Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-success label-inline">Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-danger label-inline">Not Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-success label-inline">Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-success label-inline">Certified</span>',
    },
    {
      name:'AAAA',
      phone:'07976363636',
      email:'aaaa@aaaa.com',
      country:'Jordan',
      city:'Amman',
      classifications:'VIP',
      status:'<span class="label label-lg label-light-success label-inline">Certified</span>',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
