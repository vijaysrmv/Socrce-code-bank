import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdScanComponent } from './id-scan.component';

describe('IdScanComponent', () => {
  let component: IdScanComponent;
  let fixture: ComponentFixture<IdScanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdScanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
