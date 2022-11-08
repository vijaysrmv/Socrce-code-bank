/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Resume
File Name              :		upload-documents.service.html
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		07/11/2019
Description            :		Upload document service in resume.
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResumeService } from '../../services/resume.service';
import { DocumentService } from '../../../core/apis/document.service';
import { DocumentList } from '../../../core/models/document.model';


@Injectable()
export class UploadDocumentService {

	docListArray = [{
		'pid': 1,
		'applicanttype': 'individual',
		'applicantname': 'Amir Masood',
		'documents': [{
			'doctype': 'abc1',
			'uploaded': false,
			'docid': 0
		}, {
			'doctype': 'xyz1',
			'uploaded': false,
			'docid': 0
		}]
	}, {
		'pid': 2,
		'applicanttype': 'individual',
		'applicantname': 'Dan Brown',
		'documents': [{
			'doctype': 'abc2',
			'uploaded': false,
			'docid': 0
		}, {
			'doctype': 'xyz2',
			'uploaded': false,
			'docid': 0
		}]
	}, {
		'pid': 0,
		'applicanttype': 'business',
		'applicantname': 'Mining & Farming',
		'documents': [{
			'doctype': 'abc0',
			'uploaded': false,
			'docid': 0
		}, {
			'doctype': 'xyz0',
			'uploaded': false,
			'docid': 0
		}]
	}];

	constructor(
		private documentSvc: DocumentService,
		private resumeSvc: ResumeService
	) { }

	saveDocs(documentsDetails) {
		const documentData = this.setDocumentData(documentsDetails);
		return this.documentSvc.saveUploadedDocs(documentData).pipe(map(data => data));
	}

	getTokenFromResume(data): Observable<any> {
		return this.resumeSvc.resumeApplication(data);
	}

	setDocumentData(documentsDetails) {
		const documentData = [];
		const docType = documentsDetails.documenttype;
		const side = documentsDetails.side;
		const holder = 'Primary';
		for (let i = 0; i < documentsDetails.documents.length; i++) {
			const imageData = documentsDetails.documents[i].image;
			const reqData = {
				user: 'portal',
				doctype: docType,
				docpurpose: 'OTHER',
				pagetype: side,
				fileextension: 'JPEG',
				name: `${docType}_${holder}_${i + 1}`,
				data: imageData.split(',')[1],
			};
			documentData.push(reqData);
		}
		return documentData;
	}

	getDocumentList(): Observable<Array<DocumentList>> {
		return this.resumeSvc.getDocumentList();
	}

	uploadDocument(reqData): Observable<{ docid: number }> {
		return this.resumeSvc.uploadDocument(reqData);
	}

	deleteDocument(reqData): Observable<{ message: string }> {
		return this.resumeSvc.deleteDocument(reqData);
	}

	saveDocument(): Observable<{ message: string }> {
		return this.resumeSvc.saveDocument();
	}

	continue(): Observable<{ message: string }> {
		return this.resumeSvc.continue();
	}

}
