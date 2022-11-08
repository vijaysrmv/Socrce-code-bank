import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TyfoneIntegrationComponent } from './tyfone-integration.component';

describe('TyfoneIntegrationComponent', () => {
  let component: TyfoneIntegrationComponent;
  let fixture: ComponentFixture<TyfoneIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TyfoneIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TyfoneIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
