import { Injectable, OnInit } from '@angular/core';
declare var Strophe: any;
declare var messageCarbons: any;
declare var CarbonMessage: any;
declare var roster: any;
declare var $pres: any;
declare var $msg: any;
declare var mam: any;
declare var RSM: any;
@Injectable()
export class ChatService implements OnInit {
  // BOSH_SERVICE = 'http://184.171.169.226:7070/http-bind/';
  // BOSH_SERVICE = 'https://184.171.169.226:7443/http-bind/';
  // BOSH_SERVICE = 'http://gains.bluetie.in:7070/http-bind/';
  // BOSH_SERVICE = 'https://184.171.169.226/http-bind/';
  BOSH_SERVICE = 'https://gains.bluetie.in:7443/http-bind/';
  // BOSH_SERVICE = 'http://localhost:7070/http-bind/';
  // BOSH_SERVICE = 'http://localhost:7443/http-bind/';
  connection;
  messageReceived: any;
  multiTabID: any = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  constructor() { }
  from;
  to;
  ngOnInit() {
    // tslint:disable-next-line:radix
    this.from = parseInt(localStorage.getItem('userID'));
    this.to = this.from === 1000942 ? 1000947 : 1000942;
    this.connection = new Strophe.Connection(this.BOSH_SERVICE, { 'keepalive': true });
    // this.connection.connect(
    //   // localStorage.getItem('userID') + '@localhost/' + this.multiTabID,
    //   localStorage.getItem('userID') + '@gains.bluetie.in/' + this.multiTabID,
    //   // localStorage.getItem('userID') + '@gains.bluetie.in/' + this.multiTabID,
    //   localStorage.getItem('userID'),
    //   this.onConnect.bind(this)
    // );
    this.connection.connect(
      'amantest@gains.bluetie.in/' + this.multiTabID,
      'amantest',
      this.onConnect.bind(this)
    );
    this.connection.addHandler(this.onMessage.bind(this), null, 'message');
  }
  /**
   * xmpp chat connect
   * @param status
   */
  onConnect(status) {
    // console.log(status);
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
      console.log('Message Received', c.textContent);
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
}
