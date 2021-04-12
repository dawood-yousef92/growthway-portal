import { Component, Input, OnInit, Output, SimpleChanges, ViewChild, EventEmitter } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss']
})
export class DynamicTableComponent implements OnInit {
  @Input() displayedColumns: string[];
  @Input() customActions:any[];
  @Input() pagingData:any;
  @Input() gridData:any[];

  @Output() actionsEvent: EventEmitter<any> = new EventEmitter();
  @Output() filterEvent: EventEmitter<any> = new EventEmitter();
  @Output() changePagingEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortEvent: EventEmitter<any> = new EventEmitter();

  dataSource: MatTableDataSource<any>;

  @ViewChild('matPaginator7', { static: true }) paginator7: MatPaginator;
  @ViewChild('sort7', { static: true }) sort7: MatSort;

  constructor() {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator7;
    this.dataSource.sort = this.sort7;
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.gridData);
  }

  applyFilter7(filterValue: string) {
    this.filterEvent.emit({filter:filterValue});
  }

  changePagination(event) {
    this.changePagingEvent.emit(event);
  }

  action(type, id) {
    this.actionsEvent.emit({type:type, rowId:id});
  }

  isDisabledSort(col) {
    if(col === 'createdOn') {
      return true;
    }
    else {
      return false;
    }
  }

  sort(event) {
    this.sortEvent.emit(event);
  }
}
