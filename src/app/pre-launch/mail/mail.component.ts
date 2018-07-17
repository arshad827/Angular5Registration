import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BtAuthService } from '../../bt-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {
  emailformGroup: FormGroup;
  constructor(private router: Router, private btservice: BtAuthService) { }
  btnDisable = true;
  ngOnInit() {
    this.emailformGroup = new FormGroup({
      emailaddress: new FormControl('', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),
      Validators.required], this.validateemail.bind(this))
    });
  }
  storeValues(data) {
    this.btservice.saveEmailaddressM(data.emailaddress).subscribe(
      (response) => {
        this.router.navigate(['/confirmation']);
      }
    );
  }
  validateemail() {
    const promise = new Promise<any>((resolve, reject) => {
      this.btnDisable = false;
      resolve();
    });
    return promise;
  }
}
