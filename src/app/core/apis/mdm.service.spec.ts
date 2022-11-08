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

import { MockBackendService } from '../../mock/backend-service/backendService.mock';
import { TestBed, inject } from '@angular/core/testing';

import { MdmService } from './mdm.service';
import { BackendService } from '../backend/backend.service';

import { PhoneType } from '../models/fields-value.model';

describe('MdmService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				MdmService,
				{
					provide: BackendService,
					useClass: MockBackendService
				}
			]
		});
		this.service = TestBed.get(MdmService);
		this.backend = TestBed.get(BackendService);
	});

	it('should be created', (): any => {
		expect(this.service).toBeTruthy();
	});

	describe('Method getPhoneType()', () => {
		it('should return phone types', (): any => {
			this.service.getPhoneTypes().subscribe((data) => {
				expect(data[0].hasOwnProperty('phonetypeid')).toBe(true);
				expect(data[0].hasOwnProperty('description')).toBe(true);
			});
		});
	});

	describe('Method getProducts()', () => {
		it('should return all products', (): any => {
			this.service.getProducts().subscribe((data) => {
				expect(data[0].hasOwnProperty('accounttypeid')).toBe(true);
				expect(data[0].hasOwnProperty('productname')).toBe(true);
			});
		});
	});

	describe('Method getProductsById()', () => {
		it('should return products by Id', (): any => {
			this.service.getProductsById(['056', '060']).subscribe((data) => {
				expect(data.length).toBe(2);
				expect(data[0].productID).toBe('056');
				expect(data[1].productID).toBe('060');
			});
		});
	});

	describe('Method getBusinessCategory()', () => {
		it('should return business categories', (): any => {
			this.service.getBusinessCategory().subscribe((data) => {
				expect(data[0].hasOwnProperty('category')).toBe(true);
			});
		});
	});

});
