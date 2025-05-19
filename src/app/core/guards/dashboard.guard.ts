import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { UniminutoService } from '../services/uniminuto.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardGuard implements CanActivate, CanMatch {

    constructor(
        private _uniminuto: UniminutoService,
        private _router: Router
    ) { }


    private checkAuthStatusSecondLogin(): boolean | Observable<boolean> {

        return this._uniminuto.checkAuthentication()
            .pipe(
                tap(isAuthenticated => {
                    if (!isAuthenticated) {
                        this._router.navigate(['./auth/login'])
                    }
                }),

            )
    }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkAuthStatusSecondLogin();;
    }
    canMatch(
        route: Route,
        segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkAuthStatusSecondLogin();;
    }

}
