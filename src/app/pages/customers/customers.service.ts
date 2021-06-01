import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CustomersService {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    getCustomers(dataSettings): Observable<any> {
        return this.http.post<any>('Customers/GetCustomers', dataSettings);
    }

    getCustomerById(data): Observable<any> {
        return this.http.post<any>('Customers/GetCustomerById', data);
    }
}