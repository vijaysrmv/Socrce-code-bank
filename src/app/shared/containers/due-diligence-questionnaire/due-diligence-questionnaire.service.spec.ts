import { TestBed, inject } from '@angular/core/testing';

import { DueDiligenceQuestionnaireService } from './due-diligence-questionnaire.service';

describe('DueDiligenceQuestionnaireService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DueDiligenceQuestionnaireService]
    });
  });

  it('should be created', inject([DueDiligenceQuestionnaireService], (service: DueDiligenceQuestionnaireService) => {
    expect(service).toBeTruthy();
  }));
});
