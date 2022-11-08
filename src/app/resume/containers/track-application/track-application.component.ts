/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Resume
File Name              :        track-application.component.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        19/02/2019
Description            :        component to capture details to resume pending applications
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IMyDpOptions, IMyInputFieldChanged } from 'mydatepicker';

import { SelectChoiceComponent } from '../../../shared/components/select-choice/select-choice.component';

import { ResumeService } from '../../services/resume.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { SessionService } from '../../../core/services/session.service';
import { CustomValidation } from '../../../core/utility/custom-validations';


@Component({
	selector: 'app-track-application',
	templateUrl: './track-application.component.html',
	styleUrls: ['./track-application.component.scss']
})
export class TrackApplicationComponent implements OnInit {
	@ViewChild(SelectChoiceComponent, {static: false}) selectChoice: SelectChoiceComponent;

	trackForm: FormGroup;
	validationError: boolean;

	disableRetrieve = false;
	onlineLogin = true;
	dobInvalid = false;
	dobError = false;

	dateMask = CustomValidation.dateMask;
	ssnMask = CustomValidation.ssnMask;
	dobOptions: IMyDpOptions = CustomValidation.resumeDobOptions;

	datePattern = CustomValidation.getPattern('datePattern');
	ssnPattern = CustomValidation.getPattern('ssnPattern');

	constructor(
		private resumeService: ResumeService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private session: SessionService,
	) {
		// this.dobOptions.alignSelectorRight = (((window.innerWidth > 0) ? window.innerWidth : screen.width) < 768) ? true : false;
	}

	ngOnInit() {
		this.session.clearSession();
		this.createForm();
		this.pageLoaderSvc.hide();
	}

	createForm() {
		this.trackForm = new FormGroup({
			lastname: new FormControl('', {
				validators: CustomValidation.lastname,
				updateOn: 'blur'
			}),
			dob: new FormControl('', {
				validators: [Validators.required],
				updateOn: 'blur'
			}),
			dobPicker: new FormControl(null),
			ssn: new FormControl('', {
				validators: CustomValidation.ssn,
				updateOn: 'blur'
			}),
		});
		// this.initializeForm();
	}

	onDateChanged(date: IMyInputFieldChanged | any) {
		let field;
		if (date !== null && typeof date === 'object') {
			date = date.formatted;
		}
		const dateValue = new Date(date);
		const datePicker = { date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() } };
		const resetdatePicker = { date: { year: 0, month: 0, day: 0 } };
		let resetPicker: boolean;

		if (!(dateValue instanceof Date) || isNaN(dateValue.getTime()) || dateValue.getFullYear() < 1901) {
			this.dobError = true;
			this.dobInvalid = false;
		} else {
			this.dobError = false;
			// this.dobInvalid = this.formUtilityService.checkDateValidity(date, 'dob');
		}
		field = this.trackForm['controls'].dob;
		// this.dobInvalid ? field.setErrors({ 'incorrect': true }) : field.setErrors(null);
		this.dobError || this.dobInvalid ? field.setErrors({ 'incorrect': true }) : field.setErrors(null);
		this.trackForm.patchValue({ dob: date });
		resetPicker = (this.dobError || this.dobInvalid || !date) ? true : false;
		this.trackForm.patchValue({ dobPicker: resetPicker ? resetdatePicker : datePicker });
	}

	checkValidations() {
		this.validationError = false;
		this.displayValidations(this.trackForm);
		return this.validationError;
	}

	displayValidations(group: any) {
		Object.keys(group.controls).forEach(field => {
			if (group.controls[field]['controls']) {
				this.displayValidations(group.controls[field]);
			} else {
				const control = group.get(field);
				control.markAsTouched(true);
				if (control.errors !== null && this.validationError === false) {
					this.validationError = true;
					control['nativeElement'].focus();
				}
			}
		});
	}

	dateValidation(date: IMyInputFieldChanged) {
		let field;
		field = this.trackForm['controls'].dob;
		if (field && field.value && date.value !== field.value) {
			field.setErrors({ 'invalid': true });
			field.markAsTouched();
		}
	}

	retrieve() {
		const req = this.trackForm.value;
		if (this.checkValidations()) {
			return;
		}
		this.disableRetrieve = true;
		setTimeout(() => {
			this.disableRetrieve = false;
		}, 10000);
		this.pageLoaderSvc.show(true, false);
		if (typeof req.dob === 'object') {
			req.dob = req.dob.formatted;
		}
		const reqObj = {
			'personaldetails': req
		};
		this.resumeService.checkApplication(reqObj).subscribe(data => {
			// this.pageLoaderSvc.hide();
			// if (data.status === '200') {
			if (data && data.length > 1) {
				this.selectChoice.showChoices(data);
			} else {
				this.goForOtpValidation(data[0]);
			}
			// }
		}, error => {
			this.pageLoaderSvc.hide();
			this.disableRetrieve = false;
			throw new ApplicationError(error.error.code);
		});
	}

	goForOtpValidation(data) {
		sessionStorage.setItem('userData', JSON.stringify(this.trackForm.value));
		this.resumeService.submitHashcode(data.hash_code).subscribe(res => {
			if (res.message === 'success') {
				sessionStorage.removeItem('userData');
				sessionStorage.setItem('hashcode', data.hash_code);
				sessionStorage.setItem('linkedEmail', data.email);
				this.router.navigate(['/resume/verify-otp']);
			}
		}, error => {
			throw new ApplicationError(error.error.code);
		});
		// sessionStorage.setItem('userLinkedData', JSON.stringify(data));
	}

	trim(childControl) {
		let trimValue;
		const patchObj = {};
		trimValue = this.trackForm.controls[childControl].value ? this.trackForm.controls[childControl].value.trim() : null;
		patchObj[childControl] = trimValue;
		this.trackForm.patchValue(patchObj);
	}

}
