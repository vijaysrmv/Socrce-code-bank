import { TestBed, inject } from '@angular/core/testing';

import { ReviewApproveService } from './review-approve.service';

describe('ReviewApproveService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ReviewApproveService]
		});
	});

	it('should be created', inject([ReviewApproveService], (service: ReviewApproveService) => {
		expect(service).toBeTruthy();
	}));
});
