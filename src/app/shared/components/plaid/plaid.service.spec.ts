import { TestBed, inject } from '@angular/core/testing';

import { PlaidService } from './plaid.service';

describe('PlaidService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PlaidService]
		});
	});

	it('should be created', inject([PlaidService], (service: PlaidService) => {
		expect(service).toBeTruthy();
	}));
});
