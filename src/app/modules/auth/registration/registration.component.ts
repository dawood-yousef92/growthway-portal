import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { UserModel } from '../_models/user.model';
import { first } from 'rxjs/operators';
import { LoaderService } from 'src/app/_metronic/core/services/loader.service';
import { LocalStorage as ls } from "src/app/utils/localstorage";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  successMessage:string;
  activationLink:string;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loderService: LoaderService
  ) {
    // redirect to home if already logged in
    if (ls.getValue("token")) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.registrationForm = this.fb.group(
      {
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.minLength(6),
            Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
          ]),
        ],
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
    this.authService.register(this.f.email.value, this.f.password.value, this.f.cPassword.value)
      .pipe(first())
      .subscribe((data: any) => {
        this.loderService.setIsLoading = false;
        this.successMessage = data.result.successMessage;
        this.activationLink = decodeURIComponent(data.result.emailConfirmationUrl);
      },
      (error) => {
        this.loderService.setIsLoading = false;
        console.log(error);
      });
  }

  // confirmEmail() {
  //   this.authService.confirmEmail(this.userId,this.code).subscribe((data) => {

  //   });
  // }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
