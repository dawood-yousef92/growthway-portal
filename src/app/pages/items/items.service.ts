import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ItemsService {
    constructor(private http: HttpClient){}

    getCompanyCategories(data): Observable<any> {
        return this.http.post<any>('Products/GetCompanyCategories', data);
    }

    getProducts(dataSettings): Observable<any> {
        return this.http.post<any>('Products/GetProducts', dataSettings);
    }
    
    createProduct(formData): Observable<any> {
        return this.http.post<any>('Products/CreateProduct', formData);
    }

    deleteProduct(id): Observable<any> {
        return this.http.delete<any>(`Products/DeleteProduct?id=${id}`);
    }

    getProduct(filterData): Observable<any> {
        return this.http.post<any>('Products/GetProduct', filterData);
    }

    updateProduct(formData): Observable<any> {
        return this.http.put<any>('Products/UpdateProduct', formData);
    }

    getCategoriesByBusinessType(businessType,level): Observable<any> {
        return this.http.post<any>('Companies/GetCategoriesByBusinessType', {businessType:businessType,level: level});
    }

    getTaxByTenant(): Observable<any> {
        return this.http.post<any>('Companies/GetTaxByTenant', {});
    }
}
