/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        data.services.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        22/01/2019
Description            :        Service to manage application data
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PageLoaderService } from '../components/page-loader/page-loader.service';

import { CurrentState } from '../models/current-state.model';
import { UserApplications } from '../models/resume.model';
import { Stepper } from '../models/stepper.model';

const initialState: Stepper = {
	name: 'Test name',
	index: 0,
	personalStepper: 'businessDeposit'
};


@Injectable()
export class DataService {

	private section = new BehaviorSubject('');
	private applications = new BehaviorSubject({ arninfo: [], firstname: '', lastname: '' });
	private standardizeAddress = new BehaviorSubject({});
	private stepper = new BehaviorSubject<Stepper>(initialState);
	private currentState = new BehaviorSubject<CurrentState>({ accountType: '', page: '' });
	private resumeCheck = new BehaviorSubject(false);
	// private saveReviewSection = new BehaviorSubject(true);
	// private isOLB = new BehaviorSubject(false);
	private canResume = new BehaviorSubject({ checkValue: false, resume: false });
	private isZipValid = new BehaviorSubject(true);

	editableSection = this.section.asObservable();
	savedApplications = this.applications.asObservable();
	standardizeCheck = this.standardizeAddress.asObservable();
	stepperStateCheck = this.stepper.asObservable();
	currentStateCheck = this.currentState.asObservable();
	resumePopupInitiator = this.resumeCheck.asObservable();
	// saveSection = this.saveReviewSection.asObservable();
	// isOLBUser = this.isOLB.asObservable();
	canResumeCheck = this.canResume.asObservable();
	zipValidityCheck = this.isZipValid.asObservable();


	constructor(
		@Inject(PageLoaderService) private _pageLoaderSvc: PageLoaderService
	) { }

	changeSection(name: string) {
		this.section.next(name);
	}

	updateSavedApplications(data: UserApplications) {
		this.applications.next(data);
	}

	updateStandarizeAddressStatus(page: string, addressType?: string) {
		const add = page + addressType ? addressType : '';
		const obj = Object.assign(this.standardizeAddress.getValue());
		if (!obj.hasOwnProperty(add)) {
			obj[add] = false;
			this.standardizeAddress.next(obj);
		}
	}

	changeStepper(data: Stepper) {
		this.stepper.next(data);
	}

	updateCurrentState(state: CurrentState) {
		this.currentState.next(state);
	}

	showResumePopup() {
		this._pageLoaderSvc.hide();
		this.resumeCheck.next(true);
	}

	hideResumePopup() {
		this.resumeCheck.next(false);
	}

	// blockSaveInReview() {
	// 	this.saveReviewSection.next(false);
	// }

	// allowSaveInReview() {
	// 	this.saveReviewSection.next(true);
	// }

	changeOlbState(olb: boolean) {
		// this.isOLB.next(olb);
	}

	changeResumeStatus(data: any) {
		this.canResume.next(data);
	}

	updateZipValidityStatus(data: any) {
		this.isZipValid.next(data);
	}

}
