import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserDashboardRoutingModule } from './user-dashboard-routing.module';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserEditComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    UserDashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [UserEditComponent]
})
export class UserDashboardModule { }
