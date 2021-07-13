import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './auth/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { UserService } from './services/user.service';
import { E } from '@angular/cdk/keycodes';

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
      const tokenId = this.authService.decodedToken.id;

    this.userService.getById(tokenId).subscribe(user => {

      if(user.role === 'ROLE_ADMIN') this.isAdmin = true
      else this.isAdmin = false;
    })
  }
  }

  logout() {
    localStorage.removeItem('token');
    this.isAdmin = false;
  }
}
