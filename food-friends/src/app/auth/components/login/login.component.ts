import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ff-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthServiceService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {

    const loginObserver = {
      next: (x: any) => {
        console.log(f.value.username, ' logged in' );
        this.router.navigate(['/user-profile']);
      },
      error: (resp: HttpErrorResponse) => {
        console.log(resp);
        this.openSnackBar(resp.error.message, ":(")
      }
    }

    this.authService.login(f.value).subscribe(loginObserver);
    
  }

  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }


}
