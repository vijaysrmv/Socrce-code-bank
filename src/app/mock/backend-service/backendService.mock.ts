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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BackendService } from '../../core/backend/backend.service';
import { respBusinessCategory } from './backend-responses/business-category.response';
import { respProducts, respProductById } from './backend-responses/product.response';
import { respIdType } from './backend-responses/id-type.response';
import { respPhoneTypes } from './backend-responses/phone-type.response';
import { respOtp, respValidateOtp, respUniqueness } from './backend-responses/backend-response';

import { Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';

@Injectable()
export class MockBackendService {

	constructor(private http: HttpClient) { }

	// backendRequest(requestTarget: string, requestType: string, requestData) {
	// 	if (requestTarget.endsWith('phonetype')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respPhoneTypes);
	// 		});
	// 	} else if (requestTarget.endsWith('idtype')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respIdType);
	// 		});
	// 	} else if (requestTarget.endsWith('products')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respProducts);
	// 		});
	// 	} else if (requestTarget.endsWith('products/search/productByIds')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respProductById);
	// 		});
	// 	} else if (requestTarget.endsWith('businesscategories')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respBusinessCategory);
	// 		});
	// 	} else if (requestTarget.endsWith('otp')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respOtp);
	// 		});
	// 	} else if (requestTarget.endsWith('/validate/otp/1111')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respValidateOtp);
	// 		});
	// 	}  else if (requestTarget.endsWith('/unique')) {
	// 		return new Observable((observer) => {
	// 			observer.next(respUniqueness);
	// 		});
	// 	}
	// }

	backendRequest(requestTarget, requestType, requestData?, requestParams?): Observable<any> {
		if (requestTarget.endsWith('/unique')) {
			return new Observable((observer) => {
				observer.next(respUniqueness);
			});
		}

		let httpOptions;
		const token = sessionStorage.getItem('token');
		const hashcode = sessionStorage.getItem('hashcode');
		httpOptions = {
			observe: 'response',
			params: requestParams ? requestParams : undefined,
		};

		if (hashcode && token) {
			httpOptions.headers = new HttpHeaders({
				token,
				hashcode,
				'Cache-Control': 'no-store'
			});
		} else if (hashcode) {
			httpOptions.headers = new HttpHeaders({
				hashcode,
				'Cache-Control': 'no-store'
			});
		} else if (token) {
			httpOptions.headers = new HttpHeaders({
				token,
				'Cache-Control': 'no-store'
			});
		}

		if (requestType === 'post' || requestType === 'put') {
			if (!requestData.arn) {
				requestData.arn = UUID.UUID();
				sessionStorage.setItem('arn', requestData.arn);
			}

		}

		switch (requestType) {
			case 'post':
			case 'put':
				return this.http[requestType](requestTarget, requestData, httpOptions);
			case 'delete':
			case 'get':
				return this.http[requestType](requestTarget, httpOptions);
		}
	}

}
