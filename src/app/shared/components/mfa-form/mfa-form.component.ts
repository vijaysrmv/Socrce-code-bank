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

import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Questionnaire } from '../../../core/models/questionnaire.model';

@Component({
	selector: 'mfa-form',
	templateUrl: './mfa-form.component.html',
	styleUrls: ['./mfa-form.component.scss']
})
export class MfaFormComponent implements OnInit {

	@Output() clickSubmit = new EventEmitter();
	@ViewChild('mfa', {static: false}) mfaRef: TemplateRef<any>;

	modalRef: BsModalRef;
	questionnarie: Questionnaire;
	referencenbr: String;
	choiceId;
	transunionResponse: any;

	config = {
		keyboard: false,
		backdrop: true,
		ignoreBackdropClick: true
	};
	constructor(private modalService: BsModalService) { }

	ngOnInit() { }

	submitMFA() {
		const question = this.questionnarie.name;
		const quesObj = [];
		const obj = {
			name: question,
			value: this.choiceId
		};
		quesObj.push(obj);
		const sessionsArn = sessionStorage.getItem('arn');
		const quesAnsRequest = {
			authenticationData: quesObj,
			referenceNumber: this.transunionResponse.referencenbr,
			nextRequestState: this.transunionResponse.nextrequeststate,
			iReqDeclined: this.transunionResponse.irequestdeclined,
			arn: sessionsArn
		};
		this.clickSubmit.emit({ request_QA: quesAnsRequest, ref: this });
		// if (this.challengeId && this.challengeId !== 'accessCode') {
		//   this.clickSubmit.emit(this.challengeId);
		// }
	}

	closeModal() {
		this.modalRef.hide();
	}

	showVerificationOptions(data) {
		this.transunionResponse = data;
		this.questionnarie = this.transunionResponse.authenticationquestions[0];
		// this.challengeTypes = challengeTypes.challenge_types;
		// const initialState = {
		//     challengeTypes: challengeTypes.challenge_types
		// };
		this.modalRef = this.modalService.show(this.mfaRef, this.config);
		// this.modalRef.content.clickSubmit.subscribe(value => {
		//     this.modalRef.hide();
		//     this.modalRef = this.modalService.show(this.otpModalRef);
		// });
	}

}
