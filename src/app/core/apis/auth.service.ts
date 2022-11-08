
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AppConfig } from '../../app.config';

@Injectable()
export class AuthService {

	constructor(
		private _http: HttpClient
	) { }

	generateOtpForBackOffice(uuid: string, uuidEncrypted: string): Observable<string> {
		let httpOptions;
		httpOptions = {
			headers: new HttpHeaders().set('uuidEncrypted', uuidEncrypted),
			observe: 'response'
		};
		// httpOptions.headers = new HttpHeaders({
		//   uuidEncrypted
		// });

		return this._http.post(`${AppConfig.settings.API_ENDPOINT_GATEWAY}application/verify/link/${uuid}`, null, httpOptions).pipe(map(data => data['body']['otp']));
	}

}
