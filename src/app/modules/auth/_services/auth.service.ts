import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { UserModel } from '../_models/user.model';
// import { AuthModel } from '../_models/auth.model';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorage as ls } from "src/app/utils/localstorage";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // public fields
  // currentUser$: Observable<UserModel>;
  // isLoading$: Observable<boolean>;
  // currentUserSubject: BehaviorSubject<UserModel>;
  // isLoadingSubject: BehaviorSubject<boolean>;

  userD: Subject<any> = new Subject();
  private userDetails: any;

  set currentUserDetails(index: any) {
    this.userDetails = index;
    this.userD.next(index);
  }

  get currentUserDetails() {
    return this.userDetails;
  }


  // get currentUserValue(): UserModel {
  //   return this.currentUserSubject.value;
  // }

  // set currentUserValue(user: UserModel) {
  //   this.currentUserSubject.next(user);
  // }

  constructor(
    private router: Router,
    private httpClient: HttpClient
  ) {
    // this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    // this.currentUserSubject = new BehaviorSubject<UserModel>(undefined);
    // this.currentUser$ = this.currentUserSubject.asObservable();
    // this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    return this.httpClient.post(
      `Account/Login`,
      {
        email,
        password,
      }
    );
  }

  register(email: string, password: string, confirmPassword: string): Observable<any> {
    return this.httpClient.post(
      `Account/Register`,
      {
        email,
        password,
        confirmPassword
      }
    );
  }

  confirmEmail(userId:string,code:string): Observable<any> {
    return this.httpClient.post(
      `Account/ConfirmEmail`,
      {
        userId,
        code,
      }
    );
  }

  forgetPassword(email:string): Observable<any> {
    return this.httpClient.post(
      `Account/ForgotPassword`,
      {
        email,
      }
    );
  }

  resetPassword(email:string,password:string,confirmPassword:string,code:string): Observable<any>{
    return this.httpClient.post(
      `Account/ResetPassword`,
      {
        email,
        password,
        confirmPassword,
        code,
      }
    );
  }

  logout() {
    ls.removeValue('token');
    ls.removeValue('permissions');
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<any> {
    return this.httpClient.get<any>(`Manage/GetUser`);
  }

  getCompanyLogoAndName(): Observable<any> {
    return this.httpClient.post(
      `Companies/GetCompanyLogoAndName`,{}
    );
  }
}
