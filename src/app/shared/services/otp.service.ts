
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from '../../core/backend/backend.service';

import { UserApplications } from '../../core/models/resume.model';
import { AuthorizationService } from '../../core/services/authorization.service';

import { AppConfig } from '../../app.config';

@Injectable()
export class OtpService {
	private API = AppConfig.settings.API_ENDPOINT_GATEWAY;
	constructor(
		private _backend: BackendService,
		private _auth: AuthorizationService,
	) { }

	resendOtp(): Observable<any> {
		const hashcode = sessionStorage.getItem('hashcode');
		return this._backend.backendRequest(this.API + 'application/resend/otp/' + hashcode, 'put').pipe(map(response => response.body));
	}

	validateOtp(otp: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/validate/otp/' + otp, 'post').pipe(map(response => {
			const token = response.headers.get('token');
			if (token) {
				this._auth.setToken(token);
			}
			return <UserApplications>response['body'];
		}));
	}
}
