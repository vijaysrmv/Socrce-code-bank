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


import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { DataService } from '../../services/data.service';
import { SessionService } from '../../services/session.service';

import { ERRORLIST } from '../../models/errorList';


@Component({
	selector: 'resume-popup',
	templateUrl: './resume-popup.component.html',
	styleUrls: ['./resume-popup.component.scss']
})
export class ResumePopupComponent implements OnInit {

	@ViewChild('resumeModal', {static: false}) resumeModal: ElementRef;

	private modalRef: BsModalRef;
	message: string;

	constructor(
		private dataSvc: DataService,
		private modalSvc: BsModalService,
		private router: Router,
		private sessionSvc: SessionService
	) {
		this.message = ERRORLIST['ERR-1004'];
	}

	ngOnInit() {
		this.dataSvc.resumePopupInitiator.subscribe((showResume) => {
			if (showResume) {
				this._openModal();
				// } else {
				// 	this._closeModal();
			}
		});
	}

	private _openModal() {
		this.modalRef = this.modalSvc.show(this.resumeModal, { ignoreBackdropClick: true, keyboard: false });
	}

	continueHandler() {
		this.sessionSvc.clearSession();
		this.modalRef.hide();
		this.router.navigate(['resume']);
	}

	exitHandler() {
		this.sessionSvc.clearSession();
		this.modalRef.hide();
	}
}
