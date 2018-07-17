import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthService } from '../auth.service';
import { BtAuthService } from '../bt-auth.service';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
declare var Strophe: any;
declare var messageCarbons: any;
declare var CarbonMessage: any;
declare var roster: any;
declare var $pres: any;
declare var $msg: any;
declare var mam: any;
declare var RSM: any;
declare var certfile: any;
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  // BOSH_SERVICE = 'http://184.171.169.226:7070/http-bind/';
  // BOSH_SERVICE = 'http://gains.bluetie.in:7070/http-bind/';
  // BOSH_SERVICE = 'https://gains.bluetie.in:7443/http-bind/';
  BOSH_SERVICE = '//gains.bluetie.in:7443/http-bind/';
  // BOSH_SERVICE = 'https://184.171.169.226/http-bind/';
  // BOSH_SERVICE = 'http://localhost:7443/http-bind/';
  // BOSH_SERVICE = 'http://localhost:7070/http-bind/';
  connection;
  chatForm: FormGroup;
  messageReceived: any;
  multiTabID: any = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  // tslint:disable-next-line:radix
  from;
  to;

  constructor(private router: Router, private btAuthService: BtAuthService, private chatService: ChatService) { }

  ngOnInit() {
    // Not good I think Instead use event emitter
    // this.chatService.ngOnInit();
    // tslint:disable-next-line:radix
    this.from = parseInt(localStorage.getItem('userID'));
    this.to = this.from === 1000942 ? 1000947 : 1000942;
    this.connection = new Strophe.Connection(this.BOSH_SERVICE);
    // this.connection.connect(
    //   localStorage.getItem('userID') + '@gains.bluetie.in/' + this.multiTabID,
    //   localStorage.getItem('userID'),
    //   this.onConnect.bind(this)
    // );
    this.connection.connect(
      'amantest@gains.bluetie.in/' + this.multiTabID,
      'amantest',
      this.onConnect.bind(this)
    );
    this.connection.addHandler(this.onMessage.bind(this), null, 'message');
    this.chatForm = new FormGroup({
      message: new FormControl('', Validators.required)
    });

  }

  /**
   * xmpp chat connect
   * @param status
   */
  onConnect(status) {
    console.log(status);
    console.log(Strophe.Status);

    if (status === Strophe.Status.CONNECTING) {
      console.log('Strophe is connecting.');
    } else if (status === Strophe.Status.CONNFAIL) {
      console.log('Strophe failed to connect.');
      // $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.DISCONNECTING) {
      console.log('Strophe is disconnecting.');
    } else if (status === Strophe.Status.DISCONNECTED) {
      console.log('Strophe is disconnected.');
      // $('#connect').get(0).value = 'connect';
    } else if (status === Strophe.Status.CONNECTED) {
      this.connection.send($pres());
      this.connection.messageCarbons.enable();
      console.log('Strophe is connected. ', this.connection);
      // connection.disconnect();
    }
  }

  /**
   * On Message Received
   * @param c
   */
  onMessage(c) {
    try {
      // console.log('Message Received');
      // console.log(c);
      // console.log(c.tagName);
      // console.log(c.attributes);
      // console.log(typeof c.getAttribute('to'));
      // console.log(c.textContent);
      if (c.getAttribute('to') === this.from + '@gains.bluetie.in') {

        this.messageReceived = c.textContent;
      }
    } catch (error) {

    }

    return true;
  }
  /**
   * Send Message
   * @param usermsg
   */
  sendMeaage(usermsg) {
    this.chatService.connection.send($msg({
      type: 'chat',
      to: this.to + '@gains.bluetie.in',
      id: this.chatService.connection.getUniqueId()
    })
      .c('body')
      .t(usermsg.message));
    // this.connection.send($msg({
    //   type: 'chat',
    //   to: this.to + '@gains.bluetie.in',
    //   id: this.connection.getUniqueId()
    // })
    //   .c('body')
    //   .t(usermsg.message));

  }

  Online() {

    // this.connection.send($pres().c('show').t('chat'));
    this.connection.send($pres());
    // this.connection.send($pres().c('show').t('xa'));
    // this.connection.send($pres().c('show').t('dnd'));
    // this.connection.send(this.presense.tree());
  }
  Away() {

    // this.connection.send($pres().c('show').t('chat'));
    this.connection.send($pres().c('show').t('away'));
    // this.connection.send($pres().c('show').t('xa'));
    // this.connection.send($pres().c('show').t('dnd'));
    // this.connection.send(this.presense.tree());
  }
}
