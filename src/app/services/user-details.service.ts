import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../model/users';
import { Router } from '@angular/router';
import { BtAuthService } from '../bt-auth.service';

import 'rxjs/add/operator/shareReplay';

@Injectable()
export class UserDetailsService {

  constructor(private http: HttpClient, private router: Router, private btAuthService: BtAuthService) { }

  /**
   * To get the UserDetails
   * @param userID
   */
  getUserDetails(userID) {
    const data = {
      xAction: 'getUserDetail',
      userID: userID
    };
    return this.http.post(this.btAuthService.baseUrl, data)
      .map((response: any) => {
        console.log(response);
        if (response.STATUS === 1001) {
          localStorage.setItem('profile', JSON.stringify(response.RESULT));
          return response.RESULT;
        } else {
          return false;
        }
      })
      .shareReplay();
  }


  postFile(fileToUpload: File): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('message', fileToUpload, fileToUpload.name);
    formData.append('messageType', 'image');
    formData.append('xAction', 'uploadUserChatImageDoc');
    console.log('formData ', formData);
    return this.http.post(this.btAuthService.baseUrl, formData)
      .map((response: any) => {
        console.log(response);
        return response;
      })
      .shareReplay();
  }

}
