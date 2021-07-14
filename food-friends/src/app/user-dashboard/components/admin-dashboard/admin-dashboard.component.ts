import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRadioChange } from '@angular/material/radio';

export interface Role {
  val: string;
  name: string;
}


@Component({
  selector: 'ff-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  users: UserModel[] = [];
  roleList: Role[] = [
    { val: 'ROLE_ADMIN', name: 'Admin'},
    { val: 'ROLE_USER', name: 'User' },
    { val: 'ROLE_PEASANT', name: 'Peasant', }
  ];


  // updateUserForm: FormGroup = new FormGroup({});
  

  constructor(private userService: UserService, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    // this.updateUserForm = this.fb.group({
    //   activity: new FormArray([])
    // });

    this.userService.getAll().subscribe(data => {
      this.users = data;
      // this.addCheckBoxes();
      // this.patchValue();
    })
  }

  editUser(user: UserModel, id: number) {
    const index = this.users.indexOf(user);
    // this.users.find()
    console.log('<><> CHANGED USER??? >>> ', this.users[index])
    this.userService.updateUser(id, this.users[index]).subscribe((result: UserModel) => {
      console.log(result);
      this.openSnackBar('User Updated', 'Admins FTW 🤘')
    })
  }

  onRoleChange(selected: MatRadioChange, user: UserModel) {
 
    user.role = selected.value;
    // const index = this.users.indexOf(user);

    console.log('<><> CHANGED USER??? >>> ', user)
    this.userService.updateUser(user.id, user).subscribe((result: UserModel) => {
      console.log(result);
      this.openSnackBar('User Updated', 'Admins FTW 🤘')
    })
  }

  // get activityFormArray() {
  //   return this.updateUserForm.controls.activity as FormArray;
  // }

  // addCheckBoxes() {
  //   this.users.forEach(() => this.activityFormArray.push(new FormControl(false)));
  // }

  // patchValue() {
  //   this.users.map((user, i) => {
  //     if (user.active) {
  //       this.activityFormArray.at(i).patchValue(true);
  //     }
  //   })
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
      verticalPosition: 'top'
    });
  }

}
