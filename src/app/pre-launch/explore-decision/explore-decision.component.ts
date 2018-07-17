import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AngualrMaterialModule } from '../../angualr-material/angualr-material.module';
import { BtAuthService } from '../../bt-auth.service';
@Component({
  selector: 'app-explore-decision',
  templateUrl: './explore-decision.component.html',
  styleUrls: ['./explore-decision.component.css']
})
export class ExploreDecisionComponent implements OnInit {
  constructor(private btauthuser: BtAuthService) {
    this.searchUser();
  }
  appTesting;
  seedFunnding;
  mentorship;
  explore;
  isClicked = false;
  var1 = [];

  ngOnInit() {
    this.getTheExploreCount();
  }
  setExplorevalue(data) {
    sessionStorage.setItem('explore', data);
    this.isClicked = true;

  }
  getExplorevalue(data) {
    sessionStorage.setItem('explore', data);

  }
  getTheExploreCount() {
    this.btauthuser.preLaunchObjectiveUsers()
      .subscribe(
      (result) => {
        this.appTesting = result.appTestingUser;
        this.seedFunnding = result.seedFundingUser;
        this.mentorship = result.mentorshipUser;
        this.explore = result.exploreUser;
        return;
      }
      );
  }
  searchUser() {
    this.btauthuser.serarchBySkills().subscribe(
      (response) => {
        for (let i = 0; i <= response.length; i++) {
          this.var1[i] = response[i];
          console.log(this.var1[i]);
        }
        return this.var1;
      }
    );
  }
}
