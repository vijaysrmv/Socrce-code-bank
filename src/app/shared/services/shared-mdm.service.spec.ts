import { TestBed, inject } from '@angular/core/testing';

import { SharedMdmService } from './shared-mdm.service';

describe('SharedMdmService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedMdmService]
    });
  });

  it('should be created', inject([SharedMdmService], (service: SharedMdmService) => {
    expect(service).toBeTruthy();
  }));
});
