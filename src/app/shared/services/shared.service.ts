
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from '../../core/backend/backend.service';

import { ApplicationDetails } from '../../core/models/application.model';
import { AppConfig } from '../../app.config';


@Injectable()
export class SharedService {
	private API = AppConfig.settings.API_ENDPOINT_GATEWAY;

	constructor(
		private _backend: BackendService
	) { }

	getConsumerData(arn: string): Observable<ApplicationDetails | any> {
		return this._backend.backendRequest(this.API + 'application/' + arn, 'get').pipe(map(response => response.body));
	}


	getDateByBusinessDays(date, days): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const reqData = { date, days };
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/expecteddate', 'post', reqData).pipe(map(response => response.body));
		}
	}

}
