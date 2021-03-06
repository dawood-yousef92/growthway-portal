import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/pages/general.service';
import { UsersService } from 'src/app/pages/users/users.service';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { BranchesService } from '../../branches.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {
  branchForm: FormGroup;
  branchId = null;
  countriesFilter:string = '';
  usersFilter:string = '';
  countries:any[] = [];
  cities:any[] = [];
  branch:any;
  pastLocation:any;
  fullAddressText:string;
  users:any[];
  oldDefault:boolean;

  constructor(
    private generalService:GeneralService,
    private branchesService:BranchesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,private toaster: ToastrService,
    private router: Router,
    private loderService: LoaderService,
    private modalService: NgbModal,
    private usersService:UsersService) { }

  initForm() {
    this.branchForm = this.fb.group(
    {
      code: [
        this.branch?.code || '',
      ],
      nameEn: [
        this.branch?.nameEn || '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      nameAr: [
        this.branch?.nameAr || '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      assignedUsers: [
        this.branch?.assignedUsers || null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      countryId: [
        this.branch?.countryId || null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      cityId: [
        this.branch?.cityId || null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      addressEn: [
        this.branch?.addressEn || '',
      ],
      addressAr: [
        this.branch?.addressAr || '',
      ],
      phone: [
        this.branch?.phone || '',
      ],
      mobile: [
        this.branch?.mobile || '',
      ],
      isActive: [
        this.branch?.isActive || true,
      ],
      isDefault: [
        this.branch?.isDefault || false,
      ],
    });
  }

  getUsers() {
    this.usersService.getUsers({}).subscribe((data) => {
      this.users = data.result.users.items;
    });
  }

  getCountries() {
    this.generalService.getCountries().subscribe((data) => {
      // this.countries = data.result.countries;
      this.countries.push(data.result.countries.find(item => item.id === '7f4c2c35-feb9-4f6c-9159-9d9280bd047c'));
    });
  }

  getCities(e) {
    this.loderService.setIsLoading = true;
    this.branchForm.get('cityId').setValue('');
    this.generalService.getCitiesByCountryId(e.value).subscribe((data) => {
      this.cities = data.result.cities;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }

  search(e,type) {
    if(type === 'countries') {
      this.countriesFilter = e;
    }
    else if(type === 'users') {
      this.usersFilter = e;
    }
  }

  getBranch() {
    this.loderService.setIsLoading = true;
    this.branchesService.getBranch(this.branchId).subscribe((data) => {
      this.branch = data.result.branchForEdit;
      this.getCities({value:this.branch?.countryId});
      this.initForm();
      this.pastLocation = {lat: this.branch?.latitude, lng: this.branch?.longitude};
      this.oldDefault = data.result.branchForEdit.isDefault;
      setTimeout(() => {
        this.getFullAddressName();
      },500);
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    })
  }

  getLatLng(e) {
    if(e.lat){
      this.pastLocation = {lat: e.lat, lng: e.lng};
      this.modalService.dismissAll();
      this.getFullAddressName()
    }
  }

  getFullAddressName() {
    this.loderService.setIsLoading = true;
    this.branchesService.getFullAddressName(this.pastLocation.lat,this.pastLocation.lng).subscribe((data) => {
      this.fullAddressText = data?.results[0]?.formatted_address;
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    });
  }
  
  submit() {
    this.loderService.setIsLoading = true;
    var formData: FormData = new FormData();
    formData.append('code',this.branchForm.controls.code.value);
    formData.append('nameEn',this.branchForm.controls.nameEn.value);
    formData.append('nameAr',this.branchForm.controls.nameAr.value);
    formData.append('addressEn',this.branchForm.controls.addressEn.value);
    formData.append('addressAr',this.branchForm.controls.addressAr.value);
    formData.append('phone',this.branchForm.controls.phone.value);
    formData.append('mobile',this.branchForm.controls.mobile.value);
    if(this.branchForm.controls.assignedUsers.value) {
      for (var i = 0; i < this.branchForm.controls.assignedUsers.value.length; i++) {
        formData.append('assignedUsers[]', this.branchForm.controls.assignedUsers.value[i]);
      }
    }
    formData.append('countryId',this.branchForm.controls.countryId.value);
    formData.append('cityId',this.branchForm.controls.cityId.value);
    if(this.pastLocation?.lat && this.pastLocation?.lng) {
      formData.append('latitude',this.pastLocation.lat);
      formData.append('longitude',this.pastLocation.lng);
    }
    formData.append('isActive',this.branchForm.controls.isActive.value);
    formData.append('isDefault',this.branchForm.controls.isDefault.value);
    if(!this.branchId) {
      this.branchesService.createBranch(formData).subscribe((data) => {
        this.toaster.success(data.result.successMessage);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/branches']);
      }, (error) => {
        this.loderService.setIsLoading = false;
      });
    }
    else {
      formData.append('id',this.branchId);
      this.branchesService.updateBranch(formData).subscribe((data) => {
        this.toaster.success(data.result);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/branches']);
      }, (error) => {
        this.loderService.setIsLoading = false;
      });
    }
  }

  openCentred(content) {
    this.modalService.open(content, { centered: true } );
  }

  ngOnInit(): void {
    this.getUsers();
    this.getCountries();
    this.initForm();
    this.route.params.subscribe((data) => {
      this.branchId = data.id;
      if(this.branchId) {
        this.getBranch();
      }
    });
  }

}
