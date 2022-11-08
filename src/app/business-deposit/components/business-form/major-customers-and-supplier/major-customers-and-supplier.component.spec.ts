import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorCustomersAndSupplierComponent } from './major-customers-and-supplier.component';

describe('MajorCustomersAndSupplierComponent', () => {
  let component: MajorCustomersAndSupplierComponent;
  let fixture: ComponentFixture<MajorCustomersAndSupplierComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MajorCustomersAndSupplierComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MajorCustomersAndSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
