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

import { ConsumerStateGuard } from './consumer-state-guard.service';

describe('PersonalGuardService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ConsumerStateGuard]
		});
	});

	it('should be created', inject([ConsumerStateGuard], (service: ConsumerStateGuard) => {
		expect(service).toBeTruthy();
	}));

});
