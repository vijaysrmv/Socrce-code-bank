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

import { UspsService } from './usps.service';

describe('UspsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [UspsService]
		});
	});

	it('should be created', inject([UspsService], (service: UspsService) => {
		expect(service).toBeTruthy();
	}));
});
