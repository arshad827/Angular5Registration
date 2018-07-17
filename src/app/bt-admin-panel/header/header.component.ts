import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

})
export class HeaderComponent implements OnInit {
  bool = false;

  @Output() toggler = new EventEmitter<boolean>();
  constructor(private router: Router) { }
  ngOnInit() {
  }

  toggle() {
    this.bool = !this.bool;
    this.toggler.emit(this.bool);
  }
  logOut() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

}
