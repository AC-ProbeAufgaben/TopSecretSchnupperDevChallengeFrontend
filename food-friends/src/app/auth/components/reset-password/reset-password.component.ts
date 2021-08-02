import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ff-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  emailSent = false;

  private httpClient: HttpClient;

  constructor(handler: HttpBackend, private userService: UserService, private router: Router, private _snackBar: MatSnackBar) { 
    this.httpClient = new HttpClient(handler);
  }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.loading = true;
    console.log(f.value.email, 'requested to reset password');

    const resetPassObserver = {
      next: (x: any) => {
        this.loading = false;
        this.openSnackBar('E-mail Sent!', 'WOOHOO!');
        this.emailSent = true;
      },
      error: (err: any) => {
        this.loading = false;
        console.log(err);
        this.openSnackBar(err.error.message, 'Whoops :/') 
      }
    }
    
    this.postResetPasswordEmail(f.value).subscribe(resetPassObserver);
  }

  postResetPasswordEmail(email: string): Observable<String> {
    // const resetPassRequest = {
    //   email: email
    // }
    return this.httpClient.post<String>(`${environment.resetPassUrl}`, email)
  }

  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }

}
