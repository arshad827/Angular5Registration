import { Component, OnInit } from '@angular/core';
import { ExploreDecisionComponent } from './explore-decision/explore-decision.component';
import { SocialLoginComponent } from './social-login/social-login.component';

@Component({
  selector: 'app-pre-launch',
  templateUrl: './pre-launch.component.html',
  styleUrls: ['./pre-launch.component.css']
})
export class PreLaunchComponent implements OnInit {
  displayBlock: false;
  constructor() { }

  ngOnInit() {
  }

}
