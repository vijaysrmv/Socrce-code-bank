/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen OAO
Application            : 	    Newgen OAO
Module                 :	    Business OAO
File Name              : 	    business-review.service.ts
Author                 : 	    Amir Masood
Date (DD/MM/YYYY)      : 	    29/01/2019
Description            : 	    Review approve service to handle review page related actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  Subscriber } from 'rxjs';
import { isArray } from 'util';

import { BusinessDepositService } from '../../services/business-deposit.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';

import { ApplicationDetails, ApplicantDetails, BusinessDetails } from '../../../core/models/application.model';
import { APPLICANT_TYPE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';


@Injectable()
export class BusinessReviewService {

	constructor(
		private businessDepositSvc: BusinessDepositService
	) { }

	getConsumerData(): Observable<ApplicationDetails | any> {
		return new Observable((observer) => {
			this.businessDepositSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	// processReview(arn): Observable<any> {
	// 	return new Observable((observer) => {
	// 		this.businessDepositSvc.processReview(arn).subscribe(data => {
	// 			observer.next(data.body);
	// 		});
	// 	});
	// }

	setConsumerData(details: any, saveAndExit = false, uistate?: string): any {
		const consumerDetails: any = { ...details };
		const arn = sessionStorage.getItem('arn');
		const productIdList = JSON.parse(sessionStorage.getItem('productIdList'));
		let consumerData: ApplicationDetails;
		const responsibledetails: Array<ApplicantDetails> = consumerDetails.responsibledetails;
		const business: BusinessDetails = <BusinessDetails>consumerDetails.business;
		this.addApplicantType(consumerDetails);
		consumerData = {
			arn: arn,
			responsibledetails: responsibledetails,
			businessdetails: business,
			products: productIdList,
			uistate: saveAndExit ? uistate : this.getUIState(consumerDetails),
			updateuistate: false
		};
		return consumerData;
	}

	addApplicantType(consumerDetails) {
		if (consumerDetails.responsibledetails) {
			consumerDetails.responsibledetails.map(item => {
				item.applicanttype = APPLICANT_TYPE['businessApplicant'];
			});
		}
	}

	getUIState(consumerDetails) {
		if (consumerDetails.responsibledetails && consumerDetails.pid) {
			return `responsibleInfo-${consumerDetails.pid}`;
		} else if (consumerDetails.business) {
			return 'businessInfo';
		}
	}

	saveDetails(consumerDetails: any): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails);
			if (consumerDetails.responsibledetails) {
				this.businessDepositSvc.checkUniqueness(consumerData).subscribe(response => {
					if (response.message === 'success') {
						this.continueDetails(consumerData, observer);
					} else if (isArray(response) && response.length > 0) {
						throw new ApplicationError('1004');
					}
				}, error => {
					throw new ApplicationError(error.error.code);
				});
			} else {
				this.continueDetails(consumerData, observer);
			}
		});
	}

	processSaveAndExit(consumerDetails: any, uistate: string): Observable<any> {
		return new Observable((observer) => {
			const businessData = this.setConsumerData(consumerDetails, true, uistate);
			return this.businessDepositSvc.saveDetails(businessData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	continueDetails(consumerData: ApplicationDetails, observer: Subscriber<any>) {
		return this.businessDepositSvc.continueDetails(consumerData).subscribe((data: Response) => {
			if (data.statusCode === 200) {
				observer.next('success');
			} else {
				observer.next('failure');
			}
		});
	}

	reviewContinue(): Observable<any> {
		// return new Observable((observer) => {
		// 	observer.next({ message: 'IDA' });
		// });
		return this.businessDepositSvc.reviewContinue().pipe(map(response => response.body));
	}

	idaQuestion(): Observable<any> {
		return this.businessDepositSvc.idaQuestion().pipe(map(response => response));
	}

	idaAnswerView(reqData: any): Observable<any> {
		return this.businessDepositSvc.idaAnswerView(reqData).pipe(map(response => response));
	}

}
