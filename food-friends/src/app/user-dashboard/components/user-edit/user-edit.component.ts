import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
import { FoodFriendsDto } from 'src/app/models/FoodFriendsDto';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'ff-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  id = this.authService.decodedToken.id;
  emailLogin = this.authService.decodedToken.sub;
  logColor = 'color:cornflowerblue';

  clickedUpdate: boolean = false;
  updatePasswordForm: FormGroup = new FormGroup({});
  oldPassword: FormControl = new FormControl;
  newPassword: FormControl = new FormControl;
  confirmPassword: FormControl = new FormControl;
  mySub: Subscription = new Subscription;
  updateText = '';
  isUpdated: boolean = false;

  updateUserInfoForm: FormGroup = new FormGroup({});
  email: FormControl = new FormControl;
  name: FormControl = new FormControl;
  lastName: FormControl = new FormControl;
  favFoodsList: FormControl = new FormControl;
  userInfoUpdateText = '';
  userInfoIsUpdated: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private authService: AuthServiceService,
    private router: Router
    ) { }

  ngOnInit(): void {
    // this.updatePasswordForm = this.fb.group({
    //   oldPassword: ['', Validators.required],
    //   newPassword: ['', Validators.required],
    //   confirmPassword: ['', [Validators.required, this.checkPasswords(this.newPassword)]],
    // })

    this.oldPassword = new FormControl('', [Validators.required]);
    this.newPassword = new FormControl('', [Validators.required]);
    this.confirmPassword = new FormControl('', [Validators.required, this.checkPasswords(this.newPassword)]);
    
    this.updatePasswordForm = this.fb.group({
      'oldPassword': this.oldPassword,
      'newPassword': this.newPassword,
      'confirmPassword': this.confirmPassword
    });

    this.email = new FormControl('', [Validators.required]);
    this.name = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('', [Validators.required]);
    this.favFoodsList = new FormControl('', [Validators.maxLength(50)]);

    // this.updateUserInfoForm = this.fb.group({
    //   email: ['', Validators.required],
    //   name: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   favFoodsList: ['', Validators.maxLength(50)]
    // });

    this.updateUserInfoForm = this.fb.group({
      'email': this.email,
      'name': this.name,
      'lastName': this.lastName,
      'favFoodsList': this.favFoodsList
    });


    this.userService.getById(this.id).subscribe(user => {
      // console.log(user)
      this.updateUserInfoForm.setValue({
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        favFoodsList: user.favFoods?.map(food => food.name).join(', ') // TRIM !!!
      })
    });
  }

  updateUserInfo() {
    if (this.updateUserInfoForm?.valid) {
      console.log('%c<><>< Update User Info Form ><><>', this.logColor, '\n', this.updateUserInfoForm.value)
      let userDetails: FoodFriendsDto = new FoodFriendsDto;

      if (this.updateUserInfoForm.value.favFoodsList && this.updateUserInfoForm.value.favFoodsList.length > 0) {
        this.updateUserInfoForm.value.favFoodsList = this.updateUserInfoForm.value.favFoodsList
          .split(',')
          .map((food: string) => food.trim())
          .filter((str: string) => str.length !== 0);
      }
      userDetails = this.updateUserInfoForm.value;

      console.log('%c<><>< Update FoodFriedsDTO ><><>', this.logColor, '\n', userDetails)

      this.userService.updateUser(this.id, userDetails).subscribe((result: UserModel) => {
        console.log('%c< RETURNED USER >', this.logColor, result);
        this.userInfoIsUpdated = true;
        this.userInfoUpdateText = "Update Succesful!"
      })

      if (userDetails.email != this.emailLogin) {
        this.getNewJwt();
        alert("Update Successful. Please login again with new user details :)");
      }
    }
  }
  
  onSubmit() {
    if (this.updatePasswordForm?.valid) {
      const userDetails = this.updatePasswordForm.value;

      const myObserver = {
        next: (result: UserModel) => {
          console.log(result);
          this.isUpdated = true;
          this.updateText = "Update Succesful!"
        },
        error: (err: HttpErrorResponse) => {
          this.updateText = err.error.message;
          this.isUpdated = true;
          console.log(err);
        }
      };

      this.mySub = this.userService.changePassword(this.id, userDetails).subscribe(myObserver);
    }
  }

  onDestroy() {
    this.mySub.unsubscribe;
  }

  checkPasswords(firstControl: AbstractControl): ValidatorFn {
    return (
        secondControl: AbstractControl
    ): { [key: string]: boolean } | null => {
        // return null if controls haven't initialised yet
        if (!firstControl && !secondControl) {
            return null;
        }

        // return null if another validator has already found an error on the matchingControl
        if (secondControl.hasError && !firstControl.hasError) {
            return null;
        }
        // set error on matchingControl if validation fails
        if (firstControl.value !== secondControl.value) {
            
          return { mustMatch: true };
        } else {
          return null;
        }
    };
  }

  getNewJwt() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  onClickUpdatePassword() {
    this.clickedUpdate = !this.clickedUpdate;
  }

}
