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
      filter = '', sortOrder = 'asc',
      pageNumber: number, pageSize: number ):  Observable<UserModel[]> {
      return this.http.get<BackendResponse>(`${environment.paginatedApiUrl}?page=${pageNumber}&size=${pageSize}`).pipe(
          map(res => res.foodFriends)
      );
  }
}