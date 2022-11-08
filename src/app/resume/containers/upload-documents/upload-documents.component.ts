/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Resume
File Name              :		upload-documents.component.html
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		07/11/2019
Description            :		Upload document page in resume
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { UploadDocumentService } from './upload-document.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { UtilityService } from '../../../core/utility/utility.service/utility.service';

import { BACKEND_STATE } from '../../../core/models/enums';


@Component({
	selector: 'app-upload-documents',
	templateUrl: './upload-documents.component.html',
	styleUrls: ['./upload-documents.component.scss'],
	providers: [
		UploadDocumentService
	]
})
export class UploadDocumentsComponent implements OnInit {

	// uploadDocumentForm: FormGroup;
	// uploadDocumentArray: Array<number> = [0];
	// numberOfDocument = 1;
	// selectedImages: Array<any> = [];
	documentList: any;
	imgerror = false;
	validationError = false;
	continueClicked = false;

	constructor(
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private util: UtilityService,
		private uploadDocSvc: UploadDocumentService,
	) { }

	ngOnInit() {
		// this._getToken();
		this._getDocumentList();
	}

	// private _getToken() {
	// 	const data = { arns: sessionStorage.getItem('arns') };
	// 	this.uploadDocSvc.getTokenFromResume(data).subscribe(() => {
	// 		this._getDocumentList();
	// 	});
	// }

	private _getDocumentList() {
		this.uploadDocSvc.getDocumentList().subscribe(data => {
			this.documentList = data;
			this.pageLoaderSvc.hide();
		}, error => {
			this.pageLoaderSvc.hide();
		});
	}

	removeImage(parentIndex, childIndex) {
		this.pageLoaderSvc.show(true, false);
		this._prepareDataAndDelete(parentIndex, childIndex).subscribe(res => {
			if (res.message === 'success') {
				this.documentList[parentIndex].documents[childIndex]['image'] = '';
				this.documentList[parentIndex].documents[childIndex]['docid'] = 0;
			}
			this.pageLoaderSvc.hide();
		}, error => {
			this.pageLoaderSvc.hide();
		});
	}

	onUploadImage(event, parentIndex, childIndex) {
		this.pageLoaderSvc.show(true, false);
		const target = event.target;
		const targetValue = target.value;
		const img = target.files[0];
		if (targetValue === '') {
			this.pageLoaderSvc.hide();
			// this.removeImage(parentIndex, childIndex);
			return;
		} else if (img) {
			if (!(img.type.includes('jpeg') || img.type.includes('png') || img.type.includes('pdf')) || img.size > (5 * 1024 * 1024)) {
				this.imgerror = true;
				this.pageLoaderSvc.hide();
				return;
			}
			this.imgerror = false;
			this.util.readUploadedFileAsUrl(img).subscribe((dataUrl) => {
				const docId = this.documentList[parentIndex].documents[childIndex]['docid'];
				if (docId && docId !== 0) {
					this._prepareDataAndDelete(parentIndex, childIndex).subscribe(res => {
						if (res.message === 'success') {
							this._prepareDataAndUpload(parentIndex, childIndex, dataUrl).subscribe(data => {
								this._setDataAfterUpload(parentIndex, childIndex, data, img, dataUrl);
							}, error => {
								this.pageLoaderSvc.hide();
								throw new ApplicationError(error.error.code);
							});
						}
					}, error => {
						this.pageLoaderSvc.hide();
						throw new ApplicationError(error.error.code);
					});
				} else {
					this._prepareDataAndUpload(parentIndex, childIndex, dataUrl).subscribe(data => {
						this._setDataAfterUpload(parentIndex, childIndex, data, img, dataUrl);
						this._validate();
					}, error => {
						this.pageLoaderSvc.hide();
						throw new ApplicationError(error.error.code);
					});
				}
			});
		}
	}

	_setDataAfterUpload(parentIndex, childIndex, data, img, dataUrl) {
		if (data.docid) {
			this.documentList[parentIndex].documents[childIndex]['docid'] = data.docid;
		}
		if (img.type.includes('pdf')) {
			this.documentList[parentIndex].documents[childIndex]['isPdf'] = true;
		} else {
			this.documentList[parentIndex].documents[childIndex]['isPdf'] = false;
		}
		this.documentList[parentIndex].documents[childIndex]['image'] = dataUrl;
		this.pageLoaderSvc.hide();
	}

