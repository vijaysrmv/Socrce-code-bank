/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Shared
File Name              :        id-scan.component.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        22/01/2019
Description            :        Id scan component to caputre id details
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';

import { IdScanComponentService } from './id-scan-component.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { UtilityService } from '../../../core/utility/utility.service/utility.service';

import { ApplicantDetails } from '../../../core/models/application.model';

@Component({
	selector: 'app-id-scan',
	templateUrl: './id-scan.component.html',
	styleUrls: ['./id-scan.component.scss'],
	providers: [
		IdScanComponentService
	]
})
export class IdScanComponent implements OnInit {

	@Input() idscantype: string;
	@Input() index: number;
	@Input() holderType: string;
	@Input() jointCount: number;
	@Input() pid: number;

	@Output() getDetails = new EventEmitter();

	@ViewChild('idFront', { static: false }) idFront: ElementRef;
	@ViewChild('idBack', { static: false }) idBack: ElementRef;
	imgerror = false;
	imgrequired = false;
	passportID = false;

	ids = {
		FRONT: {
			img: '',
			id: '',
			name: '',
		},
		BACK: {
			img: '',
			id: '',
			name: '',
		}
	};

	constructor(
		private util: UtilityService,
		private svc: IdScanComponentService,
		private pageLoaderSvc: PageLoaderService
	) {
		this.index = this.index === null || this.index === undefined ? 0 : 1;
	}

	ngOnInit() { }

	idScanTypeChange() {
		this.passportID = this.idscantype === 'PS' ? true : false;
		this.clearImage('FRONT');
		this.clearImage('BACK');
	}

	onUploadImage(event, side: string, field?) {
		// console.log(this.idscantype);
		const target = event ? event.target : field;
		const targetValue = target.value;
		const img = target.files[0];
		if (targetValue === '') {
			this.imgrequired = true;
			this.clearImage(side);
			return;
		} else if (event.target.files[0]) {
			if (!(img.type.includes('jpeg') || img.type.includes('png')) || img.size > (4 * 1024 * 1024) || img.type.includes('pdf')) {
				this.clearImage(side);
				this.imgerror = true;
				this.imgrequired = false;
				return;
			} else {
				this.imgerror = false;
				this.imgrequired = false;
				this.util.readUploadedFileAsUrl(event.target.files[0]).subscribe((dataUrl) => {
					this.ids[side].id = '';
					this.ids[side].img = dataUrl;
					this.ids[side].name = img.name;
					const imgFront = this.ids.FRONT.img;
					const imgBack = this.ids.BACK.img;
					const nameFront = this.ids.FRONT.name;
					const nameBack = this.ids.FRONT.name;
					if (imgFront !== '' && imgBack !== '') {
						// if (imgFront !== '' && imgBack !== '' && this.idscantype !== 'OTHERS') {
						this.pageLoaderSvc.show(true, false);
						this.svc.updateDataFromIdScan(nameFront, nameBack, imgFront, imgBack, this.idscantype, this.holderType, this.pid).subscribe((data: ApplicantDetails | null) => {
							this.getDetails.emit({
								id: this.index,
								data
							});
						}, error => {
							this.clearImage('FRONT');
							this.clearImage('BACK');
							this.pageLoaderSvc.hide();
							if (error.error.code === 2194) {
								throw new ApplicationError('1016');
							} else {
								throw error;
							}
						});
					}
				}, error => {
					throw error;
				});
			}
		}
	}

	clearImage(side: string) {
		// this.pageLoaderSvc.show(true, false);
		const target = side === 'FRONT' ? this.idFront.nativeElement : this.idBack.nativeElement;
		// if (this.ids[side].id !== '') {
		//   const id = this.ids[side]['id'];
		//   this.svc.deleteDoc(id).subscribe(status => {
		//     if (status) {
		//       target.value = '';
		//       this.ids[side].img = '';
		//       this.ids[side].id = '';
		//     }
		//   });
		// } else {
		target.value = '';
		this.ids[side].img = '';
		// }
		// this.pageLoaderSvc.hide();
	}

	displayValidations(validationError) {
		// let validationError = false;
		if (this.imgerror || !(this.idscantype && this.ids.FRONT.img && this.ids.BACK.img)) {
			if (!this.imgerror) {
				this.imgrequired = true;
			}
			// this.idFront.nativeElement.focus();
			if (validationError === false) {
				validationError = true;
				// uncomment this code if you want others as option
				// const idElRef = document.getElementById('others-' + this.index);
				// if (idElRef) {
				// 	idElRef.focus();
				// }
			}
			throw new ApplicationError('1006');
			// throw new Error('Please provide an identification document.');
		}
		return validationError;
	}

}

