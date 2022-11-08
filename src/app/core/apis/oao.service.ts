/*------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Consumer OAO
File Name              :        oao.service.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        25/01/2019
Description            :        service to lookafter oao related actions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from '../backend/backend.service';
import { AuthorizationService } from '../services/authorization.service';

import { ApplicationDetails } from '../models/application.model';
import { AdditionalOptions, DeleteApplicant, FundingData } from '../models/oao-request-data.model';
import { Response } from '../models/response';
import { TransunionResponse } from '../models/transunion.model';

import { AppConfig } from '../../app.config';


@Injectable()
export class OaoService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY;
	// private API = 'http://192.168.93.100:8080/api/';

	constructor(
		private _backend: BackendService,
		@Inject(AuthorizationService) private _auth: AuthorizationService,
	) { }

	getCDRateStructure(amount: number): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/cdrate/' + amount, 'get').pipe(map(response => response.body));
	}

	checkUniqueness(arn: string, applicationData: ApplicationDetails): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/unique', 'put', applicationData).pipe(map(response => response));
	}

	continueDetails(arn: string, applicationData: ApplicationDetails): Observable<Response> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/continue', 'put', applicationData).pipe(map(data => <Response>{ statusCode: data.status, message: data.statusText }));
	}

	saveDetails(arn: string, applicationData: ApplicationDetails): Observable<Response> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/save', 'put', applicationData).pipe(map(data => <Response>{ statusCode: data.status, message: data.statusText }));
	}

	saveDetailsOnBack(arn: string, applicationData: ApplicationDetails): Observable<Response> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/saveOnBack', 'put', applicationData).pipe(map(data => <Response>{ statusCode: data.status, message: data.statusText }));
	}

	deleteApplicant(arn: string, reqData: DeleteApplicant): Observable<Response> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/delete', 'put', reqData).pipe(map(response => response));
	}

	getConsumerData(arn: string): Observable<ApplicationDetails | any> {
		return this._backend.backendRequest(this.API + 'application/' + arn, 'get').pipe(map(response => response.body));
	}

	createApplication(applicationData: any): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/accounts/init', 'post', applicationData).pipe(map(response => {
			const token = response.headers.get('token');
			if (token && response.body.arn) {
				this._auth.setToken(token);
				this._auth.setArn(response.body.arn);
			}
			this._auth.setArn(response.body.arn);
			return response['body'];
		}));
	}

	// createOlbApplication(applicationData: any): Observable<any> {
	// 	return this._backend.backendRequest(this.API + 'application/olb/tyfone/init', 'post', applicationData).map(response => {
	// 		const token = response.headers.get('token');
	// 		if (token && response.body.arn) {
	// 			this._auth.setToken(token);
	// 			this._auth.setArn(response.body.arn);
	// 		}
	// 		this._auth.setArn(response.body.arn);
	// 		return response['body'];
	// 	});
	// }

	getServicesOffered(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/services', 'get').pipe(map(data => data));
	}

	saveServicesOffered(arn: string, reqObj): Observable<any> {
		return this._backend.backendRequest(this.API + 'services/' + arn, 'post', reqObj).pipe(map(data => data.body));
	}

	getNextUIState(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/uistate', 'get').pipe(map(response => response.body));
	}

	getDisclosures(arn: string): Observable<Array<any>> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/disclosures', 'get').pipe(map(data => data.body));
	}

	reviewContinue(arn: string): Observable<TransunionResponse> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/review', 'post').pipe(map(data => data));
	}

	idaQuestion(arn: string): Observable<TransunionResponse> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/idaQuestion', 'get').pipe(map(data => data.body));
	}

	idaAnswerView(arn: string, reqData: any): Observable<TransunionResponse> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/idaAnswerView', 'post', reqData).pipe(map(response => response.body));
	}

	iRequest(arn: string): Observable<TransunionResponse> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/iRequest', 'get').pipe(map(data => data));
	}

	aRequest(arn: string, reqData: any): Observable<TransunionResponse> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/aRequest', 'post', reqData).pipe(map(data => data));
	}

	setAdditionalOptions(arn: string, reqObj: AdditionalOptions): Observable<any> {
		reqObj['arn'] = arn;
		return this._backend.backendRequest(this.API + 'application/' + arn + '/additionaloptions', 'put', reqObj).pipe(map(data => data.body));
	}

	getDocusignUrl(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/sign', 'get').pipe(map(data => data['body']));
	}

	downloadDisclosure(arn: string, url: string): Observable<string> {
		return this._backend.backendRequest(`${this.API}application/${arn}/disclosures/${url}`, 'post', null).pipe(map(response => response.body));
	}

	downloadAllDisclosures(arn: string): Observable<string> {
		return this._backend.backendRequest(`${this.API}application/${arn}/disclosures/download`, 'post', null).pipe(map(response => response.body));
	}

	// generateHashCode(personaldetails: any): Observable<any> {
	// 	return this._backend.backendRequest(this.API + 'application/accounts/membership', 'post', personaldetails).map(response => response.body);
	// }

	// getDatafromHashCode(hashcode: any): Observable<any> {
	// 	return this._backend.backendRequest(this.API + 'application/accounts/' + hashcode + '/memberdetails', 'get').map(response => response.body);
	// }

	submitContactForm(contactdetails: any): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/accounts/lead', 'post', contactdetails).pipe(map(response => response.body));
	}

	sendResponseFromDocusign(arn: string, event: string, envelopeId: string, docusignId: string) {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/callback/' + event + '/envelope/' + envelopeId + '/docusignId/' + docusignId, 'get').pipe(
			map(data => data['body']));
	}

	getToken(reqData: any) {
		return this._backend.backendRequest(this.API + 'application/envelope/token', 'post', reqData).pipe(map(response => {
			const token = response.headers.get('token');
			if (token) {
				this._auth.setToken(token);
			}
			return response.body;
		}));
	}

	makeAchPayment(arn: string, reqObj: FundingData): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/ach', 'post', reqObj).pipe(map(data => data.body));
	}

	makeInternalPayment(arn: string, reqObj: FundingData): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/internaltransfer', 'post', reqObj).pipe(map(data => data.body));
	}

	makeCheckPayment(arn: string, reqObj: FundingData): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/checktransfer', 'post', reqObj).pipe(map(data => data.body));
	}

	makeZeroPayment(arn: string, reqObj: FundingData): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/zeroamounttransfer', 'post', reqObj).pipe(map(data => data.body));
	}

	getPaymentSessionToken(arn: string, requestBody: any) {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/elavon', 'post', requestBody).pipe(map(data => data.body));
	}

	postFundingAction(arn: string, requestBody: any) {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/postelavonfunding', 'post', requestBody).pipe(map(response => response.body));
	}

	logout(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/logout', 'put').pipe(map(response => response.body));
	}

	getPlaidAccountid(arn: string, reqObj: any): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/plaid', 'post', reqObj).pipe(map(response => response.body));
	}

	validatePlaidAccount(arn: string, accountBody: any): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/ach', 'post', accountBody).pipe(map(response => response.body));
	}

	discardFunding(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/funding/discard', 'put').pipe(map(response => response.body));
	}

	getHarlandClarkeUrl(arn: string, requestBody: any): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/harland/order/checks', 'post', requestBody).pipe(map(response => response.body));
	}

	getSelectedProductsDetails(arn: string) {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/products', 'get').pipe(map(data => data.body));
	}

	getExistingAccounts(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/existingaccounts', 'get').pipe(map(data => data.body));
	}

	getPlaidAccessToken(arn: string): Observable<any> {
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/plaid/validateMicrodeposits/newPublicToken', 'post').pipe(map(data => data.body));
		}
	}

	saveFundingQuestionnaire(arn: string, requestBody: any) {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/funding/additionaldetails/save', 'put', requestBody).pipe(map(response => response.body));
	}

	getDateByBusinessDays(arn: string, requestBody: any): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/expecteddate', 'post', requestBody).pipe(map(response => response.body));
	}

	getOrderCheckResponse(arn: string, requestBody: any): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/order/checks', 'post', requestBody).pipe(map(response => response.body));
	}

}
