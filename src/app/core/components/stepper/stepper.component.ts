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

import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { DataService } from '../../../core/services/data.service';


@Component({
	selector: 'app-stepper',
	templateUrl: './stepper.component.html',
	styleUrls: ['./stepper.component.scss'],
})

export class StepperComponent implements OnInit, OnChanges {

	@Input() stepperIndex: string;
	@Input() personalStepper: string;

	currentStepIndex: number;
	personalDepositStepperList = [
		{ index: 1, name: 'Select Accounts', stepper: false },
		{ index: 2, name: 'Personal Details', stepper: false },
		{ index: 3, name: 'Review and Approve', stepper: false },
		{ index: 4, name: 'Account Funding', stepper: false },
		{ index: 5, name: 'Finish', stepper: false }
	];
	businessDepositStepperList = [
		{ index: 1, name: 'Select Accounts', stepper: false },
		{ index: 2, name: 'Business Details', stepper: false },
		{ index: 3, name: 'Personal Details', stepper: false },
		{ index: 4, name: 'Review and Approve', stepper: false },
		{ index: 5, name: 'Finish', stepper: false },
		// { index: 4, name: 'Upload Documents', stepper: false },
		// { index: 5, name: 'Business Disclosure', stepper: false },
	];
	stepperList = []; // = this.personalStepperList;

	constructor() { }

	ngOnInit() { }

	setStepperList(value: string) {
		switch (value) {
			case 'consumerDeposit':
				this.stepperList = this.personalDepositStepperList;
				break;
			case 'businessDeposit':
				this.stepperList = this.businessDepositStepperList;
				break;
			default:
				this.stepperList = [];
		}
	}

	getStepperWidth() {
		if (this.stepperList !== undefined && this.stepperList.length !== 0) {
			return (100 / this.stepperList.length) + '%';
		}
	}

	ngOnChanges(changeObj) {
		if (changeObj.personalStepper && changeObj.personalStepper.previousValue !== changeObj.personalStepper.currentValue) {
			this.setStepperList(changeObj.personalStepper.currentValue);
		}
		if (changeObj.stepperIndex && changeObj.stepperIndex.previousValue !== changeObj.stepperIndex.currentValue) {
			this.currentStepIndex = changeObj.stepperIndex.currentValue;
			for (const step of this.stepperList) {
				step.stepper = step.index <= this.currentStepIndex ? true : false;
			}
		}
	}

}
