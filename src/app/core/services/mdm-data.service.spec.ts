import { TestBed, inject } from '@angular/core/testing';

import { MdmDataService } from './mdm-data.service';

describe('MdmDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MdmDataService]
    });
  });

  it('should be created', inject([MdmDataService], (service: MdmDataService) => {
    expect(service).toBeTruthy();
  }));
});
