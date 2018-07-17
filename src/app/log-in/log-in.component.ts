import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BtAuthService } from '../bt-auth.service';
import { Router } from '@angular/router';
import { trigger, state, transition, style, animate } from '@angular/animations';
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css'],
  animations: [
    trigger('divState', [
      state('in', style({ 'opacity': '0', 'transform': 'translateX(0px)' })),
      transition('void => *', [style({ 'opacity': '1', 'transform': 'translateX(300px)' }), animate(300)])
    ]),
  ]
})
export class LogInComponent implements OnInit {
  in;
  hide = true;
  hide1 = true;
  state = 'in';
  loginform: FormGroup;
  @Output() displaynameEmitter = new EventEmitter<boolean>();
  constructor(private loginUser: BtAuthService, private router: Router) {

  }
  ngOnInit() {

    this.loginform = new FormGroup({
      userName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*$')], this.validateform.bind(this)),
      passWord: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*$')], this.validateform.bind(this))
    });
  }
  adminLogin(data) {
    this.loginUser.adminUserLogin(data).subscribe(
      (response) => {
        console.log(response.RESULT);
        if (response.STATUS === 1001) {
          sessionStorage.setItem('AdminuserData', response.RESULT.displayName);
          this.router.navigate(['/dashboard']);
        } else {
          this.hide1 = false;
          console.log(this.hide);
        }
      },
      (error) => {
        this.hide1 = false;
        console.log('error', error);
      }
    );
  }
  validateform(control: FormControl) {
    const promise = new Promise<any>((resolve, reject) => {
      this.hide1 = true;
      resolve();
    });
    return promise;
  }
}
