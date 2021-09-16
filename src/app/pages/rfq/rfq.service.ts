import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RfqService {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    getRfqs(data): Observable<any> {
        return this.http.post<any>('Rfq/GetRfqs', data);
    }  

    updateRfqOrder(data): Observable<any> {
        return this.http.post<any>('Rfq/UpdateRfqOrder', data);
    }
    
    updateRfq(data): Observable<any> {
        return this.http.post<any>('Rfq/UpdateRfq', data);
    }
    
}