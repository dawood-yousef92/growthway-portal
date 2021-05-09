import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
})
export class BranchesComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    localStorage.removeItem('gridFilter');
  }
}
