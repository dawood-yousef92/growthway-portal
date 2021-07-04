import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { MatPaginator } from '@angular/material/paginator';

export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: 'app-offline-table',
  templateUrl: './offline-table.component.html',
  styleUrls: ['./offline-table.component.scss']
})
export class OfflineTableComponent implements OnInit {
  title = 'Grid Grouping';
  gridFilter:string = '';
  @Input() displayedColumns: string[];
  @Input() customActions:any[];
  @Input() gridData:any[];
  
  @Output() actionsEvent: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort7: MatSort;

  pagingData:any = {
    pageSize:20,
    pageIndex:0
  }

  public dataSource = new MatTableDataSource<any | Group>([]);

  _alldata: any[];
  columns: any[];
  displayedColumns2: string[];
  groupByColumns: string[] = [];

  constructor(private loderService: LoaderService) {
    this.columns = [];
    this.groupByColumns = [];
  }

  ngOnInit() {
    this.displayedColumns.map((item) => {
      this.columns.push({field: item});
    })
    this.displayedColumns2 = this.columns.map(column => column.field);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(localStorage.getItem('pageSize')) {
      this.pagingData.pageSize = localStorage.getItem('pageSize');
      this.pagingData.pageIndex = localStorage.getItem('pageIndex');
    }
    this._alldata = this.gridData;
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.gridFilter = localStorage.getItem('gridFilter');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort7;
    if(this.gridFilter &&  this.dataSource) {
      this.applyFilter(this.gridFilter);
    }
  }

  groupBy(event, column) {
    // event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field, add ) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if ( add ) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event, column) {
    // event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return (data instanceof Group) ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    const groupRows = this.dataSource.data.filter(
      row => {
        if (!(row instanceof Group)) {
          return false;
        }
        let match = true;
        this.groupByColumns.forEach(column => {
          if (!row[column] || !data[column] || row[column] !== data[column]) {
            match = false;
          }
        });
        return match;
      }
    );

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString();
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(data: any[], level: number, groupByColumns: string[], parent: Group): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map(
        row => {
          const result = new Group();
          result.level = level + 1;
          result.parent = parent;
          for (let i = 0; i <= level; i++) {
            result[groupByColumns[i]] = row[groupByColumns[i]];
          }
          return result;
        }
      ),
      JSON.stringify);

    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach(group => {
      const rowsInGroup = data.filter(row => group[currentColumn] === row[currentColumn]);
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(rowsInGroup, level + 1, groupByColumns, group);
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort7;
    this._alldata = a;
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  isDisabledSort(col) {
    if(col === 'createdOn' || col === 'imagePath' || col === 'actions' ) {
      return true;
    }
    else {
      return false;
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

  stop(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  changePagination(e) {
    localStorage.setItem('pageSize',e.pageSize)
    localStorage.setItem('pageIndex',e.pageIndex)
  }

  sort(e) {
    let sort = e.active +'|'+e.direction;
    localStorage.setItem('sort', sort)
  }
}