/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Personal Deposit
File Name              :        getting-started.component.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :
Description            :        Component for getting started page of consumer account flow
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { GettingStartedService } from './getting-started.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { CustomValidation } from '../../../core/utility/custom-validations';
import { FormUtilityService } from '../../../core/services/form-utility.service';


@Component({
	selector: 'personal-getting-started',
	templateUrl: './getting-started.component.html',
	styleUrls: ['./getting-started.component.scss'],
	providers: [GettingStartedService]
})
export class GettingStartedComponent implements OnInit {

	gettingStartedForm: FormGroup;
	validZip: boolean;
	disableContinue = true;

	isQ2Login = null;
	zipcodeMask = CustomValidation.zipcodeMask;
	zipCodePattern = CustomValidation.getPattern('numberPattern');
	disclosureSelected = false;

	constructor(
		private service: GettingStartedService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private formUtilityService: FormUtilityService,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit() {
		this.createForm();
		this.pageLoaderSvc.hide();
	}

	createForm() {
		this.gettingStartedForm = new FormGroup({
			zipcode: new FormControl(null, {
				validators: [
					Validators.minLength(5),
					Validators.maxLength(5)
				],
				updateOn: 'blur'
			}),
			onlinecustomer: new FormControl(null, {
				validators: [Validators.required],
				updateOn: 'blur'
			}),
			username: new FormControl('', {
				updateOn: 'blur'
			}),
			password: new FormControl('', {
				updateOn: 'blur'
			})
		});
		this.initializeForm();
	}

	initializeForm() {
		const zipData = JSON.parse(sessionStorage.getItem('zipcode'));
		const onlineCustomer = JSON.parse(sessionStorage.getItem('onlinecustomer'));
		if (zipData !== null && zipData !== undefined) {
			this.gettingStartedForm.patchValue({ onlinecustomer: onlineCustomer, zipcode: zipData['zip5'] });
			this.isQ2Login = false;
		}
		if (onlineCustomer) {
			this.gettingStartedForm.patchValue({ onlinecustomer: onlineCustomer });
			this.isQ2Login = true;
		}
	}

	refreshValidation(event: any) {
		if (event.keyCode === 8) {
			this.validZip = undefined;
		}
	}

	setOnlineCustomer(onlineCustomer) {
		this.isQ2Login = onlineCustomer;
		this.formUtilityService.resetAndClearControlValidations(this.gettingStartedForm.controls.username, true);
		this.formUtilityService.resetAndClearControlValidations(this.gettingStartedForm.controls.password, true);
		this.formUtilityService.resetAndClearControlValidations(this.gettingStartedForm.controls.zipcode, true);
		if (onlineCustomer) {
			this.gettingStartedForm.controls.username.setValidators(Validators.required);
			this.gettingStartedForm.controls.password.setValidators(Validators.required);
			sessionStorage.removeItem('zipcode');
		} else {
			this.gettingStartedForm.controls.zipcode.setValidators(Validators.required);
			sessionStorage.removeItem('username');
			sessionStorage.removeItem('password');
		}
		this.cdr.detectChanges();
	}

	nextStep() {
		this.pageLoaderSvc.show(true, false);
		const validationError = this.formUtilityService.displayValidations(this.gettingStartedForm);
		if (!validationError) {
			const zipcode = this.gettingStartedForm['controls'].zipcode.value;
			const onlinecustomer = this.gettingStartedForm['controls'].onlinecustomer.value;
			sessionStorage.setItem('zipcode', JSON.stringify(zipcode));
			sessionStorage.setItem('onlinecustomer', onlinecustomer);
			this.router.navigate(['/consumer-deposit/select-product']);
			// this.service.getZipData(zipcode).subscribe((response) => {
			// 	if (response && response['zipcode']) {
			// 		sessionStorage.setItem('zipcode', JSON.stringify(response['zipcode']));
			// 		sessionStorage.setItem('onlinecustomer', onlinecustomer);
			// 		this.router.navigate(['/consumer-deposit/select-product']);
			// 	}
			// }, (error) => {
			// 	sessionStorage.removeItem('zipcode');
			// 	sessionStorage.removeItem('onlinecustomer');
			// 	if (error && error.code) {
			// 		switch (error.code) {
			// 			case 2174:
			// 				this.validZip = false;
			// 				this.pageLoaderSvc.hide();
			// 				break;
			// 			case 2173:
			// 			case 2175:
			// 				this.validZip = true;
			// 				this.router.navigate(['/consumer-deposit/finish/unserved-state']);
			// 				break;
			// 			default:
			// 				this.validZip = true;
			// 				throw new ApplicationError('1000');
			// 		}
			// 	} else {
			// 		throw new ApplicationError('1000');
			// 	}
			// });
		} else {
			this.pageLoaderSvc.hide();
		}
	}

	loginUser() {
		const validationError = this.formUtilityService.displayValidations(this.gettingStartedForm);
		if (!validationError) {
			const username = this.gettingStartedForm['controls'].username.value;
			const password = this.gettingStartedForm['controls'].password.value;
			const onlinecustomer = this.gettingStartedForm['controls'].onlinecustomer.value;
			sessionStorage.setItem('onlinecustomer', onlinecustomer);
			sessionStorage.setItem('username', username);
			sessionStorage.setItem('password', password);
		}
	}

	disclosureClick(e) {
		e.preventDefault();
		window.open('./../../../ccf-oao-assets/data/pdf/OnlineAccessAgreementAndDisclosureStatement.pdf', '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
	}

}
