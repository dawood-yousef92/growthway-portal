import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ManageAccountServise {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    updateUserProfile(data): Observable<any> {
        return this.http.put<any>('Manage/UpdateUserProfile', data);
    }

    changePassword(data:any): Observable<any> {
        return this.http.post<any>('Manage/ChangePassword', data);
    }

    changeEmail(newEmail:any): Observable<any> {
        return this.http.post<any>('Manage/ChangeEmail', newEmail);
    }

    downloadPersonalData(): any {
        return this.http.get('Manage/DownloadPersonalData');
    }

    deleteUser(password): Observable<any> {
        return this.http.post<any>('manage/DeletePersonalData', password);
    }
    
    deleteCompany(password): Observable<any> {
        return this.http.post<any>('Companies/DeleteCompany', password);
    }
    
}