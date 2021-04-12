import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RolsService {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    getRols(dataSettings): Observable<any> {
        return this.http.post<any>('Roles/GetRoles', dataSettings);
    }
    
    deleteRol(rolId:string): Observable<any> {
        return this.http.delete<any>(`/Roles/DeleteRole?id=${rolId}`);
    }

    createRole(rolData):Observable<any> {
        return this.http.post<any>('Roles/CreateRole', rolData);
    }
    
    updateRol(rolData):Observable<any> {
        return this.http.put<any>('Roles/UpdateRole', rolData);
    }

    getRolById(id):Observable<any> {
        return this.http.post<any>('Roles/GetRole',id);
    }

    getPermessions():Observable<any> {
        return this.http.post<any>('Permissions/GetPermissions', {isEagerLoaded: true});
    }
}