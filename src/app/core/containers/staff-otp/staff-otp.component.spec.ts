import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffOtpComponent } from './staff-otp.component';

describe('StaffOtpComponent', () => {
  let component: StaffOtpComponent;
  let fixture: ComponentFixture<StaffOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
