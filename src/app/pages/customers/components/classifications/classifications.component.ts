import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-classifications',
  templateUrl: './classifications.component.html',
  styleUrls: ['./classifications.component.scss']
})
export class ClassificationsComponent implements OnInit {
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

  displayedColumns: string[] = ['name', 'description',];
  actions:any = ['create'];
  pagingData:any = {length: 100, pageSize: 10, pageIndex: 1};
  gridData:any[] = [
    {
      name:'VIP',
      description:'07976363636',
    },
    {
      name:'Normal',
      description:'07976363636',
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }


}
