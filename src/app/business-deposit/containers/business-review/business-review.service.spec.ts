import { TestBed, inject } from '@angular/core/testing';

import { BusinessReviewService } from './business-review.service';

describe('BusinessReviewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessReviewService]
    });
  });

  it('should be created', inject([BusinessReviewService], (service: BusinessReviewService) => {
    expect(service).toBeTruthy();
  }));
});
