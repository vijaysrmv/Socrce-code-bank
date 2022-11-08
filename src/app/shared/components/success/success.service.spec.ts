import { TestBed, inject } from '@angular/core/testing';

import { SuccessService } from './success.service';

describe('SuccessService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SuccessService]
		});
	});

	it('should be created', inject([SuccessService], (service: SuccessService) => {
		expect(service).toBeTruthy();
	}));

});
