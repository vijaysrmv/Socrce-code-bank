import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DueDiligenceQuestionnaireComponent } from './due-diligence-questionnaire.component';

describe('DueDiligenceQuestionnaireComponent', () => {
  let component: DueDiligenceQuestionnaireComponent;
  let fixture: ComponentFixture<DueDiligenceQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DueDiligenceQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DueDiligenceQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
