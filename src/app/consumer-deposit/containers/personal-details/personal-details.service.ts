/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            : 		Newgen Portal
Module                 :		Consumer Deposit
File Name              : 		personal-details.service.ts
Author                 : 		Aditya Agrawal
Date (DD/MM/YYYY)      : 		16/09/2019
Description            : 		Personal details service to handle personal details page actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable ,  of } from 'rxjs';
import { isArray } from 'util';


import { ConsumerDepositService } from '../../services/consumer-deposit.service';
import { DocumentService } from '../../../core/apis/document.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';

import { ApplicationDetails, ApplicantDetails, DocResponse } from '../../../core/models/application.model';
import { UI_STATE, APPLICANT_TYPE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';
import { CustomValidation } from '../../../core/utility/custom-validations';


@Injectable()
export class PersonalDetailsService {

	address: Array<any>;
	// initCounter = 0;

	constructor(
		private consumerDepositSvc: ConsumerDepositService,
		private location: Location,
		private _documentSvc: DocumentService,
		private pageLoaderSvc: PageLoaderService
	) { }

	createApplication(consumerDetails: any): Observable<any> {
		// if (this.initCounter === 0) {
		const consumerData = this.setConsumerData(consumerDetails);
		// this.initCounter++;
		return this.consumerDepositSvc.createApplication(consumerData).pipe(map(data => data.arn ? 'success' : 'error'));
		// } else {
		// 	return of([]);
		// }
	}

	processNextStepNavigation(consumerDetails: any): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails);
			consumerData.updateuistate = false;
			this.consumerDepositSvc.checkUniqueness(consumerData).subscribe(response => {
				if (response.message === 'success') {
					return this.consumerDepositSvc.continueDetails(consumerData).subscribe((data: Response) => {
						if (data.statusCode === 200) {
							observer.next('success');
						} else {
							observer.next('failure');
						}
					});
				} else if (isArray(response) && response.length > 0) {
					this.pageLoaderSvc.hide();
					throw new ApplicationError('1004');
				}
			});
		});
	}

	processSaveAndExit(consumerDetails: any): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails);
			consumerData.updateuistate = true;
			this.consumerDepositSvc.checkUniqueness(consumerData).subscribe(response => {
				if (response.message === 'success') {
					return this.consumerDepositSvc.saveDetails(consumerData).subscribe((data: Response) => {
						if (data.statusCode === 200) {
							observer.next('success');
						} else {
							observer.next('failure');
						}
					});
				} else if (isArray(response) && response.length > 0) {
					throw new ApplicationError('1004');
				}
			});
		});
	}

	processBack(consumerDetails: any): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails);
			return this.consumerDepositSvc.saveDetailsOnBack(consumerData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	setConsumerData(consumerDetails: any): any {
		const arn = sessionStorage.getItem('arn');
		const productIdList = JSON.parse(sessionStorage.getItem('productIdList'));
		const qualificationData = JSON.parse(sessionStorage.getItem('qualificationDetails'));
		let consumerData: ApplicationDetails;
		const personal: ApplicantDetails = <ApplicantDetails>consumerDetails;
		personal.applicanttype = APPLICANT_TYPE['consumerPrimary'];
		consumerData = {
			arn: arn,
			personaldetails: personal, // this.formatPersonalDetails(personal),
			products: productIdList,
			qualifications: qualificationData,
			uistate: this.getUIState(),
			updateuistate: false
		};
		return consumerData;
	}

	getUIState() {
		return UI_STATE[this.location.path().split('/')[2]];
	}

	getNextUIState() {
		return this.consumerDepositSvc.getNextState().pipe(map(data => data));
	}


	fetchDocs(applicantType, pid): Observable<DocResponse> {
		return this._documentSvc.getConsumerDoc(applicantType, pid);
	}

	saveDocs(idObj): Observable<any> {
		return this._documentSvc.saveDocs(idObj.ids, idObj.idtype, idObj.holder, idObj.pid);
	}

	setJointApplicantCount(req) {
		req.options = 'jointOptions';
		req.uistate = this.getUIState();
		return this.consumerDepositSvc.setAdditionalOptions(req);
	}

	setBeneficiaryCount(req) {
		req.options = 'beneficiaryOptions';
		return this.consumerDepositSvc.setAdditionalOptions(req);
	}

	// createOlbApplication(req) {
	// 	req.uistate = this.getUIState();
	// 	return this.consumerDepositSvc.createOlbApplication(req);
	// }

	deleteConsumerDoc(docIds): Observable<any> {
		let retObs;
		docIds.forEach(id => {
			if (retObs) {
				retObs = retObs.concatMap(() => {
					return this._documentSvc.deleteConsumerDoc(id);
				});
			} else {
				retObs = this._documentSvc.deleteConsumerDoc(id);
			}
		});
		return retObs ? retObs : of([]);
	}

	_setValidationOnEmailSsn(pid, consumer, consumerData) {
		const ssnList = this._createSsnList(pid, consumerData);
		const emailList = this._createEmailList(pid, consumerData);
		consumer.consumerForm.get('ssn').setValidators([...CustomValidation.ssn, CustomValidation.checkDuplicateSsn(ssnList)]);
		consumer.consumerForm.get('email').setValidators([...CustomValidation.email, CustomValidation.checkDuplicateEmail(emailList)]);
		consumer.consumerForm.get('ssn').updateValueAndValidity({ onlySelf: true });
		consumer.consumerForm.get('email').updateValueAndValidity({ onlySelf: true });
	}

	_createSsnList(pid, consumerData): Array<string> {
		const ssnList = [];
		if (consumerData.jointdetails) {
			consumerData.jointdetails.forEach(item => {
				if (pid !== item.pid) {
					ssnList.push(item.ssn);
				}
			});
		}
		if (consumerData.beneficiarydetails) {
			consumerData.beneficiarydetails.forEach(item => {
				if (item.ssn) {
					ssnList.push(item.ssn);
				}
			});
		}
		return ssnList;
	}

	_createEmailList(pid, consumerData): Array<string> {
		const emailList = [];
		if (consumerData.jointdetails) {
			consumerData.jointdetails.forEach(item => {
				if (pid !== item.pid && item.email) {
					emailList.push(item.email.toUpperCase());
				}
			});
		}
		return emailList;
	}

	processJointDelete(pid: number): Observable<any> {
		const reqData = {
			pid: pid,
			// uistate: this.getUIState(),
			uistate: 'jointInfo',
			applicanttype: APPLICANT_TYPE['consumerJoint'],
			updateuistate: true,
		};
		return this.consumerDepositSvc.deleteApplicant(reqData).pipe(map(response => response.body));
	}

}
