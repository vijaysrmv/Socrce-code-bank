/*------------------------------------------------------------------------------------------------------
NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Consumer OAO
File Name              :        personal-deposit.service.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        25/01/2019
Description            :        service to lookafter personal deposit module related actions
-------------------------------------------------------------------------------------------------------
CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/


import { MdmService } from './../../core/apis/mdm.service';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable ,  of } from 'rxjs';

import { OaoService } from '../../core/apis/oao.service';

import { ApplicationDetails, TyfoneDetails } from '../../core/models/application.model';
import { ACCOUNT_TYPE } from '../../core/models/enums';
import { Response } from '../../core/models/response';


@Injectable()
export class BusinessDepositService {

	constructor(
		private oaoservice: OaoService,
		private location: Location,
		private mdmservice: MdmService
	) { }

	submitContactForm(contactdetails): Observable<any> {
		return this.oaoservice.submitContactForm(contactdetails);
	}

	getAccount() {
		return ACCOUNT_TYPE[this.location.path().split('/')[1]];
	}

	createApplication(applicationData: ApplicationDetails): Observable<any> {
		applicationData.applicationtype = this.getAccount();
		return this.oaoservice.createApplication(applicationData).pipe(map(response => response));
	}

	saveDetailsOnBack(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = this.getAccount();
		applicationData.updateuistate = false;
		return this.oaoservice.saveDetailsOnBack(arn, applicationData).pipe(map(response => response));
	}

	checkUniqueness(applicationData: ApplicationDetails): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		applicationData.arn = arn;
		applicationData.applicationtype = this.getAccount();
		// applicationData.updateuistate = false;
		return this.oaoservice.checkUniqueness(arn, applicationData).pipe(map(response => response.body));
	}

	saveDetails(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = this.getAccount();
		return this.oaoservice.saveDetails(arn, applicationData).pipe(map(response => response));
	}

	continueDetails(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = this.getAccount();
		// if (!applicationData.hasOwnProperty('updateuistate')) {
		//   applicationData.updateuistate = true;
		// }
		return this.oaoservice.continueDetails(arn, applicationData).pipe(map(response => response));
	}

	getConsumerData(): Observable<ApplicationDetails> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return new Observable((observer) => {
				this.oaoservice.getConsumerData(arn).subscribe((data: ApplicationDetails) => {
					if (data.products) {
						sessionStorage.setItem('productIdList', JSON.stringify(data.products));
					}
					if (data.businessdetails) {
						const eligibilityQuestions = { 'ownershipstructure': data.businessdetails.ownershipstructure, 'restrictedcategories': data.businessdetails.restrictedcategories };
						if (!sessionStorage.getItem('eligibilityQuestions')) {
							sessionStorage.setItem('eligibilityQuestions', JSON.stringify(eligibilityQuestions));
						}
					}
					return observer.next(data);
				});
			});
		}
	}

	deleteApplicant(reqData): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		reqData.arn = arn;
		return this.oaoservice.deleteApplicant(arn, reqData).pipe(map(response => response));
	}

	// createOlbApplication(reqData: TyfoneDetails) {
	// 	return this.oaoservice.createOlbApplication(reqData).map(response => response);
	// }

	// generateHashCode(personaldetails: any): Observable<any> {
	// 	return this.oaoservice.generateHashCode(personaldetails);
	// }

	// getDatafromHashCode(personaldetails: any): Observable<any> {
	// 	return this.oaoservice.getDatafromHashCode(personaldetails);
	// }

	getNextState(arn: string): Observable<any> {
		return this.oaoservice.getNextUIState(arn);
	}

	setAdditionalOptions(reqObj): Observable<any> {
		reqObj.applicationtype = this.getAccount();
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.setAdditionalOptions(arn, reqObj).pipe(map(response => response));
		}
		return of([]);
	}

	// processReview(arn): Observable<any> {
	// 	return this.oaoservice.reviewContinue(arn).map(response => response);
	// }

	reviewContinue(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.reviewContinue(arn).pipe(map(response => response));
		}
		return of([]);
	}

	idaQuestion(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.idaQuestion(arn).pipe(map(response => response));
		}
		return of([]);
	}

	idaAnswerView(reqData: any): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		reqData.applicationtype = this.getAccount();
		reqData.arn = arn;
		if (arn) {
			return this.oaoservice.idaAnswerView(arn, reqData).pipe(map(response => response));
		}
		return of([]);
	}

	getZipData(zipcode: string): Observable<any> {
		return this.mdmservice.getZipData(zipcode).pipe(map(response => response));
	}

}
