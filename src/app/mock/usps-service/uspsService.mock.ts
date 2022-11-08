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

import { Injectable, Inject } from '@angular/core';
import { respZipLookup, inCorrectZip } from './usps-responses/ziplook.response';
import { ZipDetails } from '../../core/models/usps-response.model';
import { Observable } from 'rxjs';
import { BackendService } from '../../core/backend/backend.service';
// export const mockUspsService = jasmine.createSpyObj('UspsService', ['zipLookup']);

// export const mockUspsService = jasmine.createSpyObj('BackendService', ['backendRequest']);


// export const zipLookupSpy = mockUspsService.zipLookup.and.callFake((zip: string) => {});

export class MockUspsService {
	zipLookup(zip: string): Observable<ZipDetails> {
		return new Observable((observer) => {
			if (zip === '02364') {
				observer.next(respZipLookup);
			} else {
				observer.next(inCorrectZip);
			}
		});
		// return (respZipLookup);
	}
}
