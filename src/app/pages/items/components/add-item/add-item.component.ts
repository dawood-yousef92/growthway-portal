import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/pages/general.service';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemsService } from '../../items.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent implements OnInit {
  @ViewChild("catModal") catModal: TemplateRef<any>;
  @ViewChild('cropModal', { static: false }) cropModal: ElementRef;
  countries:any = [];
  countriesFilter:string = '';
  categoriesFilter:string = '';
  imageChangedEvent: any = '';
  croppedImage: any = '';
  itemImages:any = [];
  errorImg:boolean = false;
  tags:any[] = [];
  unitOfMeasurements:any[];
  packagingTypes:any[];
  shelfLifeTypes:any[];
  productId:string;
  product:any;
  allCats:any;
  documents:File[] = [];

  categories:any = [];
  selectedCatName:string;
  closeResult = '';

  itemForm: FormGroup;
  constructor(private generalService:GeneralService,
              private itemsService:ItemsService,
              private route: ActivatedRoute,
              private fb: FormBuilder,private toaster: ToastrService,
              private router: Router,
              private loderService: LoaderService,
              private modalService: NgbModal) { }

  initForm() {
    this.itemForm = this.fb.group(
    {
      code: [
        this.product?.code || ''
      ],
      minimumOrderQuantity: [
        this.product?.minimumOrderQuantity || 1
      ],
      nameEn: [
        this.product?.nameEn || '',
        Validators.compose([
          Validators.required,
          Validators.pattern("[a-zA-Z0-9-_& ]+"),
        ]),
      ],
      nameAr: [
        this.product?.nameAr || '',
        Validators.compose([
          Validators.required,
          Validators.pattern("[a-zA-Zأ-ي0-9-_ ]+"),
        ]),
      ],
      descriptionEn: [
        this.product?.descriptionEn || ''
      ],
      descriptionAr: [
        this.product?.descriptionAr || ''
      ],
      unitPrice: [
        this.product?.unitPrice || null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      offerPrice: [
        this.product?.offerPrice || null
      ],
      originCountryId: [
        this.product?.originCountryId || null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      defaultImageIndex: [
        this.product?.defaultImageIndex || 0
      ],
      shelfLifeDuration: [
        this.product?.shelfLifeDuration || null
      ],
      shelfLifeType: [
        this.product?.shelfLifeType || ''
      ],
      unitOfMeasurementId: [
        this.product?.unitOfMeasurementId || ''
      ],
      packagingTypeId: [
        this.product?.packagingTypeId || ''
      ],
      categoryId: [
        this.product?.categoryId || ''
      ],
      isActive: [
        this.getStatus(this.product?.isActive),
      ],
    });
  }

  selectFiles(e) {
    this.documents = e.documents;
  }

  getFileIcon(index) {
    if(this.product?.documents[index]?.documentName.includes('pdf'))
    {
      return 'pdf.png';
    }
    else if(this.product?.documents[index]?.documentName.includes('text')) {
      return 'txt.png';
    }
    else if(this.product?.documents[index]?.documentName.includes('doc') || this.product?.documents[index]?.documentName.includes('docs') || this.product?.documents[index]?.documentName.includes('docsx')) {
      return 'doc.png';
    }
    else {
      return 'default.png';
    }
  }

  deleteFile(index) {
    this.product?.documents?.splice(index, 1);
  }

  getStatus(status) {
    if(status === false) {
      return false;
    }
    else {
      return true;
    }
  }
  
  checkPrice() {
    if(Number(this.itemForm && this.itemForm?.get('unitPrice').value) < Number(this.itemForm?.get('offerPrice').value)) {
      return true;
    }
    else {
      return false;
    }
  }

  getCountries() {
    this.generalService.getCountries().subscribe((data) => {
      this.countries = data.result.countries;
    });
  }

  search(e,type) {
    if(type === 'countries') {
      this.countriesFilter = e;
    }
    else if(type === 'categories') {
      this.categoriesFilter = e;
    }
  }

  ngOnInit(): void {
    // this.getCategoriesByBusinessType();
    this.getCountries();
    this.initForm();
    this.getCompanyCategories();
    this.getUnitOfMeasurements();
    this.getShelfLifeTypes();
    this.getPackagingTypes();
    this.route.params.subscribe((data) => {
      this.productId = data.id;
      if(this.productId) {
        this.getProduct();
      }
    });
  }

  getProduct() {
    this.loderService.setIsLoading = true;
    this.itemsService.getProduct(this.productId).subscribe((data) => {
      this.product = data.result.productForEdit;
      if(this.product.tags) {
        this.tags = this.product.tags?.split(',');
      }
      this.product?.images?.map((item) => {
        this.itemImages.push({base64:item, file:null});
        if(item.isDefault) {
          this.product.defaultImageIndex = this.product.images.indexOf(item);
        }
      })
      this.findNested(this.categories, this.product?.categoryId)
      this.initForm();
      this.loderService.setIsLoading = false;
    })
  }

  selectFile() {
    let inputFile = document.getElementById('select-file');
    inputFile.click();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.modalService.open(this.cropModal, { centered: true } );
  }

  deleteImg(img) {
    this.itemForm.get('defaultImageIndex').setValue(0);
    this.itemImages.splice(this.itemImages.indexOf(img),1);
  }

  imageCropped(event: ImageCroppedEvent) {
    let inputFile = document.getElementById('select-file');
    this.croppedImage = {base64: event?.base64 , file: this.dataURLtoFile(event.base64, (inputFile as HTMLInputElement)?.files[0]?.name)};
  }

  imageLoaded(image: HTMLImageElement) {
      // show cropper
  }

  cropperReady() {
      // cropper ready
  }

  loadImageFailed() {
      // show message
  }

  addCroppedImage(img) {
    if(img.file.size > 2097152) {
      this.errorImg = true;
    }
    else {
      this.errorImg = false;
      this.itemImages.push(img);
      this.modalService.dismissAll();
    }
  }

  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  openModal(content) {
    this.modalService.open(content, { centered: true } ).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  addTag() {
    let tagInput = (document.getElementById('tagInput') as HTMLInputElement);
    if(tagInput.value) {
      this.tags.push(tagInput.value);
    }
    tagInput.value = null;
  }

  removeTag(tag) {
    this.tags.splice(this.tags.indexOf(tag),1);
  }

  getUnitOfMeasurements() {
    this.generalService.getUnitOfMeasurements().subscribe((data) => {
      this.unitOfMeasurements = data.result.unitOfMeasurements;
    });
  }

  getPackagingTypes() {
    this.generalService.getPackagingTypes().subscribe((data) => {
      this.packagingTypes = data.result.packagingTypeItems;
    });
  }

  getShelfLifeTypes() {
    this.generalService.getShelfLifeTypes().subscribe((data) => {
      this.shelfLifeTypes = data.result.shelfLifeTypeItem;
    });
  }

  getCompanyCategories() {
    this.selectedCatName = '';
    // if(!this.allCats){
    //   setTimeout(() => {
    //     this.getCompanyCategories();
    //   },500);
    // }
    // else {
      this.loderService.setIsLoading = true;
      this.itemsService.getCompanyCategories().subscribe((data) => {
        this.categories = data.result.categoryItem;
        // let companyCats = data.result.categoryItem;
        // for(let i = 0; i < this.allCats.length; i++) {
        //   for(let ii = 0; ii < companyCats.length; ii++) {
        //     if(this.allCats[i].id === companyCats[ii].id) {
        //       this.categories.push(this.allCats[i]);
        //     }
        //   }
        // }
        if(this.categories.length > 0 && this.itemForm.controls.categoryId.value) {
          this.findNested(this.categories, this.itemForm.controls.categoryId.value);
        }
        this.loderService.setIsLoading = false;
      },(error) => {
        this.loderService.setIsLoading = false;
      });
    // }
  }

  selectCat(e) {
    this.itemForm.get('categoryId').setValue(e.value);
    this.findNested(this.categories, this.itemForm.controls.categoryId.value) 
  }

  findNested(obj, value) {
    obj?.map((item) => {
      if(item.id === value) {
        console.log(item.name);
        this.selectedCatName = item.name;
        return item.name;
      }
      if(item.categories.length > 0) {
        this.findNested(item.categories, value);
      }
    })
  }

  getCategoriesByBusinessType() {
    this.itemsService.getCategoriesByBusinessType(3,null).subscribe((data) => {
      this.allCats = data.result.productsCategoryItem.concat(data.result.servicesCategoryItem);
      this.getCompanyCategories();
    })
  }

  submit() {
    // this.loderService.setIsLoading = true;
    var formData: FormData = new FormData();
    formData.append('code',this.itemForm.controls.code.value);
    formData.append('nameEn',this.itemForm.controls.nameEn.value);
    formData.append('nameAr',this.itemForm.controls.nameAr.value);
    formData.append('descriptionEn',this.itemForm.controls.descriptionEn.value);
    formData.append('descriptionAr',this.itemForm.controls.descriptionAr.value);
    formData.append('unitPrice',this.itemForm.controls.unitPrice.value);
    formData.append('offerPrice',this.itemForm.controls.offerPrice.value);
    formData.append('originCountryId',this.itemForm.controls.originCountryId.value);
    formData.append('shelfLifeDuration',this.itemForm.controls.shelfLifeDuration.value);
    formData.append('shelfLifeType',this.itemForm.controls.shelfLifeType.value);
    formData.append('unitOfMeasurementId',this.itemForm.controls.unitOfMeasurementId.value);
    formData.append('packagingTypeId',this.itemForm.controls.packagingTypeId.value);
    formData.append('isActive',this.itemForm.controls.isActive.value);
    formData.append('categoryId',this.itemForm.controls.categoryId.value);
    formData.append('minimumOrderQuantity',this.itemForm.controls.minimumOrderQuantity.value);
    formData.append('tags',this.tags?.join(','));
    for(let i =0; i < this.documents.length; i++){
      formData.append("productDocuments", this.documents[i] as File, this.documents[i]['name']);
    }
    if(!this.productId) {
      formData.append('defaultImageIndex',this.itemForm.controls.defaultImageIndex.value);
      for(let i = 0; i < this.itemImages.length; i++) {
        formData.append("productImages", this.itemImages[i].file as File, this.itemImages[i].file['name']);
      }
      this.itemsService.createProduct(formData).subscribe((data) => {
        this.toaster.success(data.result.successMessage);
        this.loderService.setIsLoading = false;
        // this.router.navigate(['/items']);
        location.reload();
      }, (error) => {
        this.loderService.setIsLoading = false;
      });
    }
    else {
      let zeft:any = [];
      zeft = zeft.concat(this.itemImages);
      let a = zeft[this.itemForm.controls.defaultImageIndex.value];
      if(a?.base64?.imagePath) {
        for(let i = 0; i < zeft.length; i++) {
          if(!zeft[i]?.base64?.imagePath) {
            zeft.splice(zeft.indexOf(zeft[i]),1);
            i--;
          }
        }
        formData.append('defaultImageIdIndex',zeft.indexOf(a));
      }
      else {
        for(let i = 0; i < zeft.length; i++) {
          if(zeft[i]?.base64?.imagePath) {
            zeft.splice(zeft.indexOf(zeft[i]),1);
            i--;
          }
        }
        formData.append('defaultImageIndex',zeft.indexOf(a));
      }
      formData.append('id',this.productId);
      for(let i = 0; i < this.itemImages.length; i++) {
        if(this.itemImages[i].file) {
          formData.append("productImages", this.itemImages[i].file as File, this.itemImages[i].file['name']);
        }
        else {
          formData.append("productImagesIds", this.itemImages[i].base64.id);
        }
      }
      for(let i = 0; i < this.product.documents.length; i++) {
        formData.append("productDecumentsIds", this.product.documents[i].id);
      }
      this.itemsService.updateProduct(formData).subscribe((data) => {
        this.toaster.success(data.result);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/items']);
      }, (error) => {
        this.loderService.setIsLoading = false;
      });
    }
  }

}
