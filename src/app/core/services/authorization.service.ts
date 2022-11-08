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

import { BackendService } from '../backend/backend.service';

import { environment } from '../../../environments/environment';
import { AppConfig } from '../../app.config';


@Injectable()
export class AuthorizationService {
	duration: number;
	interval: any;
	refreshUrl = AppConfig.settings.API_ENDPOINT_GATEWAY + 'application/';

	constructor(
		@Inject(BackendService) private _backend: BackendService
	) { }

	setToken(token: string): void {
		sessionStorage.setItem('token', token);

		this.interval = setInterval(() => {
			clearInterval(this.interval);
			this.refreshToken();
		}, environment.TOKEN_TIMEOUT);
	}

	// this._session.clearSession();

	setArn(arn: string): void {
		sessionStorage.setItem('arn', arn);
	}

	setSession(wiDetails: Object): void {
		sessionStorage.setItem('wiDetails', JSON.stringify(wiDetails));
	}

	refreshToken(): void {
		const arn = (sessionStorage.getItem('arn') && sessionStorage.getItem('arn') !== null) ? sessionStorage.getItem('arn') : undefined;
		if (arn) {
			const url = this.refreshUrl + arn + '/refresh';
			this._backend.backendRequest(url, 'post').subscribe((response: any) => {
				const token = response.headers.get('token');
				if (token) {
					this.setToken(token);
				}
			});
		}
	}

	checkActivityStatus() {
		// check for inactivity
	}

	setStorageForStaff(zipData) {
		const obj = {
			city: zipData['city'],
			state: zipData['state'],
			zip5: zipData['zipcode']
		};
		sessionStorage.setItem('zipcode', JSON.stringify(obj));
	}

}
