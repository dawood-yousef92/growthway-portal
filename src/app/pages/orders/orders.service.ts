import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class OrdersService {
    constructor(private http: HttpClient){}

    getOrders(dataSettings): Observable<any> {
        return this.http.post<any>('Orders/GetOrders', dataSettings);
    }

    getOrder(id): Observable<any> {
        return this.http.post<any>('Orders/GetOrder', {id:id});
    }

}
