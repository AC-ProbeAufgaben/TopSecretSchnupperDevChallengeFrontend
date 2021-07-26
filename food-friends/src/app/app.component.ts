import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './auth/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserService } from './services/user.service';


@Component({
  selector: 'ff-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageTitle = 'Food Friends';
  helper = new JwtHelperService;
  isAdmin = false;

  constructor(public authService: AuthServiceService, private userService: UserService) {

  }

  ngOnInit() {
    const token: any = localStorage.getItem('token');
    if(token) {
      this.authService.decodedToken = this.helper.decodeToken(token);
      if (this.authService.userValue.role === 'ROLE_ADMIN') this.isAdmin = true
    }
  }

  logout() {
    this.authService.logout();
    this.isAdmin = false;
  }
}
