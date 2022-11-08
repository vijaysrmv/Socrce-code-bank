/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Core
File Name              :		id-scan.service.ts
Author                 :		Rajneesh Mishra
Date (DD/MM/YYYY)      :
Description            :		Service to handle idscan operations
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from '../backend/backend.service';
import { UtilityService } from '../utility/utility.service/utility.service';

import { AppConfig } from '../../app.config';
import { IdScanResponse } from '../models/id-scan.model';


@Injectable()
export class IdScanService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY + 'application/idscan/';

	constructor(
		@Inject(BackendService) private _backend: BackendService,
		@Inject(UtilityService) private _util: UtilityService
	) { }

	getDetailsFromIdScan(requestBody): Observable<IdScanResponse | null> {
		// return new Observable((observer) => {
		return this._backend.backendRequest(this.API + 'extract', 'post', requestBody).pipe(map((data: any) => {
			// if (data['body']['ParseImageResult'] === null || this.isDataInvalid(data['body']['ParseImageResult'])) {
			// 	observer.next(null);
			// }
			if (data && data.body && data.body.ParseImageResult && data.body.ParseImageResult.ValidationCode && data.body.ParseImageResult.ValidationCode.IsValid === false) {
				return null;
			}
			const idtype = data['body']['ParseImageResult']['idtype'];
			if (data['body']['ParseImageResult'].scanneddetails) {
				const result = data['body']['ParseImageResult']['scanneddetails'];
				const idScanResp = <IdScanResponse>{
					firstname: result.FirstName ? result.FirstName : '',
					lastname: result.LastName ? result.LastName : '',
					middlename: result.MiddleName ? result.MiddleName : '',
					suffix: result.NameSuffix ? result.NameSuffix : '',
					dob: result.Birthdate ? this._util.parseDate(result.Birthdate) : '',
					gender: result.Gender ? result.Gender : '',
					country: result.CountryCode ? result.CountryCode : ''
				};
				if (result.ExpirationDate && this._util.isValidExpiryDate(result.ExpirationDate)) {
					idScanResp.identification = {
						type: idtype === 'DriverLicense' ? 'DL' : (idtype === 'Passport' ? 'PS' : 'ST'),
						number: result.idNumber ? result.idNumber : '',
						issuedate: result.IssueDate ? this._util.parseDate(result.IssueDate) : '',
						expirydate: result.ExpirationDate ? this._util.parseDate(result.ExpirationDate) : '',
						issuestate: result.IssuedBy ? result.IssuedBy : ''
					};
				}
				idScanResp.physicaladdress = {
					aptorsuite: result.Address2 && result.Address2 !== 'NONE' ? result.Address2 : '',
					numberandstreet: result.Address1 ? result.Address1 : '',
					zipcode: result.PostalCode ? result.PostalCode.split('-')[0] : '',
					city: result.City ? result.City : '',
					state: result.JurisdictionCode ? result.JurisdictionCode : ''
				};
				// this._sanitize(idScanResp);
				// observer.next(idScanResp);
				return idScanResp;
			}
		}));
		// });
	}

	private _sanitize(input: any) {
		Object.keys(input).forEach((key) => {
			if (input[key] instanceof Object) {
				this._sanitize(input[key]);
			} else if (!input[key] || input[key] === '') {
				delete input[key];
			}
		});
	}

}
