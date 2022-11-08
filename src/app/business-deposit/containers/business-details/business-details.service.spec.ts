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

import { BusinessDetailsService } from './business-details.service';

describe('BusinessDetailsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [BusinessDetailsService]
		});
	});

	it('should be created', inject([BusinessDetailsService], (service: BusinessDetailsService) => {
		expect(service).toBeTruthy();
	}));
});
