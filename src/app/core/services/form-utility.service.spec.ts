import { TestBed, inject } from '@angular/core/testing';

import { FormUtilityService } from './form-utility.service';

describe('FormUtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormUtilityService]
    });
  });

  it('should be created', inject([FormUtilityService], (service: FormUtilityService) => {
    expect(service).toBeTruthy();
  }));
});
