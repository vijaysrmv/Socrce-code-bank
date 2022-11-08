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

import { SessionService } from './session.service';

describe('SessionService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SessionService]
		});
	});

	it('should be created', inject([SessionService], (service: SessionService) => {
		expect(service).toBeTruthy();
	}));
});
