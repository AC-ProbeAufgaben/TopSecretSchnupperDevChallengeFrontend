import { Injectable } from '@angular/core';
import { UserModel } from '../models/UserModel';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from '../models/AuthRequest';
import { FoodFriendsDto } from '../models/FoodFriendsDto';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }
 
  getAll(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${environment.apiUrl}all`);
  }
  
  getById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiUrl}${id}`);
  }

  updateUser(id: number, user: FoodFriendsDto): Observable<UserModel> {
    return this.http.put<UserModel>(`${environment.apiUrl}edit/${id}`, user);
  }

  changePassword(id: number, authRequest: AuthRequest): Observable<UserModel> {
    return this.http.put<UserModel>(`${environment.apiUrl}edit-password/${id}`, authRequest);
  }
}
