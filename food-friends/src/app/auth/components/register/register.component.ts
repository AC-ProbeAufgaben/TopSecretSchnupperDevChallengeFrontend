import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthServiceService } from '../../auth-service.service';

@Component({
  selector: 'ff-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {

    const registerObserver = {
      next: (x: any) => console.log(f.value, 'User created'),
      error: (err: any) => console.log(err)
    }

    this.authService.register(f.value).subscribe(registerObserver);
  }

}
