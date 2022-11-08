/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 : 		Consumer OAO
File Name              : 		account-funding.service.ts
Author                 :  		Amir Masood
Date (DD/MM/YYYY)      : 		06/05/2019
Description            : 		service to lookafter account funding related actions
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';

import { MdmService } from '../../../core/apis/mdm.service';
import { OaoService } from '../../../core/apis/oao.service';
// import { ConsumerDepositService } from '../../../consumer-deposit/services/consumer-deposit.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { DueDiligenceQuestionnaire } from '../../../core/models/due-diligence-questionnaire.model';
import { ACCOUNT_TYPE, ELAVON_RESPONSE } from '../../../core/models/enums';
import { PaymentData, FundingData, InternalFunding } from '../../../core/models/oao-request-data.model';
import { Response } from '../../../core/models/response';
import { HttpClient } from '@angular/common/http';

declare let ConvergeEmbeddedPayment: any;

@Injectable()
export class AccountFundingService {

	isExisting: boolean;
	isZipCode = false;
	uistate: string;
	applicationtype: string;
	workItem: string;
	products: any;

	// productList = [{
	// 	'productshareid': 'share_01',
	// 	'minopeningdeposit': '0.00'
	// }, {
	// 	'productshareid': 'premier_checking_03',
	// 	'minopeningdeposit': '20'
	// }, {
	// 	'productshareid': 'holiday_account_04',
	// 	'minopeningdeposit': '0.00'
	// }, {
	// 	'productshareid': 'premier_plus_checking_05',
	// 	'minopeningdeposit': '0'
	// }];

	// existingAccountMock = [{
	// 	'balance': 40,
	// 	'accountdescription': 'SHARE SAVINGS ACCOUNT1',
	// 	'accounttype': 'savings',
	// 	'accountnumber': '000000-1231'
	// }, {
	// 	'balance': 800,
	// 	'accountdescription': 'HOLIDAY ACCOUNT',
	// 	'accounttype': 'savings',
	// 	'accountnumber': '000000-1232'
	// }, {
	// 	'balance': 567,
	// 	'accountdescription': 'STANDARD',
	// 	'accounttype': 'savings',
	// 	'accountnumber': '000000-1233'
	// }, {
	// 	'balance': 200,
	// 	'accountdescription': 'MONEY MARKET PLUS',
	// 	'accounttype': 'savings',
	// 	'accountnumber': '000000-1234'
	// }];

	constructor(
		private _mdm: MdmService,
		private oaoService: OaoService,
		private _location: Location,
		private _http: HttpClient
	) { }

