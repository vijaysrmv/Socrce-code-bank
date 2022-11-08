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


import {map} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from '../backend/backend.service';

import { ZipDetails } from '../models/usps-response.model';
import { AppConfig } from '../../app.config';


@Injectable()
export class UspsService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY + 'application/usps/';

	constructor(@Inject(BackendService) private _backend: BackendService) { }

	zipLookup(zip: string): Observable<ZipDetails> {
		return this._backend.backendRequest(this.API + 'address/lookup', 'post', { zip5: zip }).pipe(map(data => data.body['zipcode']));
	}

	standardizeAddress(address2: string, zip5: string): Observable<string> {
		const request = {
			address2,
			zip5
		};
		return this._backend.backendRequest(this.API + 'verify/address', 'post', request).pipe(map(data => {
			const address = data.body['address'] ? data.body['address'].address2 : '';
			let response = '';
			if (address !== null && address !== undefined && address !== '') {
				response = address;
			}
			return response;
		}));
	}

}
