import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DecodedToken } from '../models/DecodedToken';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  authUrl = "http://localhost:8080/auth/authenticate";
  regUrl = "http://localhost:8080/friends/add";
  helper = new JwtHelperService();
  decodedToken: DecodedToken = new DecodedToken;

  constructor(private http: HttpClient) {
 
  }

  login(model: any) {

    return this.http.post(this.authUrl, model).pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.jwt);
          this.decodedToken = this.helper.decodeToken(user.jwt);
        }
      } )
    )
  }

  register(model: any) {
    model.active = true;
    model.role = 'ROLE_USER';
    return this.http.post(this.regUrl, model)
  }

  notLoggedIn() {
    let token = localStorage.getItem('token');
    if (token == null) return true;
    return this.helper.isTokenExpired(token);
  }


}