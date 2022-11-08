import { TestBed, inject } from '@angular/core/testing';

import { ConsumerDepositService } from './consumer-deposit.service';

describe('ConsumerDepositService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ConsumerDepositService]
		});
	});

	it('should be created', inject([ConsumerDepositService], (service: ConsumerDepositService) => {
		expect(service).toBeTruthy();
	}));

});
