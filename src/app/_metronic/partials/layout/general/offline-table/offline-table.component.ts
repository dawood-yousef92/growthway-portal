import {AfterViewInit, Component, Input, Output, SimpleChanges, ViewChild, EventEmitter, OnInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';

@Component({
  selector: 'app-offline-table',
  templateUrl: './offline-table.component.html',
  styleUrls: ['./offline-table.component.scss']
})
export class OfflineTableComponent implements OnInit {
  @Input() displayedColumns: string[];
  @Input() customActions:any[];
  @Input() gridData:any[];

  @Output() actionsEvent: EventEmitter<any> = new EventEmitter();
  dataSource:MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  gridFilter:string = '';

  constructor(private loderService: LoaderService){}

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new MatTableDataSource(this.gridData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.gridFilter = localStorage.getItem('gridFilter');
    if(this.gridFilter &&  this.dataSource) {
      this.applyFilter(this.gridFilter);
    }
  }

  action(type, id) {
    if(type === 'edit') {
      this.actionsEvent.emit({type:'edit', rowId:id});
    }
    else if (type === 'view') {
      this.actionsEvent.emit({type:'view', rowId:id});
    }
    else if (type === 'delete') {
      this.actionsEvent.emit({type:'delete', rowId:id});
    }
    else {
      this.actionsEvent.emit({type:type, rowId:id});
    }
  }

  isDisabledSort(col) {
    if(col === 'createdOn') {
      return true;
    }
    else {
      return false;
    }
  }

  applyFilter(filterValue: string) {
    localStorage.setItem('gridFilter', filterValue);
    this.loderService.setIsLoading = true;
    let a = [];
    this.gridData.map((item) => {
      Object.keys(item).map((val) => {
        if(typeof item[val] === "string" && String(item[val].toLowerCase()).includes(filterValue.toLowerCase()) && val !== 'id' && !a.includes(item)) {
          a.push(item);
        }
      })
    })
    this.dataSource = new MatTableDataSource(a);
    this.loderService.setIsLoading = false;
  }
}
