import { TestBed, inject } from '@angular/core/testing';

import { BusinessDepositService } from './business-deposit.service';

describe('BusinessDepositService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessDepositService]
    });
  });

  it('should be created', inject([BusinessDepositService], (service: BusinessDepositService) => {
    expect(service).toBeTruthy();
  }));
});
