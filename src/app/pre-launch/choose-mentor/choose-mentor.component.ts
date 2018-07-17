import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AngualrMaterialModule } from '../../angualr-material/angualr-material.module';
import { BtAuthService } from '../../bt-auth.service';

declare var $: any;

@Component({
  selector: 'app-choose-mentor',
  templateUrl: './choose-mentor.component.html',
  styleUrls: ['./choose-mentor.component.css']
})
export class ChooseMentorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  getMentor(data) {
    sessionStorage.setItem('mentor', data);
  }
  mentorDetails(e, c) {
    e.stopPropagation();
    e.preventDefault();
    this.hideMentors();
    $('.' + c).show();
    $('.mentor_detail_row').addClass('animated slideInRight').show().removeClass('slideOutRight');
    $('.mentor_list').addClass('animated slideOutLeft').hide().removeClass('slideInLeft');
  }
  closeMentor() {
    $('.mentor_detail_row').removeClass('slideInRight').addClass('slideOutRight').hide();
    $('.mentor_list').removeClass('slideOutLeft').addClass('slideInLeft').show();
  }
  hideMentors() {
    $('.me-1').hide();
    $('.me-2').hide();
    $('.me-3').hide();
    $('.me-4').hide();
    $('.me-5').hide();
  }
}
