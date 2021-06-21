import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'ff-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {

    const loginObserver = {
      next: (x: any) => console.log(f.value.username, ' logged in' ),
      error: (err: any) => console.log(err)
    }

    this.authService.login(f.value).subscribe(loginObserver);
  }

}
