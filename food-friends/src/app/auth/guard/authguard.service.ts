import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs/operators';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceService } from '../auth-service.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthServiceService, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const token = localStorage.getItem('token');
        const user = this.authService.userValue;
        
        if (user && token && !this.authService.helper.isTokenExpired(token)) {
            console.log('%c<><> AUTHGAURD User Behavior Subject <><>', 'color:orange', '\n >>>>>>', user)

            if (route.data.roles && route.data.roles.indexOf(user.role) === -1) {
                // role not authorised so redirect to home page
                console.log('%c<><> AUTHGAURD <><>', 'color:orange', '\nnot Authorized', user)
                this.router.navigate(['/']);
                return false;
            }
            console.log('%c<><> AUTHGAURD <><>', 'color:orange', '\ntoken present, logging in >>>>>>', user.role)

            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;

    }
}