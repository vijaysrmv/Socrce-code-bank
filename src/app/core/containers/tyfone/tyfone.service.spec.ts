import { TestBed, inject } from '@angular/core/testing';

import { TyfoneService } from './tyfone.service';

describe('TyfoneService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TyfoneService]
    });
  });

  it('should be created', inject([TyfoneService], (service: TyfoneService) => {
    expect(service).toBeTruthy();
  }));
});
