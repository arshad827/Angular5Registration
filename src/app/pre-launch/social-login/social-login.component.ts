import { Component, OnInit } from '@angular/core';
import { BtHeaderComponent } from '../bt-header/bt-header.component';
import { AuthService, FacebookLoginProvider, GoogleLoginProvider, LinkedinLoginProvider } from 'angular5-social-login';
import { Router } from '@angular/router';
import { LinkedInService } from 'angular-linkedin-sdk';
import { BtAuthService } from '../../bt-auth.service';

declare var Strophe: any;

@Component({
  selector: 'app-social-login',
  templateUrl: './social-login.component.html',
  styleUrls: ['./social-login.component.css']
})
export class SocialLoginComponent implements OnInit {
  public isUserAuthenticated;
  socialPlatformProvider;
  connection: any;
  constructor(
    private socialAuthService: AuthService,
    private router: Router,
    private _linkedInService: LinkedInService,
    private btAuthService: BtAuthService
  ) {
    this.connection = new Strophe.Connection('https://184.171.169.226:5223/http-bind/');
    console.log(Strophe.Status);

  }
  ngOnInit() {
    this._linkedInService.isUserAuthenticated$.subscribe({
      next: (state) => {
        this.isUserAuthenticated = state;
      }
    });
  }

  public socialSignIn(socialPlatform: string) {
    if (socialPlatform === 'facebook') {
      this.socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      this.socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(this.socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ', userData);
        const namearr = userData.name.split(/\s+/);
        const userFirstName = namearr.slice(0, -1).join(' ');
        const userLastName = namearr.pop();

        const userDataClone = {
          'firstName': userFirstName,
          'lastName': userLastName,
          'emailAddress': userData.email
        };

        sessionStorage.setItem('userData', JSON.stringify(userDataClone));
        this.getUserID(userDataClone);

        this.router.navigate(['/register']);


      }

    );
  }

  socialSignInLinkedin() {
    this._linkedInService.login().subscribe(
      (response) => {
        console.log(response);
        if (response === true) {
          const url = '/people/~:(id,first-name,last-name,picture-url,location,industry,positions,email-address)?format=json';
          this._linkedInService.raw(url)
            .asObservable()
            .subscribe({
              next: (data) => {
                console.log(data);
                sessionStorage.setItem('userData', JSON.stringify(data));
                this.getUserID(data);
                this.router.navigate(['/register']);
              },
              error: (err) => {
                console.log(err);
              },
              complete: () => {
                console.log('RAW API call completed');
              }
            });

        }
      }

    );
  }

  getUserID(data) {
    this.btAuthService.storeUserDetailFromSocialSite(data).subscribe(
      (response) => {
        if (response.STATUS === 1001) {
          sessionStorage.setItem('userID', response.RESULT.userID);
          this.connection.register.connect('gains.bluetie.in', this.registerXmpp.bind(this));
          this.router.navigate(['/register']);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  registerXmpp(c) {
    console.log(c)
    if (c == Strophe.Status.REGISTER) {
      let udata = JSON.parse(sessionStorage.getItem('userData'));
      this.connection.register.fields.username = sessionStorage.getItem('userID');
      this.connection.register.fields.password = sessionStorage.getItem('userID');
      this.connection.register.fields.name = udata.firstName + ' ' + udata.lastName;
      this.connection.register.submit();
    }
  }
}
