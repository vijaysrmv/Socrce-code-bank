/*--------------------------------------------------------------------------------------------------------
NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Business deposit
File Name              :		upload-documents.service.ts
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		11/10/2019
Description            :		Upload document service in business deposit
-------------------------------------------------------------------------------------------------------
CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import { OaoService } from './../../../core/apis/oao.service';
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable ,  of } from 'rxjs';

import { DocumentService } from '../../../core/apis/document.service';

import { ApplicationDetails, DocResponse } from '../../../core/models/application.model';
import { APPLICANT_TYPE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';


@Injectable()
export class UploadDocumentService {

	constructor(
		private documentSvc: DocumentService,
		private oaoService: OaoService
	) { }

	getBusinessdocTypeList() {
		return this.documentSvc.getBusinessdocTypeList().pipe(map(data => data));
	}

	getConsumerData(): Observable<ApplicationDetails> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.documentSvc.getConsumerData(arn);
		}
	}

	fetchDocs(applicantType, pid): Observable<DocResponse> {
		return this.documentSvc.getConsumerDoc(applicantType, pid);
	}

	deleteConsumerDoc(docIds): Observable<any> {
		let retObs;
		docIds.forEach(id => {
			if (retObs) {
				retObs = retObs.concatMap(() => {
					return this.documentSvc.deleteConsumerDoc(id);
				});
			} else {
				retObs = this.documentSvc.deleteConsumerDoc(id);
			}
		});
		return retObs ? retObs : of([]);
	}

	setDocumentData(documentsDetails) {
		const documentData = [];
		// const docType = documentsDetails.documenttype;
		// const side = documentsDetails.side;
		// const holder = 'Primary';
		for (let i = 0; i < documentsDetails.documents.length; i++) {
			if (documentsDetails.documents[i].image) {
				const imageData = documentsDetails.documents[i].image;
				let fileExt = 'JPEG';
				if (imageData.split(',')[0].includes('pdf')) {
					fileExt = 'PDF';
				}
				const reqData = {
					pid: 1,
					applicanttype: APPLICANT_TYPE['businessApplicant'],
					user: 'portal',
					doctype: documentsDetails.documents[i].doctype,
					docpurpose: 'MANDATORY_DOCS',
					pagetype: 'FRONT',
					fileextension: fileExt,
					name: `${documentsDetails.documents[i].doctype}`,
					data: imageData.split(',')[1],
				};
				documentData.push(reqData);
			}
		}
		return documentData;
	}

	saveDocs(documentsDetails) {
		const documentData = this.setDocumentData(documentsDetails);
		if (documentData.length > 0) {
			return this.documentSvc.saveUploadedDocs(documentData).pipe(map(data => data));
		} else {
			return of([]);
		}
	}

	_setApplicationData(arn) {
		return {
			arn: arn,
			applicationtype: 'businessDeposit',
			uistate: 'documentUpload',
			updateuistate: false
		};
	}

	processBack(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const applicationData = this._setApplicationData(arn);
		return new Observable((observer) => {
			return this.documentSvc.saveDetailsOnBack(arn, applicationData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	processSaveAndExit(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const applicationData = this._setApplicationData(arn);
		return new Observable((observer) => {
			return this.documentSvc.saveDetails(arn, applicationData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					observer.next('success');
				} else {
					observer.next('failure');
				}
			});
		});
	}

	continueDetails(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const applicationData = this._setApplicationData(arn);
		applicationData.updateuistate = true;
		return this.documentSvc.continueDetails(arn, applicationData).pipe(map(response => response));
	}

	skipDetails(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const applicationData = this._setApplicationData(arn);
		applicationData.updateuistate = true;
		return this.documentSvc.skipDetails(arn, applicationData).pipe(map(response => response));
	}

	getNextState(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		return this.documentSvc.getUIState(arn);
	}

	getDocusignUrl() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getDocusignUrl(arn).pipe(map(data => data));
		}
		return of([]);
	}

}
