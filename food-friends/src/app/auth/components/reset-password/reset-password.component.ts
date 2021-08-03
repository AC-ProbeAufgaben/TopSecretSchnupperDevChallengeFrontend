import { HttpBackend, HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SnackbarService } from 'src/app/services/snackbar.service';
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

  constructor(handler: HttpBackend, private userService: UserService, private router: Router, private _snackBar: SnackbarService) { 
    this.httpClient = new HttpClient(handler); // bypass JWT token interceptor 
  }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    this.loading = true;
    console.log(f.value.email, 'requested to reset password');
    console.log(f.value)

    const resetPassObserver = {
      next: (x: any) => {
        this.loading = false;
        this._snackBar.openSnackBar('E-mail Sent!', 'WOOHOO!');
        this.emailSent = true;
      },
      error: (err: any) => {
        this.loading = false;
        console.log(err);
        this._snackBar.openSnackBar(err.error.message, 'Whoops :/') 
      }
    }
    
    this.postResetPasswordEmail(f.value).subscribe(resetPassObserver);
  }

  postResetPasswordEmail(email: string): Observable<String> {

    return this.httpClient.post<String>(`${environment.resetPassUrl}`, email)
  }


}
