import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    localStorage.removeItem('groupBy');
    localStorage.removeItem('gridFilter');
    localStorage.removeItem('pageSize');
    localStorage.removeItem('pageIndex');
    localStorage.removeItem('sort');
  }
}
