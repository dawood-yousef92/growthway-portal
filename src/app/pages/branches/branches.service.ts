import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class BranchesService {
    constructor(private http: HttpClient){}

    getBranches(dataSettings): Observable<any> {
        return this.http.post<any>('Branches/GetBranches', dataSettings);
    }
    
    deleteBranch(id): Observable<any> {
        return this.http.delete<any>(`Branches/DeleteBranch?id=${id}`);
    }

    createBranch(formData): Observable<any> {
        return this.http.post<any>('Branches/CreateBranch', formData);
    }

    getBranch(id): Observable<any> {
        return this.http.post<any>('Branches/GetBranch', {id:id});
    }

    updateBranch(formData): Observable<any> {
        return this.http.put<any>('Branches/UpdateBranch', formData);
    }

    getFullAddressName(lat,lng) {
        return this.http.get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDGY4ZEEgNDbOWPz4riWbb38AB6L-GgBic&language=ar`);   
    }
}
