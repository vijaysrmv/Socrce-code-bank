/*------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Consumer OAO
File Name              :        beneficiary-details.service.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        25/01/2019
Description            :        service to look after beneficiary detail related actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

import { ConsumerDepositService } from '../../services/consumer-deposit.service';

import { ApplicationDetails, BeneficiaryDetails } from '../../../core/models/application.model';
import { UI_STATE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';


@Injectable()
export class BeneficiaryDetailsService {

	constructor(
		private consumerDepositSvc: ConsumerDepositService,
		private location: Location
	) { }

	processSaveAndExit(beneficiaryDetails: BeneficiaryDetails[]): Observable<any> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				const consumerData = this.setConsumerData(beneficiaryDetails, data);
				this.consumerDepositSvc.saveDetails(consumerData).subscribe((response: Response) => {
					if (response.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				});
			});
		});
	}

	processBack(beneficiaryDetails: BeneficiaryDetails[]): Observable<any> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				const consumerData = this.setConsumerData(beneficiaryDetails, data);
				this.consumerDepositSvc.saveDetailsOnBack(consumerData).subscribe((response: Response) => {
					if (response.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				});
			});
		});
	}

	processNextStepNavigation(beneficiaryDetails: BeneficiaryDetails[]): Observable<any> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				const consumerData = this.setConsumerData(beneficiaryDetails, data);
				this.consumerDepositSvc.continueDetails(consumerData).subscribe((response: Response) => {
					if (response.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				});
			});
		});
	}

	setConsumerData(beneficiaryDetails: BeneficiaryDetails[], consumerDetails: ApplicationDetails) {
		const arn = sessionStorage.getItem('arn');
		let consumerData: ApplicationDetails;
		consumerData = {
			arn: arn,
			beneficiarydetails: beneficiaryDetails,
			uistate: this.getUIState(),
			updateuistate: true
		};
		return consumerData;
	}

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	processDelete(pid: Number): Observable<any> {
		const reqData = {
			pid: pid,
			uistate: 'beneficiaryInfo',
			applicanttype: 'beneficiary',
			updateuistate: UI_STATE[this.location.path().split('/')[2]] === 'review' ? false : true,
		};
		return this.consumerDepositSvc.deleteApplicant(reqData).pipe(map(response => response.body));
	}

	setBeneficiaryCount(req) {
		req.options = 'beneficiaryOptions';
		return this.consumerDepositSvc.setAdditionalOptions(req);
	}

	getUIState() {
		return UI_STATE[this.location.path().split('/')[2]];
	}

}
