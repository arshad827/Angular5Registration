import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BtAuthService } from '../bt-auth.service';
import {
  FormGroup,
  FormBuilder,
  FormsModule,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { UserDetailsService } from '../services/user-details.service';
import 'rxjs/add/operator/publishReplay';
import { User } from '../model/users';
import { SearchService } from './search.service';
import { startWith } from 'rxjs/operators/startWith';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  authUserDetails;
  skillsWithIndustry;
  defaultskillsWithIndustry;
  constructor(
    private router: Router,
    private btAuthService: BtAuthService,
    private userDetailsService: UserDetailsService,
    private searchService: SearchService
  ) { }

  ngOnInit() {
    // Both are Async call
    /**
     * Get the user profile
     */
    if (localStorage.getItem('profile')) {
      this.authUserDetails = JSON.parse(localStorage.getItem('profile'));
    } else {
      this.userDetailsService.getUserDetails(localStorage.getItem('userID'))
        .subscribe(
        (response: User) => {
          this.authUserDetails = response;
        },
        (error) => {
          console.log('error in search componentt ts', error);
        }
        );
    }

    // Or
    // For Async call in html
    // this.authUserDetails = this.userDetailsService.getUserDetails(localStorage.getItem('userID'));

    /**
     * Search Form
     */
    this.searchForm = new FormGroup({
      skillsWithIndustryControl: new FormControl()
    });
    this.searchForm.controls.skillsWithIndustryControl.valueChanges
      .subscribe(
      (val) => {
        this.filter(val);
      }
      );

    /**
     * Get Skill Set for search
     */
    if (sessionStorage.getItem('SkillSet')) {
      this.skillsWithIndustry = JSON.parse(sessionStorage.getItem('SkillSet'));
      console.log('object');
    } else {
      this.searchService.getSkillSets()
        .subscribe(
        (skills: any) => {
          this.skillsWithIndustry = skills.industryList.skill;
        },
        (error) => {
          console.log('error', error);
        }
        );
    }



  }
  filter(val) {
    this.defaultskillsWithIndustry = JSON.parse(sessionStorage.getItem('SkillSet'));
    for (const industrys of this.defaultskillsWithIndustry) {
      industrys.skill = industrys.skill.filter(skillsArray =>
        skillsArray.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    this.defaultskillsWithIndustry = this.defaultskillsWithIndustry.filter(nestedArray => nestedArray.skill.length !== 0);
    return this.skillsWithIndustry = this.defaultskillsWithIndustry;
  }

  // Call Logut Function
  logout() {
    this.btAuthService.logout();
    this.router.navigate(['/auth']);
  }

}
