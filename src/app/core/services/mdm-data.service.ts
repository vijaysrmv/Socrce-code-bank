
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import { AppConfig } from '../../app.config';
import { BackendService } from '../backend/backend.service';


@Injectable()
export class MdmDataService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY + 'mdm/';
	// private API = 'http://137.116.127.59:5000/api/mdm/';

	constructor(
		private _backend: BackendService
	) { }

	getMdmData(table: string) {
		return this._backend.backendRequest(this.API + table, 'get').pipe(map(data => data.body));
	}

	getMdmDataWithParameter(table: string, param?: string) {
		return this._backend.backendRequest(this.API + table + '/' + param, 'get').pipe(map(data => data.body));
	}

	getMdmDataWithAccountType(table: string, accountType: string) {
		return this._backend.backendRequest(`${this.API}${accountType}/${table}`, 'get').pipe(map(data => data.body));
	}

}
