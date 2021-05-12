import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    constructor(private http: HttpClient){}

    getTotalOrdersGroupedByStatus(filterData): Observable<any> {
        return this.http.post<any>('Dashboard/GetTotalOrdersGroupedByStatus',filterData);
    }

    getTopItems(filterData): Observable<any> {
        return this.http.post<any>('Dashboard/GetTopItems',filterData);
    }

    getTopCustomers(filterData): Observable<any> {
        return this.http.post<any>('Dashboard/GetTopCustomers',filterData);
    }

    getExpectedDeliveryOrders(): Observable<any> {
        return this.http.post<any>('Dashboard/GetExpectedDeliveryOrders',{});
    }
}
