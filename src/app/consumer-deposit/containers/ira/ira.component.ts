/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Personal Deposit
File Name              :        ira.component.component.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :
Description            :        Component for ira questions
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { FormUtilityService } from '../../../core/services/form-utility.service';
import { CustomValidation } from '../../../core/utility/custom-validations';


@Component({
	selector: 'app-ira',
	templateUrl: './ira.component.html',
	styleUrls: ['./ira.component.scss']
})
export class IraComponent implements OnInit {

	consumerForm: FormGroup;

	phoneMask = CustomValidation.phoneMask;
	phonePattern = CustomValidation.getPattern('phoneNumberPattern');

	bestDayToReach = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	bestTimeToReach = ['9am-12pm', '12pm-3pm', '3pm-5pm'];
	selectedTimetoReach = [];
	selectedDaytoReach = [];
	interests: any[] = [];
	interestsError = false;
	validationError: boolean;
	isDaySelected = false;
	isTimeSelected = false;

	constructor(
		private _pageLoaderSvc: PageLoaderService,
		private formUtilityService: FormUtilityService
	) { }

	ngOnInit() {
		this._pageLoaderSvc.hide();
		this._createForm();
	}

	private _createForm() {
		this.consumerForm = new FormGroup({
			memberOfColarado: new FormControl('', {
				validators: Validators.required,
				updateOn: 'blur'
			}),
			firstname: new FormControl('', {
				validators: CustomValidation.firstname,
				updateOn: 'blur'
			}),
			middlename: new FormControl('', {
				validators: CustomValidation.middlename,
				updateOn: 'blur'
			}),
			lastname: new FormControl('', {
				validators: CustomValidation.lastname,
				updateOn: 'blur'
			}),
			phonenumber: new FormControl('', {
				validators: CustomValidation.primaryphonenumber,
				updateOn: 'blur'
			}),
			email: new FormControl('', {
				validators: CustomValidation.email,
				updateOn: 'blur'
			}),
			retirementoptions: new FormControl('', {
				validators: Validators.required,
				updateOn: 'blur'
			}),
			// openaccount: new FormControl('', {
			//   validators: Validators.required,
			//   updateOn: 'blur'
			// }),
			// existingira: new FormControl('', {
			//   validators: Validators.required,
			//   updateOn: 'blur'
			// }),
			// contributions: new FormControl('', {
			//   validators: Validators.required,
			//   updateOn: 'blur'
			// }),
			// distribution: new FormControl('', {
			//   validators: Validators.required,
			//   updateOn: 'blur'
			// }),
			// investmentoptions: new FormControl('', {
			//   validators: Validators.required,
			//   updateOn: 'blur'
			// }),
			// miscellaneous: new FormControl('', {
			//   validators: Validators.required,
			//   updateOn: 'blur'
			// }),
			comments: new FormControl('', {
				validators: Validators.required,
				updateOn: 'blur'
			}),
		});
	}

	submitIRAForm() {
		this.validationError = this.checkIRAformValidity();
		if (!this.validationError) {
			// console.log('Valid');
		}
	}
	checkIRAformValidity() {
		this.validationError = false;
		const formData = this.consumerForm.getRawValue();
		formData.interests = this.interests;
		formData.bestTimeToReach = this.selectedTimetoReach;
		formData.bestDayToReach = this.selectedDaytoReach;
		this.isDaySelected = this.selectedDaytoReach.length > 0 ? false : true;
		this.isTimeSelected = this.selectedTimetoReach.length > 0 ? false : true;
		this.interestsError = this.interests.length > 0 ? false : true;
		this.validationError = this.formUtilityService.displayValidations(this.consumerForm, this.validationError) || this.isDaySelected || this.isTimeSelected || this.interestsError;
		return this.validationError;
	}

	setbestTimeToReach(value: string) {
		const index = this.selectedTimetoReach.findIndex(option => {
			return option === value;
		});
		index === -1 ? this.selectedTimetoReach.push(value) : this.selectedTimetoReach.splice(index, 1);
		this.isTimeSelected = this.selectedTimetoReach.length > 0 ? false : true;
	}

	setbestDayToReach(value: string) {
		const index = this.selectedDaytoReach.findIndex(option => {
			return option === value;
		});
		index === -1 ? this.selectedDaytoReach.push(value) : this.selectedDaytoReach.splice(index, 1);
		this.isDaySelected = this.selectedDaytoReach.length > 0 ? false : true;
	}

	toggleInterests(question: string, answer: string) {
		// if (this.interests.includes(answer)) {
		const index = this.interests.findIndex(option => {
			return option.question === question && option.selected === answer;
		});
		if (index === -1) {
			this.interests.push({ question: question, selected: answer });
		} else {
			this.interests.splice(index, 1);
		}
		this.interestsError = this.interests.length > 0 ? false : true;
	}

}
