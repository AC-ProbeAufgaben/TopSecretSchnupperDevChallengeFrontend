import { Injectable } from '@angular/core';
import { UserModel } from '../models/UserModel';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthRequest } from '../models/AuthRequest';
import { FoodFriendsDto } from '../models/FoodFriendsDto';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(private http: HttpClient) { }


  getAll() {
    return this.http.get<UserModel[]>(`${environment.apiUrl}/all`);
  }
  
  getById(id: number) {
    return this.http.get<UserModel>(`${environment.apiUrl}${id}`);
  }

  updateUser(id: number, user: FoodFriendsDto) {
    return this.http.put<UserModel>(`${environment.apiUrl}edit/${id}`, user);
  }

  // TODO : observable generics ???
  changePassword(id: number, authRequest: AuthRequest) {
    return this.http.put<UserModel>(`${environment.apiUrl}edit-password/${id}`, authRequest);
  }
}
