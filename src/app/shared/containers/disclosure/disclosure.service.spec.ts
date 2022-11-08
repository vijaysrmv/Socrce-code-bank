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

import { DisclosureService } from './disclosure.service';

describe('DisclosureService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DisclosureService]
		});
	});

	it('should be created', inject([DisclosureService], (service: DisclosureService) => {
		expect(service).toBeTruthy();
	}));

});
