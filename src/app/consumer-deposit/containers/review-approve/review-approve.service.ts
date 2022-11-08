/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Consumer OAO
File Name              :        review-approve.service.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        29/01/2019
Description            :        Review approve service to handle review page related actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  Subscriber } from 'rxjs';
import { isArray } from 'util';

import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { ConsumerDepositService } from '../../services/consumer-deposit.service';

import { ApplicationDetails, ApplicantDetails, BeneficiaryDetails } from '../../../core/models/application.model';
import { Response } from '../../../core/models/response';
import { APPLICANT_TYPE } from '../../../core/models/enums';

@Injectable()
export class ReviewApproveService {

	constructor(
		private consumerDepositSvc: ConsumerDepositService,
	) { }

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	saveDetails(consumerDetails: any, pid?: any): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails, false, undefined , pid);
			if (consumerDetails.personal) {
				this.consumerDepositSvc.checkUniqueness(consumerData).subscribe(response => {
					if (response.message === 'success') {
						this.continueDetails(consumerData, observer);
					} else if (isArray(response) && response.length > 0) {
						throw new ApplicationError('1004');
					}
				});
			} else {
				this.continueDetails(consumerData, observer);
			}
		});
	}

	continueDetails(consumerData: ApplicationDetails, observer: Subscriber<any>) {
		return this.consumerDepositSvc.continueDetails(consumerData).subscribe((data: Response) => {
			if (data.statusCode === 200) {
				observer.next('success');
			} else {
				observer.next('failure');
			}
		});
	}

	processSaveAndExit(consumerDetails: ApplicationDetails, uistate: string): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails, true, uistate);
			return this.consumerDepositSvc.saveDetails(consumerData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	setConsumerData(details: any, saveAndExit = false, uistate?: string, pid?: number): any {
		const consumerDetails: any = { ...details };
		const arn = sessionStorage.getItem('arn');
		const productIdList = JSON.parse(sessionStorage.getItem('productIdList'));
		let consumerData: ApplicationDetails;
		const personal: ApplicantDetails = <ApplicantDetails>consumerDetails.personal;
		const joint: ApplicantDetails[] = <Array<ApplicantDetails>>consumerDetails.joint;
		const beneficiary: BeneficiaryDetails[] = <Array<BeneficiaryDetails>>consumerDetails.beneficiary;
		this.addApplicantType(consumerDetails);
		consumerData = {
			arn: arn,
			personaldetails: personal,
			jointdetails: joint,
			beneficiarydetails: beneficiary,
			products: productIdList,
			uistate: saveAndExit ? uistate : this.getUIState(consumerDetails, pid),
			updateuistate: false
		};
		consumerData = this.addQualification(consumerData, consumerDetails);
		return consumerData;
	}

	addQualification(consumerData, consumerdetails) {
		if (consumerdetails.personal) {
			const qualificationData = JSON.parse(sessionStorage.getItem('qualificationDetails'));
			consumerData['qualifications'] = qualificationData;
			return consumerData;
		}

		return consumerData;
	}

	addApplicantType(consumerDetails) {
		if (consumerDetails.personal) {
			consumerDetails.personal.applicanttype = APPLICANT_TYPE['consumerPrimary'];
		}
		if (consumerDetails.joint) {
			Object.keys(consumerDetails.joint).forEach(key => {
				consumerDetails.joint[key].applicanttype = APPLICANT_TYPE['consumerJoint'];
			});
		}
		if (consumerDetails.beneficiary) {
			Object.keys(consumerDetails.beneficiary).forEach(key => {
				consumerDetails.beneficiary[key].applicanttype = 'beneficiary';
			});
		}
	}

	reviewContinue(): Observable<any> {
		// return new Observable((observer) => {
		// 	observer.next({ message: 'IDA' });
		// });
		return this.consumerDepositSvc.reviewContinue().pipe(map(response => response.body));
	}

	idaQuestion(): Observable<any> {
		return this.consumerDepositSvc.idaQuestion().pipe(map(response => response));
	}

	idaAnswerView(reqData: any): Observable<any> {
		return this.consumerDepositSvc.idaAnswerView(reqData).pipe(map(response => response));
	}

	getUIState(consumerDetails, pid) {
		if (consumerDetails.personal) {
			return 'personalInfo';
		} else if (consumerDetails.joint) {
			return 'jointInfo-' + pid;
		} else if (consumerDetails.beneficiary) {
			return 'beneficiaryInfo';
		}
	}

	iRequest(): Observable<any> {
		return this.consumerDepositSvc.iRequest().pipe(map(response => response.body));
	}

	aRequest(reqData: any): Observable<any> {
		return this.consumerDepositSvc.aRequest(reqData).pipe(map(response => response.body));
	}
}