	_prepareDataAndUpload(parentIndex, childIndex, dataUrl) {
		const imageData = dataUrl;
		let fileExt = 'JPEG';
		if (imageData.split(',')[0].includes('pdf')) {
			fileExt = 'PDF';
		}
		const applicantType = this.documentList[parentIndex].applicanttype;
		const pid = this.documentList[parentIndex].pid;
		const doctype = this.documentList[parentIndex].documents[childIndex].doctype;

		const reqData = {
			arn: sessionStorage.getItem('arn'),
			applicanttype: applicantType,
			pid: pid,
			doctype: doctype,
			docpurpose: 'ADDITIONAL_DOCUMENT',
			pagetype: 'FRONT',
			fileextension: fileExt,
			name: `${doctype}${applicantType}${pid}`,
			data: imageData.split(',')[1]
		};
		return this.uploadDocSvc.uploadDocument(reqData);
	}

	_prepareDataAndDelete(parentIndex, childIndex) {
		const applicantType = this.documentList[parentIndex].applicanttype;
		const pid = this.documentList[parentIndex].pid;
		const doctype = this.documentList[parentIndex].documents[childIndex].doctype;
		const docId = this.documentList[parentIndex].documents[childIndex].docid;

		const reqData = {
			arn: sessionStorage.getItem('arn'),
			applicanttype: applicantType,
			pid: pid,
			doctype: doctype,
			docpurpose: 'ADDITIONAL_DOCUMENT',
			docid: docId
		};
		return this.uploadDocSvc.deleteDocument(reqData);
	}

	_validate() {
		this.validationError = false;
		this.documentList.forEach((obj) => {
			if (obj.documents.length > 0) {
				obj.documents.forEach((item) => {
					if (item.docid === 0) {
						this.validationError = true;
					}
				});
			}
		});
		if ((!this.continueClicked && this.validationError) || (this.continueClicked && !this.validationError)) {
			this.validationError = this.validationError && this.continueClicked;
		}
		return this.validationError;
	}

	_removeDocsBeforeExit() {
		const deleteCallsArray = [];
		this.documentList.forEach((obj, i) => {
			if (obj.documents.length > 0) {
				obj.documents.forEach((item, j) => {
					if (item.docid !== 0) {
						deleteCallsArray.push(this._prepareDataAndDelete(i, j));
					}
				});
			}
		});
		return deleteCallsArray;
	}

	saveData() {
		this.uploadDocSvc.saveDocument().subscribe((data) => {
			if (data.message === 'success') {
				this.router.navigate(['resume/' + BACKEND_STATE['documentUploadExit']]);
			}
		}, error => {
			this.pageLoaderSvc.hide();
			throw new ApplicationError(error.error.code);
		});
	}

	onExit() {
		this.pageLoaderSvc.show(true, false);
		const deleteDocsCall = this._removeDocsBeforeExit();
		if (deleteDocsCall.length > 0) {
			const observable = forkJoin(deleteDocsCall);
			observable.subscribe(result => {
				this.saveData();
			}, error => {
				console.log(error);
				// this.pageLoaderSvc.hide();
				// throw new ApplicationError('1000');
			});
		} else {
			this.saveData();
		}
		// this.router.navigate(['resume/' + BACKEND_STATE['documentUploadExit']]);
	}

	nextStep() {
		this.pageLoaderSvc.show(true, false);
		this._validate();
		if (!this.validationError) {
			this.uploadDocSvc.continue().subscribe((data) => {
				if (data.message === 'success') {
					this.router.navigate(['resume/' + BACKEND_STATE['documentUploadSuccess']]);
					// sessionStorage.removeItem('arn');
					this.pageLoaderSvc.hide();
				}
			}, error => {
				this.pageLoaderSvc.hide();
				throw new ApplicationError(error.error.code);
			});
		} else {
			this.pageLoaderSvc.hide();
		}
	}

}
