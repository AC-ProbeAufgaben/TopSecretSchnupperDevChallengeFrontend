import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
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
  userModel: UserModel = new UserModel;

  constructor(public authService: AuthServiceService, private http: HttpClient, private userService: UserService) { }

  ngOnInit() {
   this.usersName = this.authService.decodedToken.name; 
   this.usersId = this.authService.decodedToken.id;

   console.log('%c<><> USER-PROFILE COMPONENT <><>', this.logColor, '\n', this.usersId, this.usersName);

   this.userService.getById(this.usersId).subscribe(
     user => {
       this.userModel = user;
      }
    );
     
   return this.userModel;
  }
}

