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

import { ProductsService } from './products.service';

describe('ProductsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ProductsService]
		});
	});

	it('should be created', inject([ProductsService], (service: ProductsService) => {
		expect(service).toBeTruthy();
	}));
});
