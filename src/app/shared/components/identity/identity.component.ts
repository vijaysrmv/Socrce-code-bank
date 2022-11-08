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

import { Component, OnInit, ViewChild, EventEmitter, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { Questionnaire } from '../../../core/models/questionnaire.model';

@Component({
	selector: 'identity-form',
	templateUrl: './identity.component.html',
	styleUrls: ['./identity.component.scss'],
	providers: []
})
export class IdentityComponent implements OnInit {

	@ViewChild('businessIdentity', {static: false}) businessIdentityRef: TemplateRef<any>;
	@Output() clickContinue = new EventEmitter();

	questionnarie: Array<Questionnaire>;
	questionnaireForm: FormGroup;
	modalRef: BsModalRef;
	mobileViewQuestion: Questionnaire;
	showMobileNext = true;
	showMobileContinue = false;
	showMobilePrevious = false;
	mobileQuesIndex = 1;
	transunionResponse: any;

	constructor(
		private modalService: BsModalService
	) { }

	ngOnInit() { }

	handleContinue() {
		const quesResponse = this.questionnaireForm.value;
		const quesObj = [];
		Object.keys(quesResponse).forEach((resQues) => {
			const obj = {
				name: resQues,
				value: quesResponse[resQues],
				sequence: 0
			};
			quesObj.push(obj);
		});
		quesObj.forEach(ques => {
			this.questionnarie.forEach(quesList => {
				if (ques.name === quesList.name) {
					ques.sequence = quesList.sequence;
					return;
				}
			});
		});
		// const sessionsArn = sessionStorage.getItem('arn');
		const quesAnsRequest = {
			authenticationData: quesObj,
			transId: this.transunionResponse.transId,
			quizId: this.transunionResponse.quizId,
			nextRequestState: this.transunionResponse.nextrequeststate
		};
		this.clickContinue.emit({ request_QA: quesAnsRequest, ref: this });
	}

	createQuestionnaireForm(questionnarie) {
		this.questionnaireForm = new FormGroup({});
		for (const ques of questionnarie) {
			const control: FormControl = new FormControl(null, Validators.required);
			this.questionnaireForm.addControl(ques.name, control);
		}
	}

	openModal() {
		this.showMobileNext = true;
		this.showMobileContinue = false;
		this.mobileViewQuestion = this.questionnarie[0];
		this.createQuestionnaireForm(this.questionnarie);
		this.modalRef = this.modalService.show(this.businessIdentityRef, { ignoreBackdropClick: true, keyboard: false });
	}

	closeModal() {
		this.modalRef.hide();
	}

	showTransunionQues(data) {
		this.transunionResponse = data;
		this.questionnarie = this.transunionResponse.authenticationquestions;
		this.openModal();
	}

	handleNextQuestion() {
		const that = this;
		let nextQuesindex: number;
		this.questionnarie.forEach(function (ques, index) {
			if (that.mobileViewQuestion.name === ques.name && index < that.questionnarie.length) {
				nextQuesindex = index + 1;
				if (nextQuesindex <= that.questionnarie.length - 1) {
					that.showMobileNext = nextQuesindex === that.questionnarie.length - 1 ? false : true;
					that.showMobileContinue = nextQuesindex === that.questionnarie.length - 1 ? true : false;
					that.showMobilePrevious = true;
					that.mobileQuesIndex = nextQuesindex + 1;
				}
			}
		});
		this.mobileViewQuestion = this.questionnarie[nextQuesindex];
	}

	handlePrevQuestion() {
		const that = this;
		let prevQuesindex: number;
		this.questionnarie.forEach(function (ques, index) {
			if (that.mobileViewQuestion.name === ques.name && index < that.questionnarie.length) {
				prevQuesindex = index - 1;
				if (prevQuesindex >= 0) {
					that.showMobileNext = true;
					that.showMobileContinue = false;
					that.showMobilePrevious = prevQuesindex === 0 ? false : true;
					that.mobileQuesIndex = prevQuesindex + 1;
				}
			}
		});
		this.mobileViewQuestion = this.questionnarie[prevQuesindex];
	}

}
