import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCompanyDetailsComponent } from './group-company-details.component';

describe('GroupCompanyDetailsComponent', () => {
  let component: GroupCompanyDetailsComponent;
  let fixture: ComponentFixture<GroupCompanyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCompanyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCompanyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
