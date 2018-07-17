import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { BtAuthService } from '../bt-auth.service';
@Injectable()
export class SearchService {

  constructor(private btAuthService: BtAuthService, private http: HttpClient) { }

  getSkillSets() {
    const data = { 'xAction': 'getSkillSets' };
    return this.http.post(this.btAuthService.baseUrl, data)
      .map((response: any) => {
        // console.log(response);
        if (response.STATUS === 1001) {
          sessionStorage.setItem('SkillSet', JSON.stringify(response.RESULT.industryList));
          // localStorage.setItem('SkillSet', JSON.stringify(response.RESULT.industryList));
          return response.RESULT;
        } else {
          return false;
        }
      })
      .shareReplay();
  }
  getfilteredSkillSets(val) {
    const data = { 'xAction': 'getfilteredSkillSets', 'skill': val };
    return this.http.post(this.btAuthService.baseUrl, data)
      .map((response: any) => {
        // console.log(response);
        if (response.STATUS === 1001) {
          return response.RESULT;
        } else {
          return false;
        }
      })
      .shareReplay();
  }

}
