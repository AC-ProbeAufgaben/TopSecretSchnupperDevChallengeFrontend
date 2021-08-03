import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';
import { SnackbarService } from 'src/app/services/snackbar.service';

@Component({
  selector: 'ff-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  failedAttempts = 0;

  constructor(private authService: AuthServiceService, private userService: UserService, private router: Router, private _snackBar: SnackbarService) { }

  ngOnInit(): void {
    this.failedAttempts = 0;
  }

  onSubmit(f: NgForm) {

    const loginObserver = {
      next: (x: any) => {
        console.log(f.value.username, ' logged in' );
        this.router.navigate(['/user-profile']);

      },
      error: (resp: HttpErrorResponse) => {
        console.log(resp);
        this._snackBar.openSnackBar(resp.error.message, ":(")
        this.failedAttempts++
      }
    }

    this.authService.login(f.value).subscribe(loginObserver);

  }



}
