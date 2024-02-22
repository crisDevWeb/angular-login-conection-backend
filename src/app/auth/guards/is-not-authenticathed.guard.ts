import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../enum';

export const isNotAuthenticathedGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
    ) => {
        const authService = inject(AuthService);
        const router = inject(Router);

        if (authService.authStatus() === AuthStatus.authenticated) {
            router.navigateByUrl('/dashboard');
            return false;        
        }
       
        return true;
}