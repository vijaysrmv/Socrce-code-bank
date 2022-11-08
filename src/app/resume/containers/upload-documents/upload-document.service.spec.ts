import { TestBed, inject } from '@angular/core/testing';

import { UploadDocumentService } from './upload-document.service';

describe('UploadDocumentService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [UploadDocumentService]
		});
	});

	it('should be created', inject([UploadDocumentService], (service: UploadDocumentService) => {
		expect(service).toBeTruthy();
	}));
});
