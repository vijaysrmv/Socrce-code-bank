/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  : 		PES
Project/Product        : 		Newgen - OAO
Application            : 		Newgen Portal
Module                 :		Shared
File Name              : 		success.service.ts
Author                 : 		Amir Masood
Date (DD/MM/YYYY)      : 		02/05/2019
Description            : 		Success service to handle success page related actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  of } from 'rxjs';

import { MdmService } from '../../../core/apis/mdm.service';
import { OaoService } from '../../../core/apis/oao.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { Product } from '../../../core/models/product.model';


@Injectable()
export class SuccessService {

	constructor(
		private mdm: MdmService,
		private oaoService: OaoService
	) { }

	getConsumerData(): Observable<ApplicationDetails> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getConsumerData(arn);
		}
	}

	getSelectedProductsDetails(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getSelectedProductsDetails(arn);
		}
		// const data = {
		// 	productid: '500',
		// 	productname: 'Personal Checking',
		// 	accountnumber: '1232',
		// 	orderchecks: true
		// };
		// return new Observable((observer) => {
		// 	return observer.next(data);
		// });
	}

	getApplicantList(accountType: string): Observable<{ id: number; name: string; }[]> {
		// const data = [
		// 	{
		// 		id: 1,
		// 		name: 'amir masood'
		// 	},
		// 	{
		// 		id: 2,
		// 		name: 'alia Lia'
		// 	}
		// ];
		// return new Observable((observer) => {
		// 	observer.next(data);
		// });
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getConsumerData(arn).pipe(map((applicationDetails) => {
				if (accountType === 'consumerDeposit' && applicationDetails.jointdetails) {
					return applicationDetails.jointdetails
						.map((item) => {
							return {
								id: item.pid,
								name: item['firstname'] ? (item['firstname'] + ' ' + item['lastname']) : item['lastname']
							};
						});
				}
				if (accountType === 'businessDeposit' && applicationDetails.responsibledetails) {
					return [{
						id: applicationDetails.responsibledetails[0].pid,
						name: applicationDetails.responsibledetails[0]['firstname'] ? (applicationDetails.responsibledetails[0]['firstname'] + ' ' + applicationDetails.responsibledetails[0]['lastname']) : applicationDetails.responsibledetails[0]['lastname']
					}];
				}
			}));
		}
	}

	getHarlandClarkeUrl(reqObj) {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			reqObj.arn = arn;
			return this.oaoService.getHarlandClarkeUrl(arn, reqObj);
		}
		return of([]);
	}

	logout(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.logout(arn).pipe(map(resp => resp));
		}
	}

	getOrderCheckResponse(reqData): Observable<any> {
		// console.log(product, accountType);
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			// const applicanttype = accountType === 'consumerDeposit' ? 'PRIMARY' : 'INDIVIDUAL';
			// const reqData = {
			// 	arn,
			// 	applicationtype: accountType,
			// 	productid: product.productid,
			// 	applicants: {
			// 		applicanttype,
			// 		pid: 1
			// 	}
			// };
			return new Observable((observer) => {
				this.oaoService.getOrderCheckResponse(arn, reqData).subscribe((data: any) => {
					return observer.next(data);
				});
			});
		}
	}

}
