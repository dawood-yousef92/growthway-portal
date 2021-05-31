import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    localStorage.removeItem('gridFilter');
    localStorage.removeItem('pageSize');
    localStorage.removeItem('pageIndex');
  }
}
