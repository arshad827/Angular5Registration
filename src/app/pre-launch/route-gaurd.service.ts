import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// import { AuthService } from './auth.service';
import { BtAuthService } from '../bt-auth.service';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class RouteGaurdService implements CanActivate {
  constructor(
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<any> | Promise<any> {
    console.log('Auth Gaurd');
    //  tslint:disable-next-line:max-line-length
    if (localStorage.getItem('userID') || sessionStorage.getItem('userID')) {
      return true;
    } else {
      this.router.navigate(['/social']);
    }
  }

}
