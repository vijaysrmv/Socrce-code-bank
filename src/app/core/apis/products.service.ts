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


import {map} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { Observable ,  of } from 'rxjs';

import { BackendService } from '../backend/backend.service';
import { AppConfig } from '../../app.config';

@Injectable()
export class ProductsService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY;

	constructor(@Inject(BackendService) private _backend: BackendService) { }

	getServicesOffered(): Observable<any> {
		// const arn = sessionStorage.getItem('arn');
		const arn = '92aa2a5f-d6e9-4525-90f8-bd4e7754b6aa';
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/services', 'get').pipe(map(data => {
				if (data.body && data.body.oktopay) {
					data.body.oktopay.overdraft = null;
				}
				return data.body;
			}));
		}
		return of([]);
	}

	saveServicesOffered(reqObj): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'services/' + arn, 'post', reqObj).pipe(map(data => data.body));
		}
		return of([]);
	}

}
