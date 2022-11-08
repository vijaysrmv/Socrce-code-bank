import { MdmService } from './../../../core/apis/mdm.service';
/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :		PES
Project/Product        :		Newgen - OAO
Application            :		Newgen Portal
Module                 :		Shared
File Name              :		due-diligence-questionnaire.component.ts
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		21/01/2020
Description            :		due diligence questionnaire page
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { DueDiligenceQuestionnaireService } from './due-diligence-questionnaire.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { DueDiligenceQuestionnaire } from '../../../core/models/due-diligence-questionnaire.model';
import { BACKEND_ACCOUNT, BACKEND_STATE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';

@Component({
	selector: 'due-diligence',
	templateUrl: './due-diligence-questionnaire.component.html',
	styleUrls: ['./due-diligence-questionnaire.component.scss'],
	providers: [
		DueDiligenceQuestionnaireService
	]
})
export class DueDiligenceQuestionnaireComponent implements OnInit, OnChanges {

	@Input() disableQuestions = false;
	@Output() proceedFund = new EventEmitter();
	@ViewChild('questionnaire', { static: false }) questionnaire: ElementRef;

	consumerData: ApplicationDetails;
	questionsList: any;
	accountType: string;
	fundingPage = false;
	MULTI_SELECT_DROPDOWN_LIMIT = 4;
	sourceFundsList: any;

	constructor(
		private dataService: DataService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private _service: DueDiligenceQuestionnaireService,
		private _mdmService: MdmService
	) { }

	ngOnInit() {
		this.dataService.currentStateCheck.subscribe(resp => {
			this.accountType = resp.accountType;
			this.fundingPage = resp.page === 'accountFunding';
			this.dataService.changeStepper({ name: this.router.url, index: 3, personalStepper: this.accountType });
		});
		if (sessionStorage.getItem('arn')) {
			this.getData();
		} else {
			this.pageLoaderSvc.hide();
			throw new ApplicationError('2016');
		}
	}

	ngOnChanges(changes) {
		// if (changes.disableQuestions) {
		// 	this.disableQuestions = changes.disableQuestions.currentValue;
		// }
	}

	getData() {
		this._service.getConsumerData().subscribe((data: ApplicationDetails) => {
			this._mdmService.getSourceFunds().subscribe(response => {
				this.sourceFundsList = response;
				this._service.getQuestionList().subscribe(resp => {
					this.questionsList = resp;
					this.questionsList[2].answers = this.sourceFundsList;
					if (data.consumerDueDiligence && data.consumerDueDiligence.questions && data.consumerDueDiligence.questions.length > 0) {
						this.questionsList = this.patchData(data.consumerDueDiligence.questions, this.questionsList);
					}
				});
			});
			this.pageLoaderSvc.hide();
		}, () => {
			this.pageLoaderSvc.hide();
		});
	}

	patchData(data, question) {
		let index = data.findIndex(item => item.questionid === '1');
		if (index !== -1) {
			question[0].answertext = data[index].answertext === 'YES' ? true : false;
			if (question[0].answertext) {
				this._setChildVisibility(0, true);
				if (data[1].answertext) {
					question[1].answertext = data[1].answertext === 'YES' ? true : false;
				}
			}
		}

		index = data.findIndex(item => item.questionid === '5');
		if (index !== -1) {
			const temp = data[index].answertext.split(',');
			temp.forEach(str => {
				question[2].answers.forEach(res => {
					if (res.id === str.toLowerCase()) {
						question[2].selectedAnswer.push(res);
					}
				});
				if (str.toLowerCase() === 'other') {
					this._setChildVisibility(2, true);
					const childIndex = data.findIndex(res => res.questionid === '6');
					if (childIndex !== -1) {
						question[3].answertext = data[childIndex].answertext;
						question[3].visible = true;
						question[3].required = true;
						question[3].error = false;
					}
				}
			});
			question[2].limitError = temp.length === 4 ? true : false;
		}

		index = data.findIndex(item => item.questionid === '22');
		if (index !== -1) {
			question[4].answertext = data[index].answertext === 'YES' ? true : false;
		}
		return question;
	}

	saveData() {
		this.pageLoaderSvc.show(true, false);
		let listData: any;
		// this.questionsList =
		listData = this._dataTransform(this.questionsList);
		this._service.processSaveAndExit(listData).subscribe((data: Response) => {
			if (data.statusCode === 200) {
				this.router.navigate(['/' + BACKEND_ACCOUNT[this.accountType] + '/' + BACKEND_STATE['saveAndExit']]);
			} else {
				this.pageLoaderSvc.hide();
			}
		}, error => {
			this.pageLoaderSvc.hide();
			throw new ApplicationError(error.error.code);
		});
	}

	nextStep() {
		const isValid = this._Validate();
		let listData: any;
		if (isValid) {
			this.pageLoaderSvc.show(true, false);
			listData = this._dataTransform(this.questionsList);
			// this.questionsList = this._dataTransform(this.questionsList);
			// this.questionsList.forEach(item => {
			// 	item.answertext = item.answertype === 'Multi' ? this._dataTransform(item) : null;
			// })
			this._service.processNextStepNavigation(listData).subscribe((data: Response) => {
				if (data.statusCode === 200) {
					this._service.getNextState().subscribe((res) => {
						if (res.nextuistate) {
							this.router.navigate(['/' + BACKEND_ACCOUNT[this.accountType] + '/' + BACKEND_STATE[res.nextuistate]]);
						}
					});
				} else {
					this.pageLoaderSvc.hide();
				}
			}, error => {
				this.pageLoaderSvc.hide();
				throw new ApplicationError(error.error.code);
			});
		}
	}

	_Validate() {
		let idForFocus = '';
		this.questionsList.map((x) => {
			if (x.visible) {
				if (x.answertype === 'text') {
					if (!x.answertext) {
						x.error = true;
						idForFocus = x.questionid;
					} else if (x.answertext.length > 50) {
						x.error = true;
						x.max = true;
						idForFocus = x.questionid;
					}
				} else if (x.answertype === 'single') {
					if (x.answertext.length === 0) {
						x.error = true;
						idForFocus = x.questionid;
					}
				} else if (x.answertype === 'multi') {
					if (x.selectedAnswer.length < 1) {
						x.error = true;
						idForFocus = x.questionid;
					}
				}
			}
		});
		if (idForFocus) {
			const el = this.questionnaire.nativeElement.querySelectorAll(`#labelID${idForFocus}`)[0];
			el.scrollIntoView({ behavior: 'smooth' });
		}
		return idForFocus ? false : true;
	}

	_dataTransform(question) {
		const list = [];
		question.forEach(item => {
			if (item.answertype === 'multi') {
				if (item.selectedAnswer.length > 0) {
					let answer = '';
					item.selectedAnswer.forEach(res => {
						if (answer.length === 0) {
							answer = res.id;
						} else {
							answer = answer + ',' + res.id;
						}
					});
					item.answertext = answer;
				}
			}
			if (item.answertype === 'single') {
				item.answertext = item.answertext ? 'YES' : 'NO';
				if (item.questionid === 2 || item.questionid === 22) {
					item.riskflag = item.answertext === 'NO' ? false : true;
				}
			}
			if (item.visible) {
				list.push(item);
			}
		});
		return list;
	}

	checkError(i, obj = false) {
		if (this.questionsList[i].answertype === 'text') {
			if (!this.questionsList[i].answertext) {
				this.questionsList[i].error = true;
			} else {
				this.questionsList[i].error = false;
			}
		}
		// else {
		// 	this.questionsList[i].error = true;
		// 	this.questionsList[i].answers.forEach((ops) => {
		// 		if (ops.selected) {
		// 			this.questionsList[i].error = false;
		// 			const el = this.questionnaire.nativeElement.querySelectorAll(`#remark-${this.questionsList[i].questionid}`)[0];
		// 			if (obj && el.classList.contains('ng-untouched')) {
		// 				el.classList.replace('ng-untouched', 'ng-touched');
		// 			}
		// 			if (ops.needremarks) {
		// 				if (ops.selected && el && el.classList.contains('ng-touched') && !ops.remark) {
		// 					this.questionsList[i].remarkError = true;
		// 				} else {
		// 					this.questionsList[i].remarkError = false;
		// 				}
		// 			}
		// 		} else {
		// 			if (ops.needremarks) {
		// 				ops.remark = '';
		// 				this.questionsList[i].remarkError = false;
		// 			}
		// 		}
		// 	});
		// }
	}

	toggleOptions(index, value) {
		let flag;
		// this.questionsList[index].answertext = value;
		if (value) {
			flag = true;
		} else {
			flag = false;
		}
		this._setChildVisibility(index, flag);
		this.checkError(index);
	}

	_setChildVisibility(index, flag) {
		if (this.questionsList[index].hasChild) {
			const childQues = this.questionsList[index].childQuesId;
			const childIndex = this.questionsList.findIndex(item => {
				return item.questionid === childQues;
			});
			this.questionsList[childIndex].visible = flag;
			this.questionsList[childIndex].required = flag;
			if (!flag) {
				this.questionsList[childIndex].answertext = '';
			}
		}
	}

	_resetChildAnswers(question, visibility) {
		if (!visibility) {
			question.answers.forEach(item => {
				item.selected = false;
				if (item.remark) {
					item.remark = '';
				}
			});
		}
	}

	_resetFundingAnswers() {
		this.questionsList.map(item => {
			this._resetChildAnswers(item, false);
		});
	}

	proceedFunding(section: string) {
		if (this.disableQuestions) {
			// reset answers to all questions and enable them
			this.disableQuestions = false;
			this._resetFundingAnswers();
			this.proceedFund.emit(section);
		} else {
			const isValid = this._Validate();
			if (isValid) {
				// disable questions
				this.disableQuestions = true;
				this.proceedFund.emit(section);
			}
		}
	}

	addMultiSelectedData(question) {
		let currentlySelected;
		let existingSelected;
		question.answers.forEach(item => {
			if (item.id === question.currentlySelected) {
				currentlySelected = item;
			}
		});
		question.selectedAnswer.forEach(item => {
			if (item.id === question.currentlySelected) {
				existingSelected = item;
			}
		});
		if (currentlySelected && !existingSelected) {
			if (question.selectedAnswer.length < this.MULTI_SELECT_DROPDOWN_LIMIT) {
				question.selectedAnswer.push(currentlySelected);
			}
			if (currentlySelected.id === 'other') {
				const index = this.questionsList.findIndex(item => {
					return item.questionid === question.questionid;
				});
				this._setChildVisibility(index, true);
			}
			question.error = false;
		}
		if (question.selectedAnswer.length === this.MULTI_SELECT_DROPDOWN_LIMIT) {
			question.limitError = true;
		}
		question.currentlySelected = '';
	}

	removeMultiSelectedData(question, item) {
		if (item.id === 'other') {
			const index = this.questionsList.findIndex(res => {
				return res.questionid === question.questionid;
			});
			this._setChildVisibility(index, false);
		}
		question.selectedAnswer = question.selectedAnswer.filter(res => res !== item);
		if (question.selectedAnswer.length === 0) {
			question.currentlySelected = {};
			question.error = true;
		}
		if (question.selectedAnswer.length < this.MULTI_SELECT_DROPDOWN_LIMIT) {
			question.limitError = false;
		}
	}

}
