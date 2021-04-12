import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from '../registration/confirm-password.validator';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { LocalStorage as ls } from "src/app/utils/localstorage";

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  resetForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  step:Number = 1;
  resetCode:string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    private router: Router,
    private loderService: LoaderService
  ) {
    // this.isLoading$ = this.authService.isLoading$;
    if (ls.getValue("token")) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }
  get r() {
    return this.resetForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
    });
  }

  initResetForm() {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(100),
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );
  }

  submit() {
    this.loderService.setIsLoading = true;
    this.authService.forgetPassword(this.f.email.value).subscribe((data) => {
        this.loderService.setIsLoading = false;
        if(data.result.code) {
          this.initResetForm();
          this.step = 2;
          this.resetCode = data.result.code;
        }
        else {
          this.toaster.error('Invalid Email');
        }
      },
      (error) => {
        this.loderService.setIsLoading = false;
        console.log(error);
      });
  }

  reset() {
    this.loderService.setIsLoading = true;
    const resetPasswordSubscr = this.authService
    .resetPassword(this.f.email.value,this.r.password.value,this.r.cPassword.value,this.resetCode)
    .pipe(first())
    .subscribe((data) => {
      this.loderService.setIsLoading = false;
      this.toaster.success(data.result);
      this.router.navigate(['auth/login']);
    },
    (error) => {
      this.loderService.setIsLoading = false;
      console.log(error);
    });
  this.unsubscribe.push(resetPasswordSubscr);
  }
}
