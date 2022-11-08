
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {map} from 'rxjs/operators';

import { BackendService } from '../backend/backend.service';

import { AppConfig } from '../../app.config';
import { DocResponse } from '../models/application.model';
import { UPLOAD_ID_TYPES } from '../models/enums';
import { Response } from '../models/response';

@Injectable()
export class DocumentService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY;
	// private API = 'http://192.168.93.116:8080/api/';

	constructor(
		private _backend: BackendService
	) { }

	getConsumerData(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn, 'get').pipe(map(response => response.body));
	}

	getConsumerDoc(applicantType, pid): Observable<DocResponse | any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/documents/' + applicantType + '/' + pid, 'get').pipe(map(response => response.body));
		}
		return of([]);
	}

	getBusinessdocTypeList() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/documentlist', 'get').pipe(map(response => response.body));
		}
		return of([]);
	}

	saveDocs(ids, idtype, holder, pid): Observable<any> {
		let saveDocs = false;
		const reqData = [];
		if (idtype) {
			for (const key in ids) {
				if (ids[key].id) {
					saveDocs = false;
					break;
				} else {
					let requestBody = {};
					requestBody = this._setSaveDocRequest(ids[key].img, idtype, key, holder, pid);
					if (requestBody['data']) {
						reqData.push(requestBody);
						saveDocs = true;
					} else {
						saveDocs = false;
					}
				}
			}
		}
		if (saveDocs) {
			return this.saveUploadedDocs(reqData);
		} else {
			return of([]);
		}
	}

	deleteConsumerDoc(docId): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._backend.backendRequest(this.API + 'application/' + arn + '/document/' + docId, 'delete').pipe(map(response => response.body));
		}
		return of([]);
	}

	continueDetails(arn: string, applicationData): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/continue', 'put', applicationData).pipe(map(data => <any>{ statusCode: data.status, message: data.statusText }));
	}

	skipDetails(arn: string, applicationData): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/skip', 'put', applicationData).pipe(map(data => <any>{ statusCode: data.status, message: data.statusText }));
	}

	saveDetails(arn: string, applicationData): Observable<Response> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/save', 'put', applicationData).pipe(map(data => <Response>{ statusCode: data.status, message: data.statusText }));
	}

	saveDetailsOnBack(arn: string, applicationData): Observable<Response> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/accounts/saveOnBack', 'put', applicationData).pipe(map(data => <Response>{ statusCode: data.status, message: data.statusText }));
	}

	getUIState(arn: string): Observable<any> {
		return this._backend.backendRequest(this.API + 'application/' + arn + '/uistate', 'get').pipe(map(response => response.body));
	}

	saveUploadedDocs(requestData): Observable<any> {
		const requestBody = {};
		const arn = sessionStorage.getItem('arn');
		requestBody['applicationdocuments'] = requestData;
		requestBody['arn'] = arn;
		// requestBody['applicanttype'] = holder;
		// requestBody['pid'] = pid;
		return this._backend.backendRequest(this.API + 'application/' + arn + '/document', 'post', requestBody).pipe(map(data => data));
	}

	private _setSaveDocRequest(imageUri, idType, side, holder, pid) {
		// const arn = sessionStorage.getItem('arn');
		const reqData = {
			// arn: arn,
			applicanttype: holder,
			pid: pid,
			user: 'portal',
			doctype: UPLOAD_ID_TYPES[idType],
			docpurpose: 'IDSCAN',
			pagetype: side,
			fileextension: 'JPEG',
			name: `${UPLOAD_ID_TYPES[idType]}_${holder}_${side}`,
			data: imageUri.split(',')[1],
		};
		return reqData;
	}

}
