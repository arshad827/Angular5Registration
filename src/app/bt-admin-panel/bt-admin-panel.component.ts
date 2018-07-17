import { Component, OnInit } from '@angular/core';
import { trigger, state, style, } from '@angular/animations';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ContentComponent } from './content/content.component';
@Component({
  selector: 'app-bt-admin-panel',
  templateUrl: './bt-admin-panel.component.html',
  styleUrls: ['./bt-admin-panel.component.css'],
})
export class BtAdminPanelComponent implements OnInit {
  show2Clicked: boolean;
  data;
  constructor() { }

  ngOnInit() {
  }

  onSelect(recivedValue: boolean) {
    this.data = recivedValue;
  }
}
