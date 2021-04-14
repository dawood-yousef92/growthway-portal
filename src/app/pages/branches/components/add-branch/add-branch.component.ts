import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from 'src/app/pages/general.service';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { BranchesService } from '../../branches.service';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.scss']
})
export class AddBranchComponent implements OnInit {
  branchForm: FormGroup;
  branchtId = null;
  countriesFilter:string = '';
  countries:any[] = [];
  cities:any[] = [];
  branch:any;

  constructor(
    private generalService:GeneralService,
    private branchesService:BranchesService,
    private route: ActivatedRoute,
    private fb: FormBuilder,private toaster: ToastrService,
    private router: Router,
    private loderService: LoaderService,
    private modalService: NgbModal) { }

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
      isActive: [
        this.getStatus(this.branch?.isActive),
      ],
    });
  }

  getStatus(status) {
    if(status === false) {
      return false;
    }
    else {
      return true;
    }
  }

  getCountries() {
    this.generalService.getCountries().subscribe((data) => {
      this.countries = data.result.countries;
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
  }

  getBranch() {
    this.loderService.setIsLoading = true;
    this.branchesService.getBranch(this.branchtId).subscribe((data) => {
      this.branch = data.result.brancheForEdit;
      this.getCities({value:this.branch?.countryId});
      this.initForm();
      this.loderService.setIsLoading = false;
    }, (error) => {
      this.loderService.setIsLoading = false;
    })
  }

  submit() {
    this.loderService.setIsLoading = true;
    var formData: FormData = new FormData();
    formData.append('code',this.branchForm.controls.code.value);
    formData.append('nameEn',this.branchForm.controls.nameEn.value);
    formData.append('nameAr',this.branchForm.controls.nameAr.value);
    formData.append('addressEn',this.branchForm.controls.addressEn.value);
    formData.append('addressAr',this.branchForm.controls.addressAr.value);
    formData.append('countryId',this.branchForm.controls.countryId.value);
    formData.append('cityId',this.branchForm.controls.cityId.value);
    if(!this.branchtId) {
      this.branchesService.createBranch(formData).subscribe((data) => {
        this.toaster.success(data.result.successMessage);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/branches']);
      }, (error) => {
        this.loderService.setIsLoading = false;
      });
    }
    else {
      formData.append('id',this.branchtId);
      this.branchesService.updateBranch(formData).subscribe((data) => {
        this.toaster.success(data.result);
        this.loderService.setIsLoading = false;
        this.router.navigate(['/branches']);
      }, (error) => {
        this.loderService.setIsLoading = false;
      });
    }
  }

  ngOnInit(): void {
    this.getCountries();
    this.initForm();
    this.route.params.subscribe((data) => {
      this.branchtId = data.id;
      if(this.branchtId) {
        this.getBranch();
      }
    });
  }

}
