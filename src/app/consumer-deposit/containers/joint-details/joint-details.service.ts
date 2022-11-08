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


import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

import { ConsumerDepositService } from '../../services/consumer-deposit.service';
import { DocumentService } from '../../../core/apis/document.service';

import { ApplicationDetails, ApplicantDetails, DocResponse } from '../../../core/models/application.model';
import { UI_STATE, APPLICANT_TYPE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';
import { CustomValidation } from '../../../core/utility/custom-validations';


@Injectable()
export class JointDetailsService {

	constructor(
		private consumerDepositSvc: ConsumerDepositService,
		private documentSvc: DocumentService,
		private location: Location
	) { }

	processSaveAndExit(jointDetails: Array<ApplicantDetails>, pid: number): Observable<any> {
		return new Observable((observer) => {
			const consumerData: ApplicationDetails = this.setConsumerData(jointDetails, pid, true);
			this.consumerDepositSvc.saveDetails(consumerData).subscribe((resp: Response) => {
				if (resp.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	processNextStepNavigation(jointDetails: Array<ApplicantDetails>, pid: number): Observable<any> {
		return new Observable((observer) => {
			const consumerData: ApplicationDetails = this.setConsumerData(jointDetails, pid, true);
			this.consumerDepositSvc.continueDetails(consumerData).subscribe((resp: Response) => {
				if (resp.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	processBack(jointDetails: Array<ApplicantDetails>, pid: number): Observable<any> {
		return new Observable((observer) => {
			const consumerData: ApplicationDetails = this.setConsumerData(jointDetails, pid);
			this.consumerDepositSvc.saveDetailsOnBack(consumerData).subscribe((resp: Response) => {
				if (resp.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	processDelete(pid: number): Observable<any> {
		const reqData = {
			pid: pid,
			// uistate: this.getUIState(),
			uistate: 'jointInfo',
			applicanttype: APPLICANT_TYPE['consumerJoint'],
			updateuistate: UI_STATE[this.location.path().split('/')[2]] === 'review' ? false : true,
		};
		return this.consumerDepositSvc.deleteApplicant(reqData).pipe(map(response => response.body));
	}

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	setConsumerData(joint: ApplicantDetails[], pid: number, updateuistate = false): any {
		let jointData: ApplicantDetails[] = [...joint];
		jointData = jointData.map(jointdetails => {
			const { physicaladdress, previousaddress, ...details } = jointdetails;
			return details;
		});
		const arn = sessionStorage.getItem('arn');
		let consumerData: ApplicationDetails;
		consumerData = {
			arn: arn,
			jointdetails: this.formatJointDetails(jointData),
			uistate: this.getUIState(pid - 1),
			updateuistate: updateuistate
		};
		return consumerData;
	}

	getUIState(pid: number) {
		return `${UI_STATE[this.location.path().split('/')[2]]}-${pid}`;
	}

	getNextUIState() {
		return this.consumerDepositSvc.getNextState().pipe(map(data => data));
	}

	// saveDocs(idsList: Array<any>): Observable<any> {
	// 	let retObs: any;
	// 	idsList.forEach((idsObj, index) => {
	// 		if (retObs) {
	// 			retObs = retObs.concatMap(() => {
	// 				return this.documentSvc.saveDocs(idsObj.ids, idsObj.idtype, idsObj.holder, idsObj.pid);
	// 			});
	// 		} else {
	// 			retObs = this.documentSvc.saveDocs(idsObj.ids, idsObj.idtype, idsObj.holder, idsObj.pid);
	// 		}
	// 	});
	// 	return retObs ? retObs : of([]);
	// }

	saveDocs(idsObj): Observable<any> {
		return this.documentSvc.saveDocs(idsObj.ids, idsObj.idtype, idsObj.holder, idsObj.pid);
	}

	addApplicantType(jointData) {
		Object.keys(jointData).forEach(key => {
			jointData[key].applicanttype = `JOINT${Number(key) + 1}`;
		});
	}

	setBeneficiaryCount(req) {
		req.options = 'beneficiaryOptions';
		return this.consumerDepositSvc.setAdditionalOptions(req);
	}

	setJointApplicantCount(req, pid) {
		req.options = 'jointOptions';
		req.uistate = this.getUIState(pid - 1);
		return this.consumerDepositSvc.setAdditionalOptions(req);
	}

	formatJointDetails(data) {
		const jointDetails = data;
		Object.keys(jointDetails).forEach(key => {
			jointDetails[key].applicanttype = APPLICANT_TYPE['consumerJoint'];
		});
		return jointDetails;
	}

	fetchDocs(applicantType, pid): Observable<DocResponse> {
		return this.documentSvc.getConsumerDoc(applicantType, pid);
	}

	deleteConsumerDoc(docIds): Observable<any> {
		let retObs;
		docIds.forEach(id => {
			if (retObs) {
				retObs = retObs.concatMap(() => {
					return this.documentSvc.deleteConsumerDoc(id);
				});
			} else {
				retObs = this.documentSvc.deleteConsumerDoc(id);
			}
		});
		return retObs ? retObs : of([]);
	}

	getJointFormArray(consumerData, jointForm, pid) {
		let position = -1;
		let jointFormList: ApplicantDetails[] = [];
		jointForm.pid = pid;
		jointForm.applicanttype = APPLICANT_TYPE['consumerJoint'];
		jointFormList = consumerData.jointdetails;
		if (consumerData && consumerData.jointdetails) {
			consumerData.jointdetails.forEach((item, index) => {
				if (item.pid === pid) {
					position = index;
				}
			});
		}
		if (position === -1) {
			jointFormList.push(jointForm);
		} else {
			jointFormList[position] = jointForm;
		}
		return jointFormList;
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
		const primaryssn = consumerData.personaldetails.ssn;
		ssnList.push(primaryssn);
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
		const primaryemail = consumerData.personaldetails.email;
		emailList.push(primaryemail);
		if (consumerData.jointdetails) {
			consumerData.jointdetails.forEach(item => {
				if (pid !== item.pid && item.email) {
					emailList.push(item.email.toUpperCase());
				}
			});
		}
		return emailList;
	}
}
