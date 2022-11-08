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

import { Injectable, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ConsumerDepositService } from '../../services/consumer-deposit.service';

import { ApplicationDetails, ApplicantDetails, Address } from '../../../core/models/application.model';
import { UI_STATE } from '../../../core/models/enums';
import { ZipDetails } from '../../../core/models/usps-response.model';

@Injectable()
export class GettingStartedService {

	constructor(
		private consumerDepositSvc: ConsumerDepositService,
		@Inject(Router) private router: Router,
		@Inject(Location) private location: Location
	) { }

	checkApplicationUniqueness(zipData: ZipDetails) {
		const arn = sessionStorage.getItem('arn');
		if (zipData && zipData.zip5 && zipData.zip5 !== '') {
			sessionStorage.setItem('zipcode', JSON.stringify(zipData));
			if (arn && arn !== '') {
				// const products = JSON.parse(sessionStorage.getItem('productIdList'));
				const applicationData = <ApplicationDetails>{
					// products,
					arn: arn,
					personaldetails: <ApplicantDetails>{
						physicaladdress: <Address>{
							zipcode: zipData.zip5,
							city: zipData.city,
							state: zipData.state,
						}
					},
					uistate: UI_STATE[this.location.path().split('/')[2]],
					updateuistate: true
				};
				this.consumerDepositSvc.continueDetails(applicationData).subscribe(data => {
					if (data.message === 'success') {
						this.router.navigate(['/consumer-deposit/select-product']);
						// } else if (isArray(data) && data.length > 0) {
						// 	sessionStorage.removeItem('zipcode');
						// 	const conflictDataList = data.map(product => PRODUCTLIST[product]);
						// 	throw new ApplicationError('', `There is an existing application for you with products: ${conflictDataList}. Kindly resume it.`);
					}
				});
			} else {
				// sessionStorage.setItem('productIdList', productIdList.toString());
				this.router.navigate(['/consumer-deposit/select-product']);
			}
		}
	}

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			this.consumerDepositSvc.getConsumerDetails().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	getZipData(zipcode: string) {
		return new Observable((observer) => {
			this.consumerDepositSvc.getZipData(zipcode).subscribe((data: any) => {
				// if (data.exists) {
				return observer.next(data);
				// } else {
				// 	return observer.error();
				// }

				// let invalidZip = true;
				// data.forEach(datum => {
				// 	if (datum.zipcode === zipcode) {
				// 		invalidZip = false;
				// 		return observer.next();
				// 	}
				// });
				// if (invalidZip) {
				// 	return observer.error();
				// }
				// if (data.includes(zipcode)) {
				// 	return observer.next();
				// } else {
				// 	return observer.error();
				// }
			}, error => {
				return observer.error(error.error);
			});
		});
	}

}
