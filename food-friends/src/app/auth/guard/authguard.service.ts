import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs/operators';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';
import { AuthServiceService } from '../auth-service.service';


@Injectable()
export class AuthGuard implements CanActivate {
    isAdmin: string = '';
    user: UserModel = new UserModel;

    constructor(private router: Router, private authService: AuthServiceService, private userService: UserService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const token = localStorage.getItem('token');
        this.userService.getById(this.authService.decodedToken.id).subscribe(data => {
            this.isAdmin = data.role;
            this.user = data;
        });

        if (token && !this.authService.helper.isTokenExpired(token)) {
            if (route.data.roles && route.data.roles.indexOf(this.user.role) === -1) {
                // role not authorised so redirect to home page
                console.log('%c<><> AUTHGAURD <><>', 'color:orange', '\nnot Authorized', this.user.role)
                this.router.navigate(['/']);
                return false;
            }
            console.log('%c<><> AUTHGAURD <><>', 'color:orange', '\ntoken present, logging in >>>>>>', this.user.role)

            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}