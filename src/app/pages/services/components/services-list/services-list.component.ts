import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { ServicesService } from '../../services.service';

@Component({
  selector: 'app-services-list',
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
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

  displayedColumns: string[] = ['imagePath', 'name', 'category', 'postTaxUnitPrice', 'postTaxOfferPrice', 'originCountry',];
  actions:any = [];
  gridData:any[] = [];
  @ViewChild('deleteModal', { static: false }) deleteModal: ElementRef;
  
  constructor(private servicesService:ServicesService, private toaster: ToastrService, private router: Router,
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
    this.servicesService.deleteProduct(this.selectedProductId).subscribe((data) => {
      this.toaster.success(data.result);
      this.getProducts();
      this.modalService.dismissAll();
    });
  }

  getProducts() {
    this.loderService.setIsLoading = true;
    this.servicesService.getProducts(this.dataSettings).subscribe((data) => {
      this.gridData = data.result.products.items.map((item) => {
        item.imagePath = `<img src="${item.imagePath || './assets/images/default-img.png'}" class="img-table-col"/>`;
        item.postTaxUnitPrice = item.postTaxUnitPrice?.toFixed(2)+'  '+item.currency;
        if(item.postTaxOfferPrice) {
          item.postTaxOfferPrice =  item.postTaxOfferPrice?.toFixed(2)+'  '+item.currency;
        }
        else {
          item.postTaxOfferPrice = '----';
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
