import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'ff-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthServiceService, private router: Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {

    const registerObserver = {
      next: (x: any) => {
        console.log(f.value, 'User created')
        this.router.navigate(['/user-profile']);
        this.openSnackBar('Success! Please login', 'WOOHOO!');
      },
      error: (err: any) => console.log(err)
    }

    this.authService.register(f.value).subscribe(registerObserver);
  }

  openSnackBar(message: string, action: string) {
    return this._snackBar.open(message, action, {
      duration: 4000,
      verticalPosition: 'top'
    });
  }

}
