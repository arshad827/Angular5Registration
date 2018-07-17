import { Injectable, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from './model/users';
import { Router } from '@angular/router';
import 'rxjs/add/operator/shareReplay';

// xmpp strophe
declare var Strophe: any;
declare var messageCarbons: any;
declare var CarbonMessage: any;
declare var roster: any;
declare var $pres: any;
declare var $msg: any;
declare var register: any;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class BtAuthService implements OnInit {

  loggedIn = false;
  // authState: Observable<fromAuth.State>;
  // baseUrl = 'https://www.bluetie.in/bluetie-cms/inc/site.inc.web1.php';
  baseUrl = 'https://www.bluetie.in/bluetie-cms/inc/BlueTieAPI_v.0.1.php';
  baseWebUrl = 'https://www.bluetie.in/bluetie-cms/inc/BlueTie_Web_v.0.1.php';
  adminBaseWebUrl = 'http://dev.api.bluetieglobal.com/admin';
  BOSH_SERVICE = 'https://gains.bluetie.in:7070/http-bind/';
  connection;
  xmppUser;
  authUserProfile;
  sendResInArr = [];
  constructor(private http: HttpClient, private router: Router) {
    this.connection = new Strophe.Connection(this.BOSH_SERVICE, { 'keepalive': true });
    // console.log(this.connection);
  }

  ngOnInit() {
  }
  // tslint:disable-next-line:one-line
  authUser(data: User) {
    return this.http.post(this.baseUrl, data)
      .pipe(
      tap(
        (response: any) => {
          if (response.STATUS === 1001) {
            this.login(response, data);
          } else {
            this.logout();
          }
          return response;
        },
        (error: any) => {
          return error;
        }
      ),
    );
  }

  isAuthenticated() {
    let data;
    if (localStorage.getItem('authorizationKey') || sessionStorage.getItem('authorizationKey')) {
      data = {
        'xAction': 'isAuthenticated',
        // tslint:disable-next-line:max-line-length
        'authorizationKey': localStorage.getItem('authorizationKey') ? localStorage.getItem('authorizationKey') : sessionStorage.getItem('authorizationKey')
      };

    }
    return this.http.post(this.baseUrl, data)
      .pipe(
      tap(
        (response: any) => {
          if (response.STATUS === 200) {
            return true;
          } else {
            this.router.navigate(['/login']);
          }
        },
        (error: any) => {
          return error;
        }
      ),
    );
  }

  // tslint:disable-next-line:one-line
  login(response: any, data: User) {
    localStorage.setItem('userID', response.RESULT.userID);
    localStorage.setItem('blueTiePin', response.RESULT.blueTiePin);
    if (data.remmemberMe) {
      localStorage.setItem('authorizationKey', response.RESULT.authorizationKey);
    } else {
      sessionStorage.setItem('authorizationKey', response.RESULT.authorizationKey);
    }
    return this.loggedIn = true;
  }

  /**
   * Logout the user
   */
  // tslint:disable-next-line:one-line
  logout() {
    localStorage.clear();
    this.loggedIn = false;
  }

  // tslint:disable-next-line:no-trailing-whitespace
  /**
   * To Validate the Existing Email
   * @param userEmail
   */
  checkIfEmailExist(userEmail: any[]) {
    const data = { 'xAction': 'checkIfEmailExist', 'userEmail': userEmail };
    return this.http.post(this.baseUrl, data)
      .pipe(
      tap(
        (response: any) => {
          return response;
        },
        (error: any) => {
          return error;
        }
      ),
      catchError(this.handleError('error', []))
      );
  }

  /**
   * To Validate the blueTiePin
   * @param blueTiePin
   */
  checkIfBTPinExist(blueTiePin: any[]) {
    // tslint:disable-next-line:max-line-length
    const data = 'https://www.bluetie.in/bluetie-cms/inc/BlueTie_Web_v.0.1.php?xAction=checkIfBTPinExist&userID=100&blueTiePin=' + blueTiePin;
    return this.http.get(data)
      .pipe(
      tap(
        (response: any) => {
          return response;
        },
        (error: any) => {
          return error;
        }
      ),
      catchError(this.handleError('error', []))
      )
      .shareReplay();
  }

  // tslint:disable-next-line:one-line
  userRegistration(data: User) {
    return this.http.post(this.baseUrl, data)
      .pipe(
      tap(
        (response: any) => {
          if (response.STATUS === 1001) {
            this.xmppUser = response.RESULT;
            this.xmppConnect();
          }
          return response;
        },
        (error: any) => {
          return error;
        }
      ), catchError(this.handleError('error', []))
      );
  }

  storeUserDetailFromSocialSite(userData) {
    const data = {
      xAction: 'storeUserDetails',
      userFirstName: userData.firstName,
      userLastName: userData.lastName,
      userEmail: userData.emailAddress
    };
    return this.http.post(this.baseWebUrl, data, httpOptions)
      .pipe(
      tap(
        (response: any) => {
          return response;
        },
        (error: any) => {
          return error;
        }
      ), catchError(this.handleError('error', []))
      );
  }

  /**
   * xmpp Connection start
   */
  xmppConnect() {
    this.connection.register.connect('gains.bluetie.in', this.xmppRegistration.bind(this), 60, 1);
  }
  xmppRegistration(status) {
    if (status === Strophe.Status.REGISTER) {
      this.connection.register.fields.name = this.xmppUser.userFirstName + ' ' + this.xmppUser.userLastName;
      this.connection.register.fields.username = this.xmppUser.userID;
      this.connection.register.fields.password = this.xmppUser.userID;
      this.connection.register.submit();
    } else if (status === Strophe.Status.REGISTERED) {
      this.connection.authenticate();
    } else if (status === Strophe.Status.CONNECTED) {
    }
  }

  getBaseCityDetails() {
    const urlQuery = 'https://www.bluetie.in/bluetie-cms/inc/BlueTie_Web_v.0.1.php?xAction=getBaseCityDetails';
    return this.http.get(urlQuery)
      .pipe(
      map((response: any) => {
        if (response.STATUS === 1001) {
          return response.RESULT;
        }
      })
      );
  }

  getDesignations() {
    return this.http.get(this.baseWebUrl + '?xAction=getDesignations')
      .pipe(
      map((response: any) => {
        if (response.STATUS === 1001) {
          return response.RESULT;
        }
      })
      );
  }

  /**
   * Get Skill Sets
   */
  getSkillSets() {
    const data = { 'xAction': 'getSkillSets' };
    return this.http.get(this.baseWebUrl + '?xAction=getSkillSets')
      .map((response: any) => {
        if (response.STATUS === 1001) {
          sessionStorage.setItem('SkillSet', JSON.stringify(response.RESULT.industryList));
          return response.RESULT;
        } else {
          return false;
        }
      })
      .shareReplay();
  }
  getIndustryList() {
    const data = { 'xAction': 'getIndustryList' };
    return this.http.get(this.baseWebUrl + '?xAction=getIndustryList')
      .map((response: any) => {
        if (response.STATUS === 1001) {
          sessionStorage.setItem('industryList', JSON.stringify(response.RESULT));
          return response.RESULT;
        } else {
          return false;
        }
      })
      .shareReplay();
  }

  createNewBtPin(bTpin) {
    const data = {
      'xAction': 'createnewBtPin',
      'userID': sessionStorage.getItem('userID'),
      'blueTiePin': bTpin.blueTiePin
    };
    return this.http.post(this.baseWebUrl, data).map(
      response => {
        return response;
      }
    );
  }
  saveUserDetails(userData) {
    const userid = sessionStorage.getItem('userID');
    const data = {
      'xAction': 'userRegistrationForm1',
      'userID': userid,
      'cityName': userData.basecity,
      'userFirstName': userData.userFirstName,
      'userLastName': userData.userLastName,
      'userDOB': userData.userDOB,
      'userGender': userData.userGender
    };
    return this.http.post(this.baseWebUrl, data).map(
      response => {
        return response;
      }
    );
  }

  getObjective() {
    const data = { 'xAction': 'getUserObjectives' };
    return this.http.get(this.baseWebUrl + '?xAction=getUserObjectives')
      .map((response: any) => {
        if (response.STATUS === 1001) {
          return response.RESULT;
        } else {
          return false;
        }
      })
      .shareReplay();
  }
  // get UserCount
  countUser() {
    const data = { 'xAction': 'countUser' };
    return this.http.get(this.baseWebUrl + '?xAction=countUser')
      .map((response: any) => {
        if (response.STATUS === 1001) {
          return response.RESULT;
        } else {
          return false;
        }
      }
      );
  }


  // save OBJECTIVE
  saveObjective(objectives) {
    const userid = sessionStorage.getItem('userID');
    const data = { 'xAction': 'saveUserObjectives', 'userID': userid, 'userObjectives': objectives };
    return this.http.post(this.baseWebUrl, data).map(
      (response) => {
        return response;
      }
    );

  }
  // save SKILLS
  saveSkills(skillSets) {
    const userid = sessionStorage.getItem('userID');
    const data = { 'xAction': 'saveUserSkills', 'userID': userid, 'skillSets': skillSets };
    return this.http.post(this.baseWebUrl, data).map(
      (response) => {
        return response;
      }
    );
  }
  // save mentor and email address
  saveEmailaddressM(emailaddress) {
    const mentordata = sessionStorage.getItem('mentor');
    const preobj = sessionStorage.getItem('explore');
    console.log(emailaddress);
    const data = {
      'xAction': 'preLaunch',
      'preObjective': preobj,
      'email': emailaddress,
      'mentor': mentordata
    };
    return this.http.post(' https://www.bluetie.in/bluetie-prod/inc/BlueTie_Web_v.0.1.php', data).map(
      (response) => {
        console.log(response);
      }
    );
  }
  preLaunchObjectiveUsers() {
    return this.http.get(this.baseWebUrl + '?xAction=totalPreLaunchUserObjective')
      .map(
      (response: any) => {
        if (response.STATUS === 1001) {
          return response.RESULT;
        } else {
          return response;
        }
      }
      );
  }
  skillByIndustryName(industry) {
    return this.http.get(this.baseWebUrl + '?xAction=skillByIndustryName&industry=' + industry)
      .pipe(
      map(
        (response: any) => {
          if (response.STATUS === 1001) {
            return response.RESULT;
          }
        }
      )
      );
  }

  serarchBySkills() {
    const data = {
      'xAction': 'getSearch',
      'searchType': 'bySkills',
      'searchByValue': 'Marketing Strategy',
      'searchByUserID': '10',
      'pageCount': '0',
      'isDefault': 'yes'
    };
    return this.http.post('https://www.bluetieglobal.com/bluetie-prod/inc/BlueTieAPI_v.1.7.php', data).map(
      (response: any) => {
        console.log(response.RESULT);
        return response.RESULT;
      }
    );
  }



  // ADMIN PANEL
  adminUserLogin(userdata) {
    const data = {
      'userNameOrEmail': userdata.userName,
      'userPass': userdata.passWord
    };
    return this.http.post(this.adminBaseWebUrl + '/login', data).pipe(
      tap(
        (response: any) => {
          if (response.STATUS === 1001) {
            return response;

          } else {
          }
          return response;
        },
        (error: any) => {
          return error;
        }
      ),
    );
  }

  allUsersData() {
    return this.http.get(this.adminBaseWebUrl + '/getTotalUserCount').pipe(
      tap(
        (response: any) => {
          // tslint:disable-next-line:prefer-const

          if (response.STATUS === 1001) {
            this.sendResInArr.push(response.RESULT.androidUserCount);
            this.sendResInArr.push(response.RESULT.iOSUserCount);
            // this.sendResInArr.push(response.RESULT.totalUserCount);
            return this.sendResInArr;
          } else {
            return response;
          }
        },
        (error: any) => {
          return error;
        }
      ),
    );
  }
  allCompletedUsersData() {
    return this.http.post(this.adminBaseWebUrl + '/getFullyRegistedUserCount', 'device-type').pipe(
      tap(
        (response: any) => {
          if (response.STATUS === 1001) {
            this.sendResInArr.push(response.RESULT.androidUserCount);
            this.sendResInArr.push(response.RESULT.iOSUserCount);
            console.log(this.sendResInArr);
            return this.sendResInArr;
          } else {
            return response;
          }
        },
        (error: any) => {
          return error;
        }
      ),
    );
  }
  getPartialRegistedUserCount() {
    return this.http.post(this.adminBaseWebUrl + '/getPartialRegistedUserCount', 'device-type').pipe(
      tap(
        (response: any) => {
          if (response.STATUS === 1001) {
            this.sendResInArr.push(response.RESULT.androidUserCount);
            this.sendResInArr.push(response.RESULT.iOSUserCount);
            console.log(this.sendResInArr);
            return this.sendResInArr;
          } else {
            return response;
          }
        },
        (error: any) => {
          return error;
        }
      ),
    );
  }
  getDeletedUserCount() {
    return this.http.post(this.adminBaseWebUrl + '/getDeletedUserCount', 'device-type').pipe(
      tap(
        (response: any) => {
          if (response.STATUS === 1001) {
            this.sendResInArr.push(response.RESULT.androidUserCount);
            this.sendResInArr.push(response.RESULT.iOSUserCount);
            console.log(this.sendResInArr);
            return this.sendResInArr;
          } else {
            return response;
          }
        },
        (error: any) => {
          return error;
        }
      ),
    );
  }
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
