import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'ff-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthServiceService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {

    const loginObserver = {
      next: (x: any) => {
        console.log(f.value.username, ' logged in' );
        this.router.navigate(['/user-profile']);
      },
      error: (err: any) => console.log(err)
    }

    this.authService.login(f.value).subscribe(loginObserver);

  }

}
