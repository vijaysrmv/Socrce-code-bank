/*------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Resume
File Name              :        resume.service.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        19/02/2019
Description            :        service for resume module backend related operation
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/


import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { BackendService } from '../../core/backend/backend.service';
import { AuthorizationService } from '../../core/services/authorization.service';

import { ApplicationDetails } from '../../core/models/application.model';
import { AppConfig } from '../../app.config';


@Injectable()
export class ResumeService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY;
	// private API = 'http://192.168.42.191:8080/api/';

	constructor(
		private _backend: BackendService,
		@Inject(AuthorizationService) private _auth: AuthorizationService,
	) { }

	checkApplication(applicationData: any): Observable<any> {
		// const obj = [
		//   {'hashcode': '7930DFSDG3432EWRFF435', 'email': 'amir1.masood@newgen.co.in'},
		//   {'hashcode': '793SDFANUIO34Y89543RB', 'email': 'amir2.masood@newgen.co.in'},
		//   {'hashcode': '7930RMGFKNDFKNGKFDNGN', 'email': 'amir3.masood@newgen.co.in'}
		// ];

		const data = <ApplicationDetails>applicationData;
		return this._backend.backendRequest(this.API + 'application/otp', 'post', data).pipe(map(response => response.body));
	}

	// resendOtp(): Observable<any> {
	//   const hashcode = sessionStorage.getItem('hashcode');
	//   return this._backend.backendRequest(this.API + 'application/resend/otp/' + hashcode, 'put').map(response => response.body);
	// }

	// validateOtp(otp: string): Observable<any> {
	//   return this._backend.backendRequest(this.API + 'application/validate/otp/' + otp, 'post').map(response => {
	//     const token = response.headers.get('token');
	//     if (token) {
	//       this._auth.setToken(token);
	//     }
	//     return <UserApplications>response['body'];
	//   });
	// }

	submitHashcode(hashcode: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/otp/hashcode/' + hashcode, 'post').pipe(map(response => response.body));
	}

	resumeApplication(data: Object): Observable<ApplicationDetails> {
		const arn = sessionStorage.getItem('arn');
		return this._backend.backendRequest(this.API + 'application/' + arn + '/resume', 'post', data).pipe(map(response => {
			const token = response.headers.get('token');
			if (token && response.body.arn) {
				this._auth.setToken(token);
				this._auth.setArn(response.body.arn);
			}
			return response;
		}));
	}

	getDocusignUrl(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		// return this._backend.backendRequest(this.API + 'application/' + arn + '/sign', 'get')
		// 	.map(data => data['body'].redirectURI);
		return this._backend.backendRequest(this.API + 'application/' + arn + '/sign', 'get').pipe(map(data => data['body']));
		// return this._backend.backendRequest(this.API + 'docusign/response', 'get')
		//   .map(data => data['body'].redirectURI);
	}

	getDocumentTypes(): Observable<Array<DocumentType> | any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/document/types', 'get').pipe(map(data => data.body));
		}
		return of([]);
	}

	// getAccountFundingPageStatus(): Observable<any> {
	// 	// const obj = [
	// 	// 	{ 'token': '7930DFSDG3432EWRFF435', 'status': 'success' },
	// 	// ];
	// 	const arn = sessionStorage.getItem('arn');
	// 	return this._backend.backendRequest('http://192.168.60.55:8080/api/' + 'application/' + arn + '/plaid/status', 'get').map(data => data.body);
	// }

	getDocumentList(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/communication/hold/documentlist', 'get').pipe(map(data => data.body));
		}
		return of([]);
	}

	uploadDocument(reqData): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/additionaldoc/upload', 'post', reqData).pipe(map(data => data.body));
		}
		return of([]);
	}

	deleteDocument(reqData): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/additionaldoc/delete', 'put', reqData).pipe(map(data => data.body));
		}
		return of([]);
	}

	saveDocument(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/additionaldoc/save', 'put').pipe(map(data => data.body));
		}
		return of([]);
	}

	continue(): Observable<Array<DocumentType> | any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/additionaldoc/continue', 'put').pipe(map(data => data.body));
		}
		return of([]);
	}

}
