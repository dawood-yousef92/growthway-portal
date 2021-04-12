import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GeneralService {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    getCountries(): Observable<any> {
        return this.http.post<any>('Lookups/GetCountries', {});
    }
    
    getUnitOfMeasurements(): Observable<any> {
        return this.http.post<any>('Lookups/GetUnitOfMeasurements', {});
    }

    getPackagingTypes(): Observable<any> {
        return this.http.post<any>('Lookups/PackagingTypes', {});
    }

    getShelfLifeTypes(): Observable<any> {
        return this.http.post<any>('Lookups/GetShelfLifeTypes', {});
    }
    
}