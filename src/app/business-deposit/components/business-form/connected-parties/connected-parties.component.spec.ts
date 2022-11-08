import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedPartiesComponent } from './connected-parties.component';

describe('ConnectedPartiesComponent', () => {
  let component: ConnectedPartiesComponent;
  let fixture: ComponentFixture<ConnectedPartiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectedPartiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedPartiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
