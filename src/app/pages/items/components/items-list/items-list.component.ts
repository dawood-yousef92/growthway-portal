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
    selectedRolesIds: [],
    searchText: "",
    sortBy: "",
    pageNumber: 0,
    rowsPerPage: 5000000,
    selectedPageSize: 0
  }

  displayedColumns: string[] = ['imagePath', 'name', 'category', 'unitPrice', 'offerPrice', 'originCountry',];
  actions:any = [];
  gridData:any[] = [];
  @ViewChild('deleteModal', { static: false }) deleteModal: ElementRef;
  
  constructor(private itemsService:ItemsService, private toaster: ToastrService, private router: Router,
    private loderService: LoaderService, private modalService: NgbModal) { }

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
      console.log(data);
      this.gridData = data.result.products.items.map((item) => {
        item.imagePath = `<img src="${item.imagePath || './assets/images/default-img.png'}" class="img-table-col"/>`;
        item.unitPrice = item.unitPrice +'  '+item.currency;
        if(item.offerPrice) {
          item.offerPrice =  item.offerPrice+'  '+item.currency;
        }
        else {
          item.offerPrice = '----';
        }
        return item;
      })
      this.gridData = data.result.products.items;
      this.loderService.setIsLoading = false;
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

  ngOnInit(): void {
    this.checkPermissions();
    this.getProducts();
  }

}
