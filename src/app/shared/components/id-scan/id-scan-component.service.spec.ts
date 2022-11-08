import { TestBed, inject } from '@angular/core/testing';

import { IdScanComponentService } from './id-scan-component.service';

describe('IdScanComponentService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [IdScanComponentService]
		});
	});

	it('should be created', inject([IdScanComponentService], (service: IdScanComponentService) => {
		expect(service).toBeTruthy();
	}));
});
