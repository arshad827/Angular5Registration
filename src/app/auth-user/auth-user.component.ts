import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';

// import { AuthService } from '../auth.service';
import { BtAuthService } from '../bt-auth.service';
import { User } from '../model/users';
import { UserDetailsService } from '../services/user-details.service';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css']
})
export class AuthUserComponent implements OnInit {
  /**
   * Coding Done By Aman Kumar
   */
  hide = true;
  userRegistrationForm: FormGroup;
  userLoginForm: FormGroup;
  btnDisable = false;
  fileToUpload: File = null;

  baseCity;

  test: FormGroup;
  @ViewChild('key1') private key1: ElementRef;
  @ViewChild('key2') private key2: ElementRef;
  @ViewChild('key3') private key3: ElementRef;
  @ViewChild('key4') private key4: ElementRef;
  key: number;
  constructor(private router: Router, private btAuthService: BtAuthService, private userDetailsService: UserDetailsService) { }

  ngOnInit() {
    /**
     * Reactive Form For User Registration
     *
     * Coded By:- Aman Kumar
     */
    this.userRegistrationForm = new FormGroup({
      xAction: new FormControl('userRegistration'),
      userFirstName: new FormControl('', Validators.required),
      userLastName: new FormControl('', Validators.required),
      userEmail: new FormControl('', [Validators.required, Validators.email], this.checkIfEmailExist.bind(this)),
      blueTiePin: new FormControl('', [Validators.required], this.checkIfBTPinExist.bind(this)),
      userPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
      baseCity: new FormControl('', [Validators.required])
    });
    /**
     * Reactive Form For User Login
     *
     * Coded By:- Aman Kumar
     */
    this.userLoginForm = new FormGroup({
      xAction: new FormControl('userLogin'),
      userEmail: new FormControl('', [Validators.required, Validators.email]),
      userPass: new FormControl('', Validators.required),
      remmemberMe: new FormControl(false)
    });

    this.test = new FormGroup({
      key1: new FormControl('', Validators.required, this.callNextBox.bind(this)),
      key2: new FormControl('', Validators.required, this.callNextBox.bind(this)),
      key3: new FormControl('', Validators.required, this.callNextBox.bind(this)),
      key4: new FormControl('', Validators.required, this.callNextBox.bind(this))
    });

    // getBaseCityDetails
    if (sessionStorage.getItem('city')) {
      this.baseCity = JSON.parse(sessionStorage.getItem('city'));
    } else {
      this.btAuthService.getBaseCityDetails()
        .subscribe(
        (data) => {
          this.baseCity = data;
          console.log(this.baseCity);
          sessionStorage.setItem('city', JSON.stringify(this.baseCity));
        },
        (error) => {
          console.log(error);
        }
        );
    }

  }

  callNextBox(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      console.log(control);
      if (control.value !== null) {
        this.key2.nativeElement.focus();
      }
      resolve(control.value);
    });
    return promise;
  }

  /**
   * Async Validation Method To validate the Email ID
   * @param control
   * Coded By:- Aman Kumar
   */
  checkIfEmailExist(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.btAuthService.checkIfEmailExist(control.value).subscribe(
        (data) => {
          if (data.STATUS === 1001) {
            resolve(true);
          } else {
            resolve(control.value);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
    return promise;
  }
  /**
   * Async Validation Method To validate the Bluetie Pin
   * @param control
   * Coded By:- Aman Kumar
   */
  checkIfBTPinExist(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve, reject) => {
      this.btAuthService.checkIfBTPinExist(control.value).subscribe(
        (data) => {
          console.log('data', data);
          if (data.STATUS === 1001) {
            resolve(true);
          } else {
            resolve(control.value);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    });
    return promise;
  }

  /**
   * User Registration Submit Function
   * @param data // All the Form values are added in this variable
   * Coded By:- Aman Kumar
   */
  userRegForm(data) {
    this.btnDisable = true;
    this.btAuthService.userRegistration(data).subscribe(
      (response) => {
        console.log(response);
        this.btnDisable = false;
      }
    );
    // this.router.navigate(['/']);

  }

  /**
   * User Login Submit Function
   *
   * Coded By:- Aman Kumar
   */
  // tslint:disable-next-line:no-trailing-whitespace
  userAuth(data: User) {
    this.btnDisable = true;
    this.btAuthService.authUser(data).subscribe(
      (response) => {
        this.btnDisable = false;
        this.router.navigate(['/']);
        // if (this.btAuthService.loggedIn) {
        //   console.log(response, this.btAuthService.loggedIn);
        // }
        // return response;
      },
      (error) => {
        console.log(error);
        // return error;
      }
    );
    // return '200';
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.userDetailsService.postFile(this.fileToUpload)
      .subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
        // return error;
      }
      );
  }


}
