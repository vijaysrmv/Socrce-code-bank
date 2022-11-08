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

import { ResponsibleDetailsService } from './responsible-details.service';

describe('PersonalDetailsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ResponsibleDetailsService]
		});
	});

	it('should be created', inject([ResponsibleDetailsService], (service: ResponsibleDetailsService) => {
		expect(service).toBeTruthy();
	}));
});
