
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BackendService } from '../../backend/backend.service';
import { TyfoneResponse, TyfoneDetails } from '../../models/application.model';
import { AppConfig } from '../../../app.config';


@Injectable()
export class TyfoneService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY + 'application/olb/tyfone';
	// private API = 'http://192.168.42.191:8080/api/application/olb/tyfone';

	constructor(
		private _backend: BackendService
	) { }

	getOlbUserData(queryParam: any): Observable<TyfoneResponse> {
		const tyfoneDetails = this.setTyfoneDetails(queryParam);
		return this._backend.backendRequest(this.API, 'post', tyfoneDetails).pipe(map(response => response.body));
	}

	setTyfoneDetails(queryParam: any) {
		let tyfoneDetail: TyfoneDetails;
		tyfoneDetail = {
			type: queryParam['type'],
			cts: queryParam['ctc'],
			details: queryParam['details'],
			signedmsg: queryParam['s']
		};
		return tyfoneDetail;
	}

}
