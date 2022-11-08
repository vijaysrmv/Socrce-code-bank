
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DocumentService } from '../../../core/apis/document.service';
import { IdScanService } from '../../../core/apis/id-scan.service';
import { ApplicantDetails } from '../../../core/models/application.model';
import { IDSCAN_ID_TYPES } from '../../../core/models/enums';

@Injectable()
export class IdScanComponentService {

	constructor(
		private idScanSvc: IdScanService,
		private _documentSvc: DocumentService
	) { }

	updateDataFromIdScan(nameFront, nameBack, imageFront, imageBack, idtype, holder, pid): Observable<ApplicantDetails | null> {
		const arn = sessionStorage.getItem('arn') ? sessionStorage.getItem('arn') : '';
		const docTypeFront = imageFront.split(',')[0].includes('jpeg') ? 'JPEG' : imageFront.split(',')[0].includes('png') ? 'PNG' : (imageFront.split(',')[0].includes('pdf') ? 'PDF' : '');
		const docTypeBack = imageBack.split(',')[0].includes('jpeg') ? 'JPEG' : imageBack.split(',')[0].includes('png') ? 'PNG' : (imageBack.split(',')[0].includes('pdf') ? 'PDF' : '');
		const urlFront = imageFront.split(',')[1];
		const urlBack = imageBack.split(',')[1];
		const req = {
			arn: arn,
			documentType: IDSCAN_ID_TYPES[idtype],
			applicanttype: holder,
			pid: pid,
			images: [{
				data: urlFront,
				fileextension: docTypeFront,
				name: `${holder}_id_front`,
				filename: nameFront.split('.')[0],
				pagetype: '0',
				user: 'Portal'
			}, {
				data: urlBack,
				fileextension: docTypeBack,
				name: `${holder}_id_back`,
				filename: nameBack.split('.')[0],
				pagetype: '1',
				user: 'Portal'
			}]
		};

		return this.idScanSvc.getDetailsFromIdScan(req).pipe(map((data) => {
			return <ApplicantDetails | null>data;
		}));
	}

	deleteDoc(id: string) {
		return this._documentSvc.deleteConsumerDoc(id);
	}

}
