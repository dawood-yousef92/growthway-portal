import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { BranchesService } from '../../branches.service';

@Component({
  selector: 'app-branches-list',
  templateUrl: './branches-list.component.html',
  styleUrls: ['./branches-list.component.scss']
})
export class BranchesListComponent implements OnInit {
  permissions = localStorage.getItem('permissions');
  customActions:any[] = [];
  selectedBranchId:string;
  dataSettings:any = {
    selectedRolesIds: [],
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: 5000000,
    selectedPageSize: 0
  }

  displayedColumns: string[] = ['name', 'address', 'isActive',];
  actions:any = [];
  gridData:any[] = [];
  @ViewChild('deleteModal', { static: false }) deleteModal: ElementRef;

  constructor(private translate: TranslateService, private branchesService:BranchesService, private toaster: ToastrService, private router: Router,
    private loderService: LoaderService, private modalService: NgbModal) { }

  getBranches() {
    this.loderService.setIsLoading = true;
    this.branchesService.getBranches(this.dataSettings).subscribe((data) => {
      if(data.result.branches.items) {
        data.result.branches.items.map((item) => {
          if(item.isActive) {
            item.isActive = '<span class="label label-lg label-light-success label-inline">' + this.translate.instant('TABLE.ACTIVE') + '</span>';
          }
          else {
            item.isActive = '<span class="label label-lg label-light-danger label-inline">' + this.translate.instant('TABLE.NOT_ACTIVE') + '</span>';
          }
          return item;
        })
        this.gridData = data.result.branches.items;
      }
      else {
        this.gridData = [];
      }

      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  checkPermissions() {
    if(this.permissions.includes('Branches.UpdateBranch')) {
      this.customActions.push({name: 'edit', icon:'flaticon2-edit text-warning'})
    }
    if(this.permissions.includes('Branches.DeleteBranch')) {
      this.customActions.push({name: 'delete', icon:'flaticon2-trash text-danger'})
    }
    if(this.customActions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  actionsEvent(event) {
    this.selectedBranchId = event.rowId;
    if(event.type === 'edit') {
      this.router.navigate([`/branches/edit-branch/${this.selectedBranchId}`]);
    }
    else if(event.type === 'delete') {
      this.openCentred(this.deleteModal);
    }
  }

  openCentred(content) {
    this.modalService.open(content, { centered: true } );
  }

  confirmDelete() {
    this.modalService.dismissAll();
    this.branchesService.deleteBranch(this.selectedBranchId).subscribe((data) => {
      this.toaster.success(data.result);
      this.getBranches();
      this.modalService.dismissAll();
    });
  }

  ngOnInit(): void {
    this.getBranches();
    this.checkPermissions();
  }

}
