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

import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { BusinessDepositService } from '../../services/business-deposit.service';

import { ApplicationDetails, BusinessDetails } from '../../../core/models/application.model';
import { UI_STATE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';


@Injectable()
export class BusinessDetailsService {

	constructor(
		private businessDepositSvc: BusinessDepositService,
		private location: Location
	) { }

	// autofillAddress(form: any, sameMailing: boolean) {
	// 	if (sameMailing) {
	// 		form.patchValue({ mailingaddress: form.value.physicaladdress });
	// 	}
	// }

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			this.businessDepositSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	getUIState() {
		return UI_STATE[this.location.path().split('/')[2]];
	}

	setBusinessData(businessDetailsData: any): any {
		const arn = sessionStorage.getItem('arn');
		let businessData: ApplicationDetails;
		const businessDetails: BusinessDetails = <BusinessDetails>businessDetailsData;
		businessData = {
			arn: arn,
			businessdetails: businessDetails,
			uistate: this.getUIState(),
			updateuistate: true
		};
		return businessData;
	}

	processBack(consumerDetails: any): Observable<any> {
		return new Observable((observer) => {
			const businessData = this.setBusinessData(consumerDetails);
			this.businessDepositSvc.saveDetailsOnBack(businessData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	processSaveAndExit(consumerDetails: any): Observable<any> {
		return new Observable((observer) => {
			const businessData = this.setBusinessData(consumerDetails);
			this.businessDepositSvc.saveDetails(businessData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	processNextStepNavigation(consumerDetails: any): Observable<any> {
		return new Observable((observer) => {
			const businessData = this.setBusinessData(consumerDetails);
			this.businessDepositSvc.continueDetails(businessData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	getNextState(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		return this.businessDepositSvc.getNextState(arn);
	}

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

}
