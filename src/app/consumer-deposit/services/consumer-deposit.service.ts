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
import { Location } from '@angular/common';
import { Observable ,  of } from 'rxjs';

import { MdmService } from '../../core/apis/mdm.service';
import { OaoService } from '../../core/apis/oao.service';

import { ApplicationDetails, TyfoneDetails } from '../../core/models/application.model';
import { ACCOUNT_TYPE } from '../../core/models/enums';
import { Response } from '../../core/models/response';


@Injectable()
export class ConsumerDepositService {

	constructor(
		private mdmservice: MdmService,
		private oaoservice: OaoService,
		private location: Location
	) { }

	getZipData(zipcode: string): Observable<any> {
		return this.mdmservice.getZipData(zipcode).pipe(map(response => response));
	}

	getCDRateStructure(amount: number): Observable<any> {
		return this.oaoservice.getCDRateStructure(amount).pipe(map(response => response));
	}

	createApplication(applicationData: ApplicationDetails): Observable<any> {
		applicationData.applicationtype = this.getAccount();
		return this.oaoservice.createApplication(applicationData).pipe(map(response => response));
	}

	checkUniqueness(applicationData: ApplicationDetails): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		applicationData.arn = arn;
		applicationData.applicationtype = this.getAccount();
		// applicationData.updateuistate = false;
		if (arn) {
			return this.oaoservice.checkUniqueness(arn, applicationData).pipe(map(response => response.body));
		}
	}

	continueDetails(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = this.getAccount();
		// if (!applicationData.hasOwnProperty('updateuistate')) {
		//   applicationData.updateuistate = true;
		// }
		if (arn) {
			return this.oaoservice.continueDetails(arn, applicationData).pipe(map(response => response));
		}
	}

	saveDetails(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = this.getAccount();
		if (arn) {
			return this.oaoservice.saveDetails(arn, applicationData).pipe(map(response => response));
		}
	}

	saveDetailsOnBack(applicationData: ApplicationDetails): Observable<Response> {
		const arn = sessionStorage.getItem('arn');
		applicationData.applicationtype = this.getAccount();
		applicationData.updateuistate = false;
		if (arn) {
			return this.oaoservice.saveDetailsOnBack(arn, applicationData).pipe(map(response => response));
		}
	}

	deleteApplicant(reqData): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			reqData.arn = arn;
			return this.oaoservice.deleteApplicant(arn, reqData).pipe(map(response => response));
		}
		return of([]);
	}

	getConsumerDetails(): Observable<ApplicationDetails | any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.getConsumerData(arn).pipe(map(response => {
				if (response.products && !sessionStorage.getItem('productIdList')) {
					sessionStorage.setItem('productIdList', JSON.stringify(response.products));
				}
				if (response.personaldetails && response.personaldetails.address && response.personaldetails.address[0] && response.personaldetails.address[0].zipcode && !sessionStorage.getItem('zipcode')) {
					const zip = {
						'zip5': response.personaldetails.address[0].zipcode,
						'city': response.personaldetails.address[0].city,
						'state': response.personaldetails.address[0].state
					};
					sessionStorage.setItem('zipcode', JSON.stringify(zip));
				}
				return response;
			}));
		}
		return of([]);
	}

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
		if (arn) {
			return this.oaoservice.idaAnswerView(arn, reqData).pipe(map(response => response));
		}
		return of([]);
	}

	iRequest(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.iRequest(arn).pipe(map(response => response));
		}
		return of([]);
	}

	aRequest(reqData: any): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.aRequest(arn, reqData).pipe(map(response => response));
		}
		return of([]);
	}

	getAccount() {
		return ACCOUNT_TYPE[this.location.path().split('/')[1]];
	}

	getServicesOffered(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.getServicesOffered(arn).pipe(map(data => data));
		}
		return of([]);
	}

	saveServicesOffered(reqObj): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.saveServicesOffered(arn, reqObj).pipe(map(data => data));
		}
		return of([]);
	}

	getDisclosures(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.getDisclosures(arn).pipe(map(data => data));
		}
		return of([]);
	}

	getNextState(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.getNextUIState(arn).pipe(map(data => data));
		}
		return of([]);
	}

	setAdditionalOptions(reqObj): Observable<any> {
		reqObj.applicationtype = this.getAccount();
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.setAdditionalOptions(arn, reqObj).pipe(map(data => data));
		}
		return of([]);
	}

	// getProductsById(ids: Array<string>): Observable<Array<Product>> {
	//   const applicationtype = this.getAccount();
	//   return this.oaoservice.getProductsById(ids, applicationtype);
	// }

	getDocusignUrl() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.getDocusignUrl(arn).pipe(map(data => data));
		}
		return of([]);
	}

	// createOlbApplication(reqData: TyfoneDetails) {
	// 	return this.oaoservice.createOlbApplication(reqData).map(response => response);
	// }

	makeAchPayment(achData) {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.makeAchPayment(arn, achData).pipe(map(data => data));
		}
		return of([]);
	}

	makeInternalPayment(reqData) {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.makeInternalPayment(arn, reqData).pipe(map(data => data));
		}
		return of([]);
	}

	// getPaymentSessionToken(reqData: any) {
	// 	const arn = sessionStorage.getItem('arn');
	// 	if (arn) {
	// 		reqData['arn'] = arn;
	// 		return this.oaoservice.getPaymentSessionToken(arn, reqData).map(data => data);
	// 	}
	// 	return of([]);
	// }

	postFundingAction(reqData: any) {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			reqData['arn'] = arn;
			return this.oaoservice.postFundingAction(arn, reqData).pipe(map(data => data));
		}
		return of([]);
	}

	logout(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.logout(arn).pipe(map(resp => resp));
		}
	}

}
