import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService, ConfirmPasswordValidator } from 'src/app/modules/auth';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { SubheaderService } from 'src/app/_metronic/partials/layout';
import { ManageAccountServise } from '../../account-management.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePassword: FormGroup;

  constructor( 
    private subheader: SubheaderService,
    private fb: FormBuilder, 
    private manageAccountServise:ManageAccountServise,
    private loderService: LoaderService,
    private toaster: ToastrService) { }

  initForm() {
    this.changePassword = this.fb.group(
    {
      oldPassword: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
        ]),
      ],
      cPassword: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
    },
    {
      validator: ConfirmPasswordValidator.MatchPassword,
    });
  }

  ngOnInit(): void {
    this.initForm();
    setTimeout(() => {
      this.subheader.setTitle('Manage Your Account');
      this.subheader.setBreadcrumbs([{
        title: 'Manage Your Account',
        linkText: 'change password',
        linkPath: '/account-management/change-password'
      }]);
    }, 1);
  }

  submit() {
    this.loderService.setIsLoading = true;
    this.manageAccountServise.changePassword({
      oldPassword:this.changePassword.controls.oldPassword.value,
      newPassword:this.changePassword.controls.password.value,
      confirmPassword:this.changePassword.controls.cPassword.value,
    }).subscribe((data) => {
      this.loderService.setIsLoading = false;
      this.toaster.success(data.result.successMessage);
    },(error) => {
      this.loderService.setIsLoading = false;
    });
  }
}
