import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UsersService {

    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient){}

    getUsers(dataSettings): Observable<any> {
        return this.http.post<any>('Users/GetUsers', dataSettings);
    }
    
    deleteUser(userId:string): Observable<any> {
        return this.http.delete<any>(`Users/DeleteUser?id=${userId}`);
    }

    createUser(userData):Observable<any> {
        return this.http.post<any>('Users/CreateUser', userData);
    }
    
    updateUser(userData):Observable<any> {
        return this.http.post<any>('Users/UpdateUser', userData);
    }

    getRols(paging):Observable<any> {
        return this.http.post<any>('Roles/GetRoles',paging);
    }

    getUserById(id):Observable<any> {
        return this.http.post<any>('Users/GetUser',id);
    }

    getUserPermissions(data):Observable<any> {
        return this.http.post<any>('Users/GetUserPermissions', data);
    }

    grantOrRevokePermissions(data):Observable<any> {
        return this.http.post<any>('Users/GrantOrRevokePermissions', data);
    }
}