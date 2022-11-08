/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :	    	Business
File Name              :		    select-product.service.ts
Author                 :		    Amir Masood
Date (DD/MM/YYYY)      :		    06/09/2019
Description            :		    Product selection service
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { BusinessDepositService } from '../../services/business-deposit.service';

import { ApplicationDetails, ApplicantDetails, BusinessDetails } from '../../../core/models/application.model';
import { Product } from '../../../core/models/product.model';
import { Response } from '../../../core/models/response';


@Injectable()
export class SelectProductService {

	constructor(
		private businessDepositSvc: BusinessDepositService,
		@Inject(Router) private router: Router
	) { }

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			this.businessDepositSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
				return observer.next(data);
			});
		});
	}

	setConsumerData(consumerDetail: ApplicationDetails, productIdList: Array<Product>) {
		const arn = sessionStorage.getItem('arn');
		sessionStorage.setItem('productIdList', JSON.stringify(productIdList));
		productIdList.forEach(product => {
			if (product.dividendamount) {
				product.dividendamount = Number(product.dividendamount);
			}
		});
		const businessDetails: BusinessDetails = <BusinessDetails>JSON.parse(sessionStorage.getItem('eligibilityQuestions'));
		let consumerData: ApplicationDetails;
		const responsible: Array<ApplicantDetails> = consumerDetail.responsibledetails;
		consumerData = {
			arn: arn,
			responsibledetails: responsible,
			products: productIdList,
			businessdetails: businessDetails,
			uistate: 'selectProduct',
			updateuistate: false
		};
		return consumerData;
	}

	checkApplicationUniqueness(productIdList) {
		const arn = sessionStorage.getItem('arn');
		if (productIdList.length > 0) {
			if (arn && arn !== '') {
				this.getConsumerData().subscribe(consumerData => {
					const consumerDetails = this.setConsumerData(consumerData, productIdList);
					this.businessDepositSvc.continueDetails(consumerDetails).subscribe((data: Response) => {
						if (data.statusCode === 200) {
							this.router.navigate(['/business-deposit/business-details']);
						}
					});
				});
			} else {
				sessionStorage.setItem('productIdList', JSON.stringify(productIdList));
				this.router.navigate(['/business-deposit/business-details']);
			}
		}
	}

}
