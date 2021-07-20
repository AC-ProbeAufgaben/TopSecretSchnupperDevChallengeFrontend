import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserModel } from '../models/UserModel';

export interface BackendResponse {
  totalItems: number,
  totalPages: number,
  foodFriends: UserModel[],
  currentPage: number
}

@Injectable({
  providedIn: 'root'
})
export class PaginatedBackendService {


  constructor(private http:HttpClient) {}

  findUsers(
      filter = '', sortOrder: string,
      pageNumber: number, pageSize: number ):  Observable<UserModel[]> {
      
      console.log(sortOrder)
        
      return this.http.get<BackendResponse>(`${environment.paginatedApiUrl}?page=${pageNumber}&size=${pageSize}&direction=${sortOrder}`)
        .pipe(
          map(res => res.foodFriends)
        );
  }
}