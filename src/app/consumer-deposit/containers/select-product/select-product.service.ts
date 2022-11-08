/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Consumer Deposit
File Name              :        select-product.service.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        07/09/2019
Description            :        Service to handle select-product component related actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ConsumerDepositService } from '../../services/consumer-deposit.service';

import { ApplicationDetails, SelectedProduct, ApplicantDetails } from '../../../core/models/application.model';
import { Response } from '../../../core/models/response';
import { APPLICANT_TYPE } from '../../../core/models/enums';


@Injectable()
export class SelectProductService {

	constructor(
		private consumerDepositSvc: ConsumerDepositService,
		@Inject(Router) private router: Router
	) { }

	checkApplicationUniqueness(productIdList: Array<SelectedProduct>) {
		const arn = sessionStorage.getItem('arn');
		sessionStorage.setItem('productIdList', JSON.stringify(productIdList));
		if (productIdList.length > 0) {
			if (arn && arn !== '') {
				this.getConsumerData().subscribe(consumerData => {
					const consumerDetails = this.setConsumerData(consumerData);
					this.consumerDepositSvc.continueDetails(consumerDetails).subscribe((data: Response) => {
						if (data.statusCode === 200) {
							this.router.navigate(['/consumer-deposit/personal-details']);
						}
					});
				});
			} else {
				this.router.navigate(['/consumer-deposit/personal-details']);
			}
		}
	}

	setConsumerData(consumerDetail: ApplicationDetails) {
		const arn = sessionStorage.getItem('arn');
		const productIdList = JSON.parse(sessionStorage.getItem('productIdList'));
		productIdList.forEach(product => {
			if (product.amount) {
				product.amount = Number(product.amount);
			}
		});
		const qualificationData = consumerDetail.qualifications;
		let consumerData: ApplicationDetails;
		const personal: ApplicantDetails = <ApplicantDetails>consumerDetail.personaldetails;
		personal.applicanttype = APPLICANT_TYPE['consumerPrimary'];
		personal.dob = sessionStorage.getItem('dob');
		consumerData = {
			arn: arn,
			personaldetails: personal,
			products: productIdList,
			qualifications: qualificationData,
			uistate: 'selectProduct',
			updateuistate: false
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

	getCDRateStructure(amount: number) {
		return this.consumerDepositSvc.getCDRateStructure(amount);
	}

}
