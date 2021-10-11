import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { ItemsService } from '../../items.service';

@Component({
  selector: 'app-items-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss']
})
export class ItemsListComponent implements OnInit {
  permissions = localStorage.getItem('permissions');
  customActions:any[] = [];
  selectedProductId:string;
  dataSettings:any = {
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: 20,
    selectedPageSize: 0,
    type: 1
  }

  pagingData:any = {length: 100, pageSize: 20, pageIndex: 1};

  displayedColumns: string[] = ['imagePath', 'name', 'category', 'postTaxUnitPrice', 'postTaxOfferPrice', 'originCountry',];
  actions:any = [];
  gridData:any[] = [];
  @ViewChild('deleteModal', { static: false }) deleteModal: ElementRef;
  
  constructor(private itemsService:ItemsService, private toaster: ToastrService, private router: Router,
    private loderService: LoaderService, private modalService: NgbModal) { }

  changePagingEvent(event) {
    this.dataSettings.pageNumber = event.pageIndex + 1;
    this.dataSettings.rowsPerPage = event.pageSize;
    this.getProducts();
  }
  
  filterEvent(event) {
    this.dataSettings.pageNumber = 0;
    this.dataSettings.sortBy = "";
    this.dataSettings.searchText = event.filter;
    this.getProducts();
  }
  
  sortEvent(event) {
    this.dataSettings.sortBy = event.active + ' ' + event.direction;
    this.getProducts();
  }

  checkPermissions() {
    if(this.permissions.includes('Products.UpdateProduct')) {
      this.customActions.push({name: 'edit', icon:'flaticon2-edit text-warning'})
    }
    if(this.permissions.includes('Products.DeleteProduct')) {
      this.customActions.push({name: 'delete', icon:'flaticon2-trash text-danger'})
    }
    if(this.customActions.length > 0) {
      this.displayedColumns.push('actions');
    }
  }

  actionsEvent(event) {
    this.selectedProductId = event.rowId;
    if(event.type === 'edit') {
      this.router.navigate([`/items/edit-item/${this.selectedProductId}`]);
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
    this.itemsService.deleteProduct(this.selectedProductId).subscribe((data) => {
      this.toaster.success(data.result);
      this.getProducts();
      this.modalService.dismissAll();
    });
  }

  getProducts() {
    this.loderService.setIsLoading = true;
    this.itemsService.getProducts(this.dataSettings).subscribe((data) => {
      this.gridData = data.result.products.items.map((item) => {
        item.imagePath = `<img src="${item.imagePath || './assets/images/default-img.png'}" class="img-table-col"/>`;
        item.postTaxUnitPrice = item.postTaxUnitPrice?.toFixed(2);
        if(item.postTaxOfferPrice) {
          item.postTaxOfferPrice =  item.postTaxOfferPrice?.toFixed(2);
        }
        else {
          item.postTaxOfferPrice = '----';
        }
        return item;
      })
      this.gridData = data.result.products.items;
      this.pagingData.length = data.result.products.totalRows;
      this.pagingData.pageSize = data.result.products.totalRowsPerPage;
      this.pagingData.pageIndex = data.result.products.currentPage - 1;
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  changeGroupEvent(e) {
    if(e) {
      this.dataSettings.rowsPerPage = -1;
      this.getProducts();
    }
  }

  ngOnInit(): void {
    localStorage.removeItem('groupBy');
    localStorage.removeItem('gridFilter');
    localStorage.removeItem('pageSize');
    localStorage.removeItem('pageIndex');
    localStorage.removeItem('sort');
    this.checkPermissions();
    this.getProducts();
  }

}
