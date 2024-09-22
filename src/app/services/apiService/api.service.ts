import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';


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

  getAllUser(userId:any){
    return this.http.get(`${environment.apiUrl}/users?userId=${userId}`);
  }

  //messages
  getChatHistory(senderId: any, recipientId: any): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/chat?senderId=${senderId}&recipientId=${recipientId}`);
  }



}
