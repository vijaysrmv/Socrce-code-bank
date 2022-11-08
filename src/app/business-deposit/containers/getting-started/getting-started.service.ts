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
// import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BusinessDepositService } from '../../services/business-deposit.service';
import { ApplicationDetails } from '../../../core/models/application.model';
// import { Product } from '../../../core/models/product.model';


@Injectable()
export class GettingStartedService {

	constructor(
		private businessDepositSvc: BusinessDepositService,
		// @Inject(Router) private router: Router
	) { }

	// checkApplicationUniqueness(productIdList: Array<Product>) {
	// 	const arn = sessionStorage.getItem('arn');
	// 	if (productIdList.length > 0) {
	// 		if (arn && arn !== '') {
	// 			this.router.navigate(['/business-deposit/responsible-details']);
	// 		} else {
	// 			sessionStorage.setItem('productIdList', JSON.stringify(productIdList));
	// 			this.router.navigate(['/business-deposit/responsible-details']);
	// 		}
	// 	}
	// }

	getConsumerData(): Observable<ApplicationDetails | any> {
		return this.businessDepositSvc.getConsumerData();
		// return new Observable((observer) => {
		// 	this.businessDepositSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
		// 		return observer.next(data);
		// 	});
		// });
	}

	// generateHashCode(personaldetails: any): Observable<any> {
	// 	return this.businessDepositSvc.generateHashCode(personaldetails);
	// }

	// getDatafromHashCode(personaldetails: any): Observable<any> {
	// 	return this.businessDepositSvc.getDatafromHashCode(personaldetails);
	// }

	submitContactForm(contactdetails: any): Observable<any> {
		return this.businessDepositSvc.submitContactForm(contactdetails);
	}

	getZipData(zipcode: string) {
		return new Observable((observer) => {
			this.businessDepositSvc.getZipData(zipcode).subscribe((data: any) => {
				return observer.next(data);
			}, error => {
				return observer.error(error.error);
			});
		});
	}

}
