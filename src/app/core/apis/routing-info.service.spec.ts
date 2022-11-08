import { TestBed, inject } from '@angular/core/testing';

import { RoutingInfoService } from './routing-info.service';

describe('RoutingInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RoutingInfoService]
    });
  });

  it('should be created', inject([RoutingInfoService], (service: RoutingInfoService) => {
    expect(service).toBeTruthy();
  }));
});
