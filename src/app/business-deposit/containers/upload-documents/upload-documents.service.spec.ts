/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :
File Name              :
Author                 :
Date (DD/MM/YYYY)      :
Description            :
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { TestBed, inject } from '@angular/core/testing';

import { UploadDocumentService } from './upload-documents.service';

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
