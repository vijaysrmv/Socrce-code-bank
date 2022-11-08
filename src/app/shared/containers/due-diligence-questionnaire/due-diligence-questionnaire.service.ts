/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :		PES
Project/Product        :		Newgen - OAO
Application            :		Newgen Portal
Module                 :		Shared
File Name              :		due-diligence-questionnaire.service.ts
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		21/01/2020
Description            :		due diligence questionnaire service
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { OaoService } from '../../../core/apis/oao.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { DueDiligenceQuestionnaire } from '../../../core/models/due-diligence-questionnaire.model';
import { UI_STATE } from '../../../core/models/enums';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class DueDiligenceQuestionnaireService {

	constructor(
		private _oaoService: OaoService,
		private location: Location,
		private _http: HttpClient
	) {
		// this.questionList = data['default'];
	}

	getConsumerData(): Observable<ApplicationDetails> {
		// return new Observable((obs) => {
		//   obs.next(respQuestionnaire);
		// });
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this._oaoService.getConsumerData(arn);
		}
	}

	getUIState() {
		return UI_STATE[this.location.path().split('/')[2]];
	}

	setQuestionnaireData(questionnaireResponse: any): any {
		const arn = sessionStorage.getItem('arn');
		let appData: ApplicationDetails;
		const questionnaireResponseData: DueDiligenceQuestionnaire[] = questionnaireResponse;
		appData = {
			arn: arn,
			consumerDueDiligence: { questions: questionnaireResponseData },
			uistate: this.getUIState(),
			updateuistate: true
		};
		return appData;
	}

	processNextStepNavigation(questionnaireResponse: Array<DueDiligenceQuestionnaire>): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const appData = this.setQuestionnaireData(questionnaireResponse);
		return this._oaoService.continueDetails(arn, appData);
	}

	processSaveAndExit(questionnaireResponse: Array<DueDiligenceQuestionnaire>): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		const appData = this.setQuestionnaireData(questionnaireResponse);
		return this._oaoService.saveDetails(arn, appData);
	}

	getNextState(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		return this._oaoService.getNextUIState(arn);
	}

	getQuestionList() {
		return this._http.get('./ccf-oao-assets/data/mocks/question-list.json');
	}

}
