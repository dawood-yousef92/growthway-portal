import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { first } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPasswordValidator } from '../registration/confirm-password.validator';
import { ActivatedRoute, Router } from '@angular/router';
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
  userId:string;
  successMessage:string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private loderService: LoaderService
  ) {
    if (ls.getValue("token")) {
      this.router.navigate(['/']);
    }

    this.route.queryParams.subscribe((data) => {
      if(data.code && data.userId) {
        this.initResetForm();
        this.resetCode = data.code;
        this.userId = data.userId;
        this.step = 2;
      }
    });
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
        this.successMessage = data.result.successMessage;
        this.step = 3;
      },
      (error) => {
        this.loderService.setIsLoading = false;
        console.log(error);
      });
  }

  reset() {
    this.loderService.setIsLoading = true;
    let data = {
      "userId": this.userId,
      "password": this.r.password.value,
      "confirmPassword": this.r.cPassword.value,
      "code": this.resetCode
    }
    const resetPasswordSubscr = this.authService
    .resetPassword(data)
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
