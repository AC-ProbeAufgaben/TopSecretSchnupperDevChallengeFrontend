import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { AuthServiceService } from '../../auth-service.service';

export class SecurityQuestion {
  id: number = 0;
  question: string = '';
}

@Component({
  selector: 'ff-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  securityQuestions: SecurityQuestion[] = [];
  securityQuestionId: number = -1;
  securityAnswer: string = '';

  constructor(private authService: AuthServiceService, private router: Router, private _snackBar: SnackbarService) { }

  ngOnInit(): void {
    this.authService.getSecurityQuestions().subscribe(data => {

      this.securityQuestions = data
    })
  }

  onSubmit(f: NgForm) {
    if (f.value.securityQuestionId == -1) {
      this._snackBar.openSnackBar('Please choose a security question', 'Merp :/');
      return;
    }

    const registerObserver = {
      next: (x: any) => {
        console.log(f.value.email, 'User created')
        this._snackBar.openSnackBar('Success! Please login', 'WOOHOO!');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000)
      },
      error: (err: any) => {
        this._snackBar.openSnackBar(err.message, ':(')
        console.error(err)
      }
    }

    this.authService.register(f.value).subscribe(registerObserver);
  }


}
