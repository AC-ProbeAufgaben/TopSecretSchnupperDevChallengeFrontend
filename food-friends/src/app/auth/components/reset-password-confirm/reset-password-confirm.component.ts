import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceService } from '../../auth-service.service';
import { SecurityQuestion } from '../register/register.component';

@Component({
  selector: 'ff-reset-password-confirm',
  templateUrl: './reset-password-confirm.component.html',
  styleUrls: ['./reset-password-confirm.component.css']
})
export class ResetPasswordConfirmComponent implements OnInit {
  securityQuestions: SecurityQuestion[] = [];
  tokenFromParams: string = '';
  emailFromToken: string = '';
  isConfirmed = false;

  default= 'choose your question: ';

  updatePasswordForm: FormGroup = new FormGroup({});
  newPassword: FormControl = new FormControl;
  confirmPassword: FormControl = new FormControl;
  securityQuestionId: FormControl = new FormControl;
  securityQuestionAnswer: FormControl = new FormControl;

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,  private fb: FormBuilder, private authService: AuthServiceService, private _snackBar: MatSnackBar) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(param => this.tokenFromParams = param.token)
    this.userService.confirmResetPasswordToken(this.tokenFromParams).subscribe({
      next: (x: any) => {
        console.log(x)
        this.emailFromToken = x.email;
        this.openSnackBar('Confirmed! Please reset password', 'OK!');
        this.isConfirmed = true;
      },
      error: (err: any) => {
        console.log(err);
        this.openSnackBar(err.error.message , 'Whoops :/') ;
        this.isConfirmed = false;
      }
    })
  
    this.newPassword = new FormControl('', [Validators.required]);
    this.confirmPassword = new FormControl('', [Validators.required, this.checkPasswords(this.newPassword)]);
    this.securityQuestionId = new FormControl('', [Validators.required]);
    this.securityQuestionAnswer = new FormControl('', [Validators.required]);
    
    this.updatePasswordForm = this.fb.group({
      'newPassword': this.newPassword,
      'confirmPassword': this.confirmPassword,
      'securityQuestionId': this.securityQuestionId,
      'securityQuestionAnswer': this.securityQuestionAnswer
    });

    this.authService.getSecurityQuestions().subscribe(data => {
      this.securityQuestions = data;
      // this.updatePasswordForm.controls['securityQuestionId'].setValue(-1, {onlySelf: true});
    })

  }

  // CLEAN UP THIS STUFF!!! :>:>::>:>:> :):):)

  onSubmit() {

    const updatePassDetails = {
      username: this.emailFromToken,
      password: this.updatePasswordForm.value.confirmPassword,
      securityQuestionId: this.updatePasswordForm.value.securityQuestionId,
      securityQuestionAnswer: this.updatePasswordForm.value.securityQuestionAnswer
    }

    const resetPasswordObserver = {
      next: (x: any) => {

        this.openSnackBar('Success! Please login with new password', 'WOOHOO!');
        setTimeout(() => this.router.navigate(['/login']), 1700) 
      },
      error: (err: any) => console.log(err)
    }

    this.userService.resetForgottenPassword(updatePassDetails).subscribe(resetPasswordObserver)
  }

  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
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
}
