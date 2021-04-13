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
        '',
      ],
      nameEn: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      nameAr: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      countryId: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      cityId: [
        null,
        Validators.compose([
          Validators.required,
        ]),
      ],
      addressEn: [
        ''
      ],
      addressAr: [
        ''
      ],
      isActive: [
        false
      ],
    });
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

  submit() {
    alert('submit');
  }

  ngOnInit(): void {
    this.getCountries();
    this.initForm();
  }

}
