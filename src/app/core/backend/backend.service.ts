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

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';


@Injectable()
export class BackendService {

	constructor(private http: HttpClient) { }

	backendRequest(requestTarget, requestType, requestData?, requestParams?): Observable<any> {
		let httpOptions;
		const token = sessionStorage.getItem('token');
		const hashcode = sessionStorage.getItem('hashcode');
		const trustevSessionId = sessionStorage.getItem('trustevsessionid');
		const userData = JSON.parse(sessionStorage.getItem('userData'));
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
		} else if (trustevSessionId && token) {
			httpOptions.headers = new HttpHeaders({
				token,
				trustevSessionId,
				'Cache-Control': 'no-store'
			});
		} else if (token) {
			httpOptions.headers = new HttpHeaders({
				token,
				'Cache-Control': 'no-store'
			});
		} else if (trustevSessionId) {
			httpOptions.headers = new HttpHeaders({
				trustevSessionId,
				'Cache-Control': 'no-store'
			});
		} else if (userData) {
			httpOptions.headers = new HttpHeaders({
				'lastName': userData.lastname,
				'dob': userData.dob,
				'ssn': userData.ssn,
				'Cache-Control': 'no-store'
			});
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
