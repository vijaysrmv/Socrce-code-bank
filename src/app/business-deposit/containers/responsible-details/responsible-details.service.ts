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
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable ,  of } from 'rxjs';
import { isArray } from 'util';

import { BusinessDepositService } from '../../services/business-deposit.service';

import { DocumentService } from '../../../core/apis/document.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { CustomValidation } from '../../../core/utility/custom-validations';
import { ModalBoxService } from '../../../shared/services/modal-box.service';

import { ApplicationDetails, ApplicantDetails, BusinessDetails, Document, DocResponse } from '../../../core/models/application.model';
import { UI_STATE, APPLICANT_TYPE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';


@Injectable()
export class ResponsibleDetailsService {

	constructor(
		private businessDepositSvc: BusinessDepositService,
		private documentSvc: DocumentService,
		private location: Location,
		private modalBoxService: ModalBoxService,
		private pageLoaderSvc: PageLoaderService
	) { }

	// autofillAddress(form: any, singleAccount: boolean, sameMailing: boolean, samePhysicalJoint: boolean) {
	// 	if (sameMailing) {
	// 		form['controls'].personaldetails.patchValue({ mailingaddress: form.value.personaldetails.physicaladdress });
	// 	}
	// 	if (!singleAccount && samePhysicalJoint) {
	// 		form['controls'].jointdetails.patchValue({ physicaladdress: form.value.personaldetails.physicaladdress });
	// 	}
	// }

	getConsumerData(): Observable<ApplicationDetails> {
		return this.businessDepositSvc.getConsumerData();
	}

	getUIState(pid: number) {
		return `${UI_STATE[this.location.path().split('/')[2]]}-${pid}`;
	}

	setConsumerData(consumerDetails: any, pid: number, updateuistate = false): any {
		const arn = sessionStorage.getItem('arn');
		const businessDetails: BusinessDetails = <BusinessDetails>JSON.parse(sessionStorage.getItem('eligibilityQuestions'));
		const productIdList = JSON.parse(sessionStorage.getItem('productIdList'));
		let consumerData: ApplicationDetails;
		const personal: Array<ApplicantDetails> = consumerDetails;
		consumerData = {
			arn: arn,
			products: productIdList,
			responsibledetails: personal,
			businessdetails: businessDetails,
			uistate: this.getUIState(pid),
			updateuistate: updateuistate
		};
		return consumerData;
	}

	fetchDocs(applicantType, pid): Observable<DocResponse> {
		return this.documentSvc.getConsumerDoc(applicantType, pid);
	}

	saveDocs(idsObj): Observable<any> {
		return this.documentSvc.saveDocs(idsObj.ids, idsObj.idtype, idsObj.holder, idsObj.pid);
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

	createApplication(consumerDetails: any, pid: number): Observable<any> {
		const consumerData = this.setConsumerData(consumerDetails, pid);
		return this.businessDepositSvc.createApplication(consumerData).pipe(map(data => data.arn ? 'success' : 'error'));
	}

	processDelete(pid: Number): Observable<any> {
		const reqData = {
			pid: pid,
			uistate: 'responsibleInfo',
			applicanttype: APPLICANT_TYPE['businessApplicant'],
			updateuistate: UI_STATE[this.location.path().split('/')[2]] === 'review' ? false : true,
		};
		return this.businessDepositSvc.deleteApplicant(reqData).pipe(map(response => response.body));
	}

	checkMilestoneError(consumerForm: any): boolean {
		let personal: any, lastnameError: any, dobError: any, emailError: any;
		personal = consumerForm['controls'];

		lastnameError = (personal.lastname.value === null || personal.lastname.value === '') || (personal.lastname.errors) && (personal.lastname.dirty || !personal.lastname.touched);
		dobError = (personal.dob.value === null || personal.dob.value === '') || (personal.dob.errors && (personal.dob.dirty || !personal.dob.touched));
		emailError = (personal.email.value === null || personal.email.value === '' || personal.confirmEmail.value === null || personal.confirmEmail.value === '') || ((personal.errors || personal.confirmEmail.errors) && (personal.confirmEmail.dirty || !personal.confirmEmail.touched));
		return (lastnameError || dobError || emailError);
	}

	updateConsumerData(pid, consumer, consumerData) {
		let position = -1;
		consumer.pid = pid;
		consumer.applicanttype = APPLICANT_TYPE['businessApplicant'];
		if (consumerData && consumerData.responsibledetails) {
			consumerData.responsibledetails.forEach((item, index) => {
				if (item.pid === consumer.pid) {
					position = index;
				}
			});
		}
		if (position === -1) {
			if (!consumerData) {
				consumerData = {
					responsibledetails: []
				};
			}
			consumerData.responsibledetails.push(consumer);
		} else {
			consumerData.responsibledetails[position] = consumer;
		}
		return consumerData;
	}

	processBack(consumerDetails: any, pid: number): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails, pid);
			return this.businessDepositSvc.saveDetailsOnBack(consumerData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			}, error => {
				this.pageLoaderSvc.hide();
			});
		});
	}

	processSaveAndExit(consumerDetails: any, pid: number): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails, pid, true);
			if (pid === 1) {
				this.businessDepositSvc.checkUniqueness(consumerData).subscribe(response => {
					if (response.message === 'success') {
						return this.businessDepositSvc.saveDetails(consumerData).subscribe((data: Response) => {
							if (data.statusCode === 200) {
								observer.next('success');
							} else {
								observer.next('failure');
							}
						}, error => {
							this.pageLoaderSvc.hide();
						});
					} else if (isArray(response) && response.length > 0) {
						throw new ApplicationError('1004');
					}
				});
			} else {
				return this.businessDepositSvc.saveDetails(consumerData).subscribe((data: Response) => {
					if (data.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				}, error => {
					this.pageLoaderSvc.hide();
				});
			}
		});
	}

	processNextStepNavigation(consumerDetails: any, pid: number): Observable<any> {
		return new Observable((observer) => {
			const consumerData = this.setConsumerData(consumerDetails, pid, true);
			if (pid === 1) {
				this.businessDepositSvc.checkUniqueness(consumerData).subscribe(response => {
					if (response.message === 'success') {
						return this.businessDepositSvc.continueDetails(consumerData).subscribe((data: Response) => {
							if (data.statusCode === 200) {
								observer.next('success');
							} else {
								observer.next('failure');
							}
						}, error => {
							this.pageLoaderSvc.hide();
						});
					} else if (isArray(response) && response.length > 0) {
						throw new ApplicationError('1004');
					}
				}, error => {
					this.pageLoaderSvc.hide();
					throw new ApplicationError(error.error.code);
				});
			} else {
				return this.businessDepositSvc.continueDetails(consumerData).subscribe((data: Response) => {
					if (data.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				}, error => {
					this.pageLoaderSvc.hide();
				});
			}
		});
	}

	// getDatafromHashCode(personaldetails: any): Observable<any> {
	// 	return this.businessDepositSvc.getDatafromHashCode(personaldetails);
	// }

	// checkFormSemantics(group: any, errorStatus: boolean) {
	// 	Object.keys(group.controls).forEach(key => {
	// 		if (errorStatus === false || errorStatus === null) {
	// 			if (group.controls[key]['controls']) {
	// 				errorStatus = this.checkFormSemantics(group.controls[key], errorStatus);
	// 			} else {
	// 				errorStatus = (group.controls[key].errors && (group.controls[key].dirty || group.controls[key].touched) && !group.controls[key].hasError('required'));
	// 				if (errorStatus === true) {
	// 					return errorStatus;
	// 				}
	// 			}
	// 		} else {
	// 			return errorStatus;
	// 		}
	// 	});
	// 	return errorStatus;
	// }

	// private getDocIds(docsInfo: Document[]) {
	// 	return docsInfo.filter(doc => {
	// 		return doc.doctype !== 'STUDENT_ID';
	// 	}).map(doc => {
	// 		return doc.docid;
	// 	});
	// }

	setAdditionalResponsibleCount(req: any, pid: number) {
		req.options = 'responsibleOptions';
		req.uistate = this.getUIState(pid);
		return this.businessDepositSvc.setAdditionalOptions(req);
	}

	// setAuthorizerCount(req) {
	// 	req.options = 'authorizedOption';
	// 	return this.businessDepositSvc.setAdditionalOptions(req);
	// }

	getNextState(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		return this.businessDepositSvc.getNextState(arn);
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
		consumerData.responsibledetails.forEach(item => {
			if (pid !== item.pid) {
				ssnList.push(item.ssn);
			}
		});
		return ssnList;
	}

	_createEmailList(pid, consumerData): Array<string> {
		const emailList = [];
		consumerData.responsibledetails.forEach(item => {
			if (pid !== item.pid && item.email) {
				emailList.push(item.email.toUpperCase());
			}
		});
		return emailList;
	}

	_setRelationshipCount(pid, consumerData) {
		this.modalBoxService.authorizeSigner = 0;
		this.modalBoxService.beneficialOwner = 0;
		this.modalBoxService.significantController = 0;
		consumerData.responsibledetails.forEach(item => {
			if (pid !== item.pid) {
				if (item.relationship.isauthorized) {
					this.modalBoxService.authorizeSigner++;
				}
				if (item.relationship.isbeneficialowner) {
					this.modalBoxService.beneficialOwner++;
				}
				if (item.relationship.issignificantcontroller) {
					this.modalBoxService.significantController++;
				}
			}
		});
	}

}
