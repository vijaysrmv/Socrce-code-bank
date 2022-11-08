import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsufficientFundsComponent } from './insufficient-funds.component';

describe('InsufficientFundsComponent', () => {
  let component: InsufficientFundsComponent;
  let fixture: ComponentFixture<InsufficientFundsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsufficientFundsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsufficientFundsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
