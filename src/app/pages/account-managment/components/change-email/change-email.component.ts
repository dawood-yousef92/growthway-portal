import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/auth';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { ManageAccountServise } from '../../account-management.service';
import { LocalStorage as ls } from "src/app/utils/localstorage";

@Component({
  selector: 'app-change-email',
  templateUrl: './change-email.component.html',
  styleUrls: ['./change-email.component.scss']
})
export class ChangeEmailComponent implements OnInit {

  userData: any = {
    email: ''
  };
  updateEmail: FormGroup;

  constructor( 
    private subheader: SubheaderService,
    private auth: AuthService,
    private fb: FormBuilder, 
    private manageAccountServise:ManageAccountServise,
    private loderService: LoaderService,
    private toaster: ToastrService,) { }

  initForm() {
    this.updateEmail = this.fb.group({
      newEmail: [
        '',
        Validators.compose([
          Validators.email,
          Validators.required,
        ]),
      ],
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.auth.getUserByToken().subscribe((data) => {
      this.userData = data.result;
      this.initForm();
    });
    setTimeout(() => {
      this.subheader.setTitle('Manage Your Account');
      this.subheader.setBreadcrumbs([{
        title: 'Manage Your Account',
        linkText: 'change your email',
        linkPath: '/account-management/change-email'
      }]);
    }, 1);
  }

  submit() {
    this.loderService.setIsLoading = true;
    this.manageAccountServise.changeEmail({newEmail:this.updateEmail.controls.newEmail.value}).subscribe((data) => {
      ls.setValue('token',data.result.authResponse.accessToken);
      this.auth.getUserByToken().subscribe(data => {
        this.userData = data.result;
        this.auth.currentUserDetails =  data.result;
      });
      this.loderService.setIsLoading = false;
      this.toaster.success(data.result.successMessage);
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }

}
