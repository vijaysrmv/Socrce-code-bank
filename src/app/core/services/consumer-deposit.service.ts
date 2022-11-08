/*------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Consumer OAO
File Name              :        consumer-deposit.service.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        25/01/2019
Description            :        service to lookafter consumer deposit module related actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { OaoService } from '../apis/oao.service';

import { ApplicationDetails } from '../models/application.model';
import { ACCOUNT_TYPE } from '../models/enums';
import { Response } from '../models/response';

const accountType = ACCOUNT_TYPE['consumer-deposit'];

@Injectable()
export class ConsumerDepositService {

	constructor(
		private oaoservice: OaoService
	) { }

	checkUniqueness(applicationData: ApplicationDetails): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		applicationData.arn = arn;
		applicationData.applicationtype = accountType;
		applicationData.updateuistate = false;
		return this.oaoservice.checkUniqueness(arn, applicationData).pipe(map(response => response));
	}

	continueDetails(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = accountType;
		if (!applicationData.hasOwnProperty('updateuistate')) {
			applicationData.updateuistate = true;
		}
		return this.oaoservice.continueDetails(arn, applicationData).pipe(map(response => response));
	}

	saveDetails(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = accountType;
		applicationData.updateuistate = false;
		return this.oaoservice.saveDetails(arn, applicationData).pipe(map(response => response));
	}

}