	getProductList(): Observable<any> {
		// return new Observable((observer) => {
		// 	observer.next(this.productList);
		// });
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getConsumerData(arn).pipe(concatMap((data: ApplicationDetails) => {
				this.uistate = data.uistate;
				this.applicationtype = data.applicationtype;
				this.products = data.products;
				// this.isOlb = data['isolb'];
				// if (data.qualifications) {
				// 	const qualification = data.qualifications.qualificationtype;
				// 	if (qualification.toLowerCase() === 'zipcode') {
				// 		this.isZipCode = true;
				// 	}
				// }
				if (data.existing) {
					this.isExisting = data.existing;
				}
				if (data.workitem) {
					this.workItem = data.workitem;
				}
				const productIds = data.products.map(product => product.productid);
				const applicationtype = this.getAccount();
				return this._mdm.getProductsById(productIds, applicationtype);
			}), map((products) => {
				return {
					uistate: this.uistate,
					productList: products,
					products: this.products,
					workItem: this.workItem,
					applicationtype: this.applicationtype,
					isExisting: this.isExisting,
				};
			}));
		}
		// return this._pdSvc.getProductsById(['youth_share_01']);
	}

	getAccount() {
		return ACCOUNT_TYPE[this._location.path().split('/')[1]];
	}

	getPlaidAccessToken(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getPlaidAccessToken(arn).pipe(map(data => data));
		}
		return of([]);
	}

	processSaveAndExit(): Observable<any> {
		return new Observable((observer) => {
			const arn = sessionStorage.getItem('arn');
			const reqData = this.setRequestData();
			if (arn) {
				return this.oaoService.saveDetails(arn, reqData).subscribe((data: Response) => {
					if (data.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				});
			}
		});
	}

	saveFundingQuestionnaire(requestData: Array<DueDiligenceQuestionnaire>) {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.saveFundingQuestionnaire(arn, requestData).pipe(map(data => data));
		}
		return of([]);
	}

	getExistingAccounts(): Observable<any> {
		// return new Observable((observer) => {
		// 	observer.next(this.existingAccountMock);
		// });
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getExistingAccounts(arn).pipe(map(data => data));
		}
		return of([]);
	}

	setRequestData() {
		let reqData: ApplicationDetails;
		const arn = sessionStorage.getItem('arn');
		reqData = {
			arn: arn,
			uistate: 'accountFunding',
			applicationtype: this.getAccount(),
			updateuistate: false
		};
		return reqData;
	}

	getDateByBusinessDays(days): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const reqData = {
			date: null,
			days: days
		};
		if (arn) {
			return this.oaoService.getDateByBusinessDays(arn, reqData).pipe(map(data => data));
		}
		return of([]);
	}

	makeCardPayment(cardData, productList, totalamount) {
		console.log(cardData);
		const reqData: FundingData = this._createRequestData(productList, totalamount, 'external');
		// makeCardPayment(cardData, productList, totalamount, cardDetails, donationAmount) {
		// 	const reqData: PaymentData = this._createRequestData(cardData, productList, totalamount, donationAmount);
		const transactionReq = {
			ssl_first_name: cardData.cardholderfirstname,
			ssl_last_name: cardData.cardholderlastname,
			ssl_card_number: cardData.cardnumber,
			ssl_exp_date: cardData.expmonth + '/' + cardData.expyear,
			ssl_cvv2cvc2: cardData.cardcvv,
		};
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getPaymentSessionToken(arn, reqData).pipe(
				concatMap((tokenData) => {
					if (tokenData && tokenData.token) {
						transactionReq['ssl_txn_auth_token'] = tokenData.token;
						return this._finalPayment(transactionReq);
					}
					return of([]);
				})).pipe(
					concatMap((transactionResponse) => this.oaoService.postFundingAction(arn, transactionResponse))
				);

		}
		return of([]);
	}

	private _finalPayment(requestBody) {
		const token = requestBody['ssl_txn_auth_token'];
		return new Observable((observer) => {
			const callback = {
				onError: function (response) {
					// Take appropriate action to handle error
					response['transactionstatus'] = ELAVON_RESPONSE.ERROR;
					response['token'] = token;
					observer.next(response);
				},
				onDeclined: function (response) {
					// Take appropriate action to handle decline
					response['transactionstatus'] = ELAVON_RESPONSE.DECLINED;
					response['token'] = token;
					observer.next(response);
				},
				onApproval: function (response) {
					// Take appropriate action to handle approvals
					response['transactionstatus'] = ELAVON_RESPONSE.APPROVAL;
					response['token'] = token;
					observer.next(response);
				}
			};
			ConvergeEmbeddedPayment.pay(requestBody, callback);
		});
	}

	// makeInternalPayment(internalData, productList, totalamount, donationAmount): Observable<any> {
	// 	const reqData: PaymentData = this._createRequestData(internalData, productList, totalamount, donationAmount);
	// 	return this._consumerDepositSvc.makeInternalPayment(reqData);
	// }

	// makeAchPayment(achData, productList, totalamount, donationAmount): Observable<any> {
	// 	const reqData: PaymentData = this._createRequestData(achData, productList, totalamount, donationAmount);
	// 	return this._consumerDepositSvc.makeAchPayment(reqData);
	// }

	// _createRequestData(paymentData, productList, totalAmount, donationAmount) {
	// 	return {
	// 		arn: sessionStorage.getItem('arn'),
	// 		...paymentData,
	// 		totalamount: totalAmount,
	// 		productlist: productList,
	// 		membershipdonationamount: donationAmount
	// 	};
	// }

	makeInternalPayment(internalData: InternalFunding, productList, totalamount): Observable<any> {
		const reqData: FundingData = this._createRequestData(productList, totalamount, 'internal', internalData);
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.makeInternalPayment(arn, reqData).pipe(map(data => data));
		}
		return of([]);
	}

	makeCheckPayment(productList, totalamount) {
		const reqData: FundingData = this._createRequestData(productList, totalamount, 'check');
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.makeCheckPayment(arn, reqData).pipe(map(data => data));
		}
		return of([]);
	}

	makeZeroPayment(productList, totalamount) {
		const reqData: FundingData = this._createRequestData(productList, totalamount, 'zeroTransfer');
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.makeZeroPayment(arn, reqData).pipe(map(data => data));
		}
		return of([]);
	}

	// makeAchPayment(achData, productList, totalamount): Observable<any> {
	// 	const reqData: FundingData = this._createRequestData(achData, productList, totalamount);
	// 	const arn = sessionStorage.getItem('arn');
	// 	if (arn) {
	// 		return this.oaoService.makeAchPayment(arn, reqData).map(data => data);
	// 	}
	// 	return of([]);
	// }

	_createRequestData(productList, totalAmount, transfertype, internalData?: InternalFunding) {
		return {
			fundingview: <PaymentData>{
				totalamount: totalAmount,
				transfertype: transfertype,
				productlist: productList,
				internalfunding: internalData
			}
			// arn: sessionStorage.getItem('arn'),
			// ...paymentData,
			// membershipdonationamount: donationAmount
		};
	}

	getUIState() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getNextUIState(arn).pipe(map(data => data));
		}
		return of([]);
	}

	validatePlaidAccount(accountBody): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.validatePlaidAccount(arn, accountBody).pipe(map(resp => resp));
		}
	}

	getInstitutionName(routingNumber) {
		return this._http.get('https://www.routingnumbers.info/api/name.json?rn=' + routingNumber);
	}

}
