import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { DecodedToken } from '../models/DecodedToken';
import { UserModel } from '../models/UserModel';
import { UserService } from '../services/user.service';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  authUrl = "http://localhost:8080/auth/authenticate";
  regUrl = "http://localhost:8080/friends/add";
  helper = new JwtHelperService();
  decodedToken: DecodedToken = new DecodedToken;
 
  private userSubject: BehaviorSubject<UserModel> = new BehaviorSubject(new UserModel);
  public userObservable!: Observable<UserModel>;

  constructor(private http: HttpClient, private router: Router, private userService: UserService) {
    const storedUser = localStorage.getItem('user');

    if (storedUser !== null) {
      this.userSubject = new BehaviorSubject<UserModel>(JSON.parse(storedUser));
      this.userObservable = this.userSubject.asObservable();
    }

    console.log('%c<><> AUTH SERVICE <><>', 'color:cornflowerblue', '\nStored userSubject =', this.userSubject)
  }

  public get userValue(): UserModel {
    return this.userSubject.value;
  }

  login(model: any) {

    return this.http.post(this.authUrl, model).pipe(map((response: any) => {
        const user = response;
        if (user) {
          localStorage.setItem('token', user.jwt);
          this.decodedToken = this.helper.decodeToken(user.jwt);
          
          this.userHelper();

        }
      })
    )
  }

  userHelper() {
    this.userService.getById(this.decodedToken.id).subscribe(data => {
      localStorage.setItem('user', JSON.stringify(data));
      console.log('AUTH service USER HELPER >>>>>>', this.userSubject)
      this.userSubject.next(data);
    })
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

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('LOGOUT::::: ', this.userSubject.getValue())
    this.userSubject.next(new UserModel); // <-----
  }
}
