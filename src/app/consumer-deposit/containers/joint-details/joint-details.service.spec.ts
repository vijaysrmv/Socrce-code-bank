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

import { JointDetailsService } from './joint-details.service';

describe('JointDetailsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [JointDetailsService]
		});
	});

	it('should be created', inject([JointDetailsService], (service: JointDetailsService) => {
		expect(service).toBeTruthy();
	}));

});
