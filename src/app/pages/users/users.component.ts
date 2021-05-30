import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
})
export class UsersComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    localStorage.removeItem('gridFilter');
    localStorage.removeItem('pageSize');
    localStorage.removeItem('pageIndex');
  }
}
