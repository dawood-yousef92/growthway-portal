import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    localStorage.removeItem('gridFilter');
  }
}
