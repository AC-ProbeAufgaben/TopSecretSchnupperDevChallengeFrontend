import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { UserDashboardModule } from './user-dashboard/user-dashboard.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptTokenService } from './auth/token-intercepter/intercept-token.service';
import { AuthGuard } from './auth/guard/authguard.service';
import { FormBuilder, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    BsDropdownModule.forRoot(),
    UserDashboardModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: InterceptTokenService, multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
