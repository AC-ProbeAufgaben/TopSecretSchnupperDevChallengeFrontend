import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'src/app/app.component';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'ff-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  logColor = 'color:cornflowerblue'
  usersName: String = '';  
  usersId: number = 0;
  userModel = new UserModel;

  constructor(public authService: AuthServiceService, private http: HttpClient, private userService: UserService, private appComp: AppComponent) {

    this.usersName = this.authService.decodedToken.name; 
    this.usersId = this.authService.decodedToken.id;
  }

  ngOnInit() {
   this.userService.getById(this.usersId).subscribe(user => {
     this.userModel = user;
     if (this.userModel.role === 'ROLE_ADMIN') this.appComp.isAdmin = true;

     console.log('%c<><> USER-PROFILE COMPONENT <><>', this.logColor, '\n', this.usersId, this.usersName, this.userModel);
    })
    
  }

}


