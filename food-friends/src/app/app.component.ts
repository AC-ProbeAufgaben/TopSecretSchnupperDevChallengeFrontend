import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './auth/auth-service.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'ff-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageTitle = 'Food Friends';
  helper = new JwtHelperService;
 

  constructor(public authService: AuthServiceService) {

  }

  ngOnInit() {
    const token: any = localStorage.getItem('token');
    this.authService.decodedToken = this.helper.decodeToken(token);
  }

  logout() {
    localStorage.removeItem('token');
    
  }
}
