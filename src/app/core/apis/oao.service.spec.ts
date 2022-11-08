import { TestBed, inject } from '@angular/core/testing';

import { OaoService } from './oao.service';

describe('OaoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OaoService]
    });
  });

  it('should be created', inject([OaoService], (service: OaoService) => {
    expect(service).toBeTruthy();
  }));
});
