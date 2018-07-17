import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router/src/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
// import { AuthService } from './auth.service';
import { BtAuthService } from './bt-auth.service';
import { Router } from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
// tslint:disable-next-line:one-line
export class AuthGaurdService implements CanActivate {
  constructor(
    private btAuthService: BtAuthService,
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<any> | Promise<any> {
    console.log('Auth Gaurd');
    //  tslint:disable-next-line:max-line-length
    if (this.btAuthService.loggedIn || localStorage.getItem('blueTiePin') || localStorage.getItem('userID') || localStorage.getItem('token')) {
      const promise = new Promise<any>((resolve, reject) => {
        this.btAuthService.isAuthenticated().subscribe(
          (data) => {
            if (data.STATUS === 200) {
              console.log('in 200');
              resolve(true);
            } else {
              // console.log('guard else');
              resolve(false);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      });
      return promise.then(
        (res) => {
          if (res === true) {
            console.log(res);
            return true;
          } else {
            this.router.navigate(['/auth']);
          }
        }
      );
      // return promise;
    } else {
      console.log('==>', this.btAuthService.loggedIn);
      this.router.navigate(['/auth']);
    }
  }

  // old working
  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): boolean | Observable<boolean> | Promise<boolean> {
  //   console.log('Auth Gaurd');
  //   return this.store.select('auth').take(1).map((authState: fromAuth.State) => {
  //     console.log(authState.authenticated);
  //     if (authState.authenticated === false) {
  //       this.router.navigate(['/auth']);
  //     } else {
  //       return authState.authenticated;

  //     }
  //   });
  // tslint:disable-next-line:max-line-length
  // if (this.btAuthService.loggedIn) {
  //   return true;
  // } else {
  //   console.log('==>', this.btAuthService.loggedIn);
  //   this.router.navigate(['/auth']);
  // }
  // }
}
