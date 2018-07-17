import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtAdminPanelComponent } from './bt-admin-panel.component';

describe('BtAdminPanelComponent', () => {
  let component: BtAdminPanelComponent;
  let fixture: ComponentFixture<BtAdminPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtAdminPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
