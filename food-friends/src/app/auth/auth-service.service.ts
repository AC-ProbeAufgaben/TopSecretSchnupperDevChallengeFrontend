import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  authUrl = "http://localhost:8080/auth/authenticate";
  regUrl = "http://localhost:8080/friends/add";

  constructor(private http: HttpClient) {
 
  }

  login(model: any) {
    return this.http.post(this.authUrl, model).pipe(
      map((response: any) => {
        const user = response;
        if (user.jwt.length > 10) {
          
          localStorage.setItem('token', user.token)
        }
      } )
    )
  }

  register(model: any) {
    console.log(model)
    model.active = true;
    model.role = 'ROLE_USER';
    return this.http.post(this.regUrl, model)
  }
}
