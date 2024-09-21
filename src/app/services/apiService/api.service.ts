import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  login(email:string,password:string){
    return this.http.post(`${environment.apiUrl}/auth`, {email, password})
  }

  getActiveUsers(){
    return this.http.get(`${environment.apiUrl}/users/active`);
  }



}
