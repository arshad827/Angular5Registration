import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtHeaderComponent } from './bt-header.component';

describe('BtHeaderComponent', () => {
  let component: BtHeaderComponent;
  let fixture: ComponentFixture<BtHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
