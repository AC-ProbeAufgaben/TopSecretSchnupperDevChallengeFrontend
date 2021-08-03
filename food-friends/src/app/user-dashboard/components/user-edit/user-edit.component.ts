import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthServiceService } from 'src/app/auth/auth-service.service';
import { FoodFriendsDto } from 'src/app/models/FoodFriendsDto';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SnackbarService } from 'src/app/services/snackbar.service';

export interface Food {
  name: string;
}

@Component({
  selector: 'ff-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  // MAT CHIPS STUFF
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  foods: Food[] = [];
  userInfo: UserModel = new UserModel;

  // BORING STUFF
  id = this.authService.decodedToken.id;
  emailLogin = this.authService.decodedToken.sub;
  logColor = 'color:cornflowerblue';
  passSub: Subscription = new Subscription;
  userSub: Subscription = new Subscription;

  updatePasswordForm: FormGroup = new FormGroup({});
  oldPassword: FormControl = new FormControl;
  newPassword: FormControl = new FormControl;
  confirmPassword: FormControl = new FormControl;
  updatePassText = '';
  
  email: FormControl = new FormControl;
  name: FormControl = new FormControl;
  lastName: FormControl = new FormControl;
  updateUserInfoForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required])
  });

  clickedUpdate: boolean = false;
  changePassText = 'Update Password '; 
  userInfoUpdateText = 'Update User Info ';

  constructor(
    private fb: FormBuilder, 
    private userService: UserService, 
    private authService: AuthServiceService,
    private router: Router,
    private _snackBar: SnackbarService
    ) { }

  ngOnInit(): void {

    this.oldPassword = new FormControl('', [Validators.required]);
    this.newPassword = new FormControl('', [Validators.required]);
    this.confirmPassword = new FormControl('', [Validators.required, this.checkPasswords(this.newPassword)]);
    
    this.updatePasswordForm = this.fb.group({
      'oldPassword': this.oldPassword,
      'newPassword': this.newPassword,
      'confirmPassword': this.confirmPassword
    });

    this.userService.getById(this.id).subscribe(user => { 
      this.userInfo = user;
      user.favFoods?.forEach(food => this.foods.push({name: food.name}))
  
      this.updateUserInfoForm.setValue({
        email: user.email,
        name: user.name,
        lastName: user.lastName
      })
    }, error => {
      console.error(error.message); 
      throw error;
    }, () => {
      console.log('\'getById()\' called succesfully. Subscription complete');
    });
  }

  onSubmit() {
    if (this.updateUserInfoForm?.valid) {
      if (this.updatePasswordForm?.valid) {
        try {
          this.changePassword().then( () => this.changeUserInfo() )
        } catch (error) {
          console.log('%cTRY-CATCH ERROR >>>>', error);
        }
      } else {
        this.changeUserInfo();
      }
    }
  }
  
  changePassword() {
    return new Promise((resolve) => {
      if (this.updatePasswordForm?.valid) {

        const userDetails = this.updatePasswordForm.value;
  
        const myObserver = {
          next: (result: UserModel) => {
            console.log(result);
            resolve(result);
          },
          error: (err: HttpErrorResponse) => {
            this.updatePassText = err.error.message;
            console.log(err);
            this._snackBar.openSnackBar(err.error.message, 'Merp')

          }
        };
        
        this.passSub = this.userService.changePassword(this.id, userDetails).subscribe(myObserver);
      }
    })
  } 

  changeUserInfo() {
    
    console.log('%c<><>< Update User Info Form ><><>', this.logColor, '\n', this.updateUserInfoForm.value)

    let userDetails: FoodFriendsDto = new FoodFriendsDto;

    userDetails = this.updateUserInfoForm.value;
    userDetails.role = this.userInfo.role;
    userDetails.active = this.userInfo.active;
    userDetails.favFoodsList = this.foods.map(food => food.name);
    
    console.log('%c<><>< Update FoodFriedsDTO ><><>', this.logColor, '\n', userDetails)

    this.userSub = this.userService.updateUser(this.id, userDetails).subscribe((result: UserModel) => {
      console.log('%c< RETURNED USER >', this.logColor, result);
      this.userInfoUpdateText = 'User Info Updated! '
      if (userDetails.email != this.emailLogin) {
        let sbRef = this._snackBar.openSnackBar("Success! Please login with new user details", "LOGIN")
        sbRef.afterDismissed().subscribe(() => {
          console.log('::::::::::The snack-bar was dismissed'); 
          this.getNewJwt();
        })
      } else {
        
        this._snackBar.openSnackBar(this.userInfoUpdateText, 'YUMMY!')
      }
    })

  }

  onClickUpdatePassword() {
    this.clickedUpdate = !this.clickedUpdate;
    this.changePassText = !this.clickedUpdate ? 'Update Password ' : 'Hide Password ';
    
    document.getElementById('updatePassButton')?.classList.toggle('btn-warning');
    document.getElementById('updatePassButton')?.classList.toggle('btn-outline-secondary');
    document.getElementById('lockIcon')?.classList.remove(!this.clickedUpdate ? 'fa-unlock' : 'fa-lock');
    document.getElementById('lockIcon')?.classList.add(this.clickedUpdate ? 'fa-unlock' : 'fa-lock');

  }

  // MORE MAT CHIPS STUFF
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value && this.foods.length < 5) {
      this.foods.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  // MORE MAT CHIPS STUFF
  remove(food: Food): void {
    const index = this.foods.indexOf(food);

    if (index >= 0) {
      this.foods.splice(index, 1);
    }
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

  onDestroy() {
    this.passSub.unsubscribe();
    this.userSub.unsubscribe();
  }

}
