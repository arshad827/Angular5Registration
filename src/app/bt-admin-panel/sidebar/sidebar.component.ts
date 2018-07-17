import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { ContentComponent } from '../content/content.component';
import { SharingDataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  @Input() passedValue: Boolean;
  adminDisplayName;
  adminDisplayShortname;
  firstShortName;
  secondShortName;
  fSn;
  sSn;
  fullshortname;
  constructor(private router: Router) { }

  ngOnInit() {

    this.adminDisplayName = sessionStorage.getItem('AdminuserData');
    const matches = this.adminDisplayName.match(/\b(\w)/g);
    this.fullshortname = matches.join('');
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
