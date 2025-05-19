import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable,  } from 'rxjs';
import { UniminutoService } from '../services/uniminuto.service';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate, CanMatch {

  constructor(
    private _uniminuto: UniminutoService,
    private _router: Router
  ) { }
  

  private checkAuthStatus(): Observable<boolean | UrlTree> {
    return this._uniminuto.checkAuthentication().pipe(
      map(isAuthenticated => {
        return isAuthenticated ? true : this._router.parseUrl('/auth/login');
      })
    );
  }
  

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthStatus();
  }

  canMatch(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthStatus();
  }
}

