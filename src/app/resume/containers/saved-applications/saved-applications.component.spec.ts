import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedApplicationsComponent } from './saved-applications.component';

describe('SavedApplicationsComponent', () => {
  let component: SavedApplicationsComponent;
  let fixture: ComponentFixture<SavedApplicationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedApplicationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
