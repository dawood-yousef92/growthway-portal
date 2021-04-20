import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root",
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private toaster: ToastrService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let apiUrl = request.url;
    if (apiUrl.toLowerCase().indexOf('https://jsonplaceholder.typicode') < 0 && apiUrl.toLowerCase().indexOf('.json') < 0) {
      apiUrl = `${environment.apiUrl}${request.url}`;
    }
    else {
      return next.handle(request);
    }

    request = request.clone({
      url: apiUrl,
    });

    const token = localStorage.getItem('token');
    const tanent = window.location.href.split('.')[0].split('//')[1];
    console.log(tanent);

    if (tanent != null && !tanent.includes('growthway')) {
      if (token != null) {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token.replace(/\"/g, ""),
            // "X-Tenant": tanent,
            "X-Tenant": 'carey_and_little_traders-',
          },
        });
      }
      else {
        request = request.clone({
          setHeaders: {
            // "X-Tenant": tanent,
            "X-Tenant": 'carey_and_little_traders-',
          },
        });
      }
    }

    return next.handle(request)
      .pipe(catchError(err => {
        if ([401, 403].includes(err.status)) {
          localStorage.removeItem('token');
          localStorage.removeItem('permissions');
          localStorage.removeItem('adminLogin');
          window.location.href = ('auth/login');
        }

        if (err.error.validationErrors) {
          const error = err.error.validationErrors;
          error.map((item) => {
            this.toaster.error(item.reason);
          })
          return throwError(error);
        }
        else if (err.error.title) {
          const error = err.error;
          this.toaster.error(err.error.title)
          return throwError(error);
        }
        else if (err.error.detail) {
          const error = err.error;
          this.toaster.error(err.error.detail)
          return throwError(error);
        }
        else {
          const error = err.error;
          this.toaster.error('Unknown Error')
          return throwError(error);
        }
        // else if(err.error.data) {
        //   const error = err.error.data;
        //   return throwError(error);
        // }
        // else if(err.error.message) {
        //   const error = err.error.message;
        //   return throwError(error);
        // }
        // else {
        //   const error =  err.statusText;
        //   return throwError(error);
        // }
      }));
  }

}
