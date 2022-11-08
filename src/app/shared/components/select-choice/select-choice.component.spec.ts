import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChoiceComponent } from './select-choice.component';

describe('SelectChoiceComponent', () => {
  let component: SelectChoiceComponent;
  let fixture: ComponentFixture<SelectChoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectChoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
