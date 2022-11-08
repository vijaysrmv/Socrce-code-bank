/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen OAO
Application            : 		    Newgen OAO
Module                 :		    Consumer OAO
File Name              : 		    beneficiary-details.component.ts
Author                 : 		    Amir Masood
Date (DD/MM/YYYY)      : 		    29/01/2019
Description            : 		    beneficiary detail component
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, Input, EventEmitter, Output, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMyInputFieldChanged, IMyDpOptions } from 'mydatepicker';

import { BeneficiaryDetailsService } from './beneficiary-details.service';
import { UspsService } from '../../../core/apis/usps.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from './../../../core/services/data.service';
import { FormUtilityService } from '../../../core/services/form-utility.service';
import { ModalBoxService } from './../../../shared/services/modal-box.service';
import { SharedMdmService } from '../../../shared/services/shared-mdm.service';

import { ApplicationDetails, ApplicantDetails, BeneficiaryDetails } from '../../../core/models/application.model';
import { BACKEND_STATE } from '../../../core/models/enums';
import { Relationship, States } from '../../../core/models/fields-value.model';
import { ZipDetails } from '../../../core/models/usps-response.model';
import { AppConstants } from '../../../core/utility/app.constants';
import { CustomValidation } from '../../../core/utility/custom-validations';


@Component({
	selector: 'app-beneficiary-details',
	templateUrl: './beneficiary-details.component.html',
	styleUrls: ['./beneficiary-details.component.scss'],
	providers: [BeneficiaryDetailsService]
})
export class BeneficiaryDetailsComponent implements OnInit, AfterViewInit {

	@Input() reviewPage = false;
	@Output() save = new EventEmitter();
	@Output() patchBeneficiary = new EventEmitter();
	@Output() deleteBeneficiary = new EventEmitter();

	MAX_COUNT = AppConstants.maxConsumerBeneficiaries;
	beneficiaryForm: FormGroup = this.benFormBuilder.group({
		beneficiaryList: this.benFormBuilder.array([])
	});
	beneficiaryManager = [];
	consumerData: ApplicationDetails;
	savedBeneficiaryData: ApplicantDetails;

	relationshipList: Array<Relationship>;
	allStates: Array<States>;
	zipCode: Array<string> = [];

	editableSection: string;
	beneficiaryFormCount: number;
	beneficiaryDobInvalid: boolean;
	isZipValid = false;

	dobOptions: IMyDpOptions = CustomValidation.dobOptions;
	beneficiarySsnValidations = CustomValidation.beneficiaryssn;

	dateMask = CustomValidation.dateMask;
	ssnMask = CustomValidation.ssnMask;
	phoneMask = CustomValidation.phoneMask;
	zipcodeMask = CustomValidation.zipcodeMask;
	datePattern = CustomValidation.getPattern('datePattern');
	ssnPattern = CustomValidation.getPattern('ssnPattern');
	phonePattern = CustomValidation.getPattern('phoneNumberPattern');
	zipCodePattern = CustomValidation.getPattern('numberPattern');

	// ageRange = 'adult';
	showConfirmationModal = false;
	indexToBeDeleted: number;
	toggledIndex: number = null;
	interval: any;

	private ssnSubscriptions: Array<Subscription> = [];

	constructor(
		private beneficiaryDetailsSvc: BeneficiaryDetailsService,
		private benFormBuilder: FormBuilder,
		private dataService: DataService,
		private formUtilityService: FormUtilityService,
		private modalBoxService: ModalBoxService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private sharedMdm: SharedMdmService,
		private usps: UspsService
	) { }

	ngOnInit() {
		this.dataService.changeStepper({ name: '/consumer-deposit/beneficiary-details', index: 2, personalStepper: 'consumerDeposit' });
		this.dataService.editableSection.subscribe(section => {
			this.editableSection = section;
		});
		this._getInitialFieldData();
		if (sessionStorage.getItem('arn')) {
			this.getData();
		}
		this.dataService.zipValidityCheck.subscribe(isZipValid => {
			if (isZipValid) {
				this.isZipValid = true;
			} else {
				this.isZipValid = false;
				if (this.interval) {
					clearInterval(this.interval);
					this.interval = '';
				}
			}
		});
	}

	ngAfterViewInit() {
		this.patchBeneficiary.emit(this);
	}

	private _getInitialFieldData() {
		if (this.sharedMdm.beneficiaryRelations && this.sharedMdm.beneficiaryRelations.length > 0) {
			this.relationshipList = this.sharedMdm.beneficiaryRelations;
		} else {
			this.sharedMdm.getRelationship().subscribe((data: Array<Relationship>) => {
				this.relationshipList = data;
			});
		}
		if (this.sharedMdm.allStates && this.sharedMdm.allStates.length > 0) {
			this.allStates = this.sharedMdm.allStates;
		} else {
			this.sharedMdm.getStates().subscribe((data: Array<States>) => {
				this.allStates = data;
			});
		}
	}

	getData() {
		this.beneficiaryDetailsSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
			this.consumerData = data;
			if (data.jointdetails) {
				if (!this.modalBoxService.getJointCount()) {
					this.modalBoxService.setJointCount(data.jointdetails.length);
				}
			}
			if (data.beneficiarydetails) {
				if (!this.modalBoxService.getBeneficiaryCount()) {
					if (data.beneficiarydetails.length === 0) {
						this.modalBoxService.setBeneficiaryCount(1);
					} else {
						this.modalBoxService.setBeneficiaryCount(data.beneficiarydetails.length);
					}
				}
				this.initializeBeneficaryForm();
				this.patchData(data);
			} else {
				if (!this.modalBoxService.getBeneficiaryCount()) {
					this.modalBoxService.setBeneficiaryCount(1);
				}
				this.initializeBeneficaryForm();
			}
		}, (error) => {
			this.pageLoaderSvc.hide();
			// console.log(error);
		});
	}

	initializeBeneficaryForm() {
		this.getBeneficiaryFormCount();
		this.createBeneficiaryForm();
		this._initReview();
	}

	getBeneficiaryFormCount() {
		this.beneficiaryFormCount = this.modalBoxService.getBeneficiaryCount();
	}

	createBeneficiaryForm() {
		const beneficiaryFormArray = this.beneficiaryForm.get('beneficiaryList') as FormArray;
		for (let count = 0; count < this.beneficiaryFormCount; count++) {
			const pid = count + 1;
			beneficiaryFormArray.push(this.pushFormControl(pid));
			const ssnSubscription = this.observeSsn(count);
			if (ssnSubscription) {
				this.ssnSubscriptions.push(ssnSubscription);
			}
		}
		if (!this.reviewPage) {
			this.pageLoaderSvc.hide();
		}
	}

	pushFormControl(pid) {
		return this.benFormBuilder.group({
			pid: new FormControl(pid),
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
			dob: new FormControl('', { updateOn: 'blur' }),
			dobPicker: new FormControl(null),
			ssn: new FormControl('', {
				validators: this.beneficiarySsnValidations,
				updateOn: 'blur'
			}),
			primaryphonenumber: new FormControl('', {
				validators: CustomValidation.benificiaryprimaryphonenumber,
				updateOn: 'blur'
			}),
			// numberandstreet: new FormControl('', {
			// 	validators: CustomValidation.beneficiarymailingAddress,
			// 	updateOn: 'blur'
			// }),
			// aptorsuite: new FormControl('', {
			// 	validators: CustomValidation.aptorsuite,
			// 	updateOn: 'blur'
			// }),
			// zipcode: new FormControl('', {
			// 	validators: CustomValidation.beneficiaryzipcode,
			// 	updateOn: 'blur'
			// }),
			// city: new FormControl('', {
			// 	validators: CustomValidation.beneficiarycity,
			// 	updateOn: 'blur'
			// }),
			// state: new FormControl(''),
			relationship: new FormControl('', [Validators.required])
		});
	}

	private observeSsn(index: number) {
		if (index >= 0) {
			const formArray = this.beneficiaryForm.get('beneficiaryList') as FormArray;
			return formArray.controls[index].get('ssn').valueChanges.subscribe((value) => {
				setTimeout(() => {
					for (let i = 0; i < formArray.length; i++) {
						const ssnList = this._createSsnList(i);
						// if (value) {
						// 	formArray.controls[i].get('ssn').setErrors(null);
						// }
						const currVal = formArray.getRawValue()[i].ssn;
						if (currVal) {
							if (ssnList.includes(currVal)) {
								formArray.controls[i].get('ssn').setErrors({ 'duplicateSsn': true });
							} else if (formArray.controls[i].get('ssn').hasError('duplicateSsn')) {
								formArray.controls[i].get('ssn').setErrors(null);
								formArray.controls[i].get('ssn').setValidators(this.beneficiarySsnValidations);
							}
						} else {
							formArray.controls[i].get('ssn').setValidators(this.beneficiarySsnValidations);
						}
					}
				}, 10);
			});
		}
		return null;
	}

	_createSsnList(index): Array<string> {
		const beneficiaryList = this.beneficiaryForm.getRawValue().beneficiaryList;
		const ssnList = [];
		if (this.consumerData && this.consumerData.personaldetails && this.consumerData.personaldetails.ssn) {
			ssnList.push(this.consumerData.personaldetails.ssn);
		}
		if (this.consumerData && this.consumerData.jointdetails && this.consumerData.jointdetails.length) {
			const jointList = this.consumerData.jointdetails;
			for (let i = 0; i < jointList.length; i++) {
				if (jointList[i].ssn) {
					ssnList.push(jointList[i].ssn);
				}
			}
		}
		if (beneficiaryList && beneficiaryList.length) {
			beneficiaryList.forEach(item => {
				if (beneficiaryList[index].pid !== item.pid) {
					if (item.ssn) {
						ssnList.push(item.ssn);
					}
				}
			});
		}
		return ssnList;
	}

	_initReview() {
		this.beneficiaryManager = [];
		let editContentValue = true;
		if (this.reviewPage) {
			editContentValue = false;
		}

		for (let i = 0; i < this.beneficiaryFormCount; i++) {
			this.beneficiaryManager.push({
				editContent: editContentValue,
				beneficiaryDobError: false,
				beneficiaryDobInvalid: false
			});
		}
	}

	patchData(data: ApplicationDetails) {
		this.beneficiaryForm.controls.beneficiaryList.patchValue(data.beneficiarydetails);
		data.beneficiarydetails.forEach((beneficiary, index) => {
			this.zipCode[index] = beneficiary.zipcode ? beneficiary.zipcode : '';
		});
		const uistate = sessionStorage.getItem('uistate');
		if (uistate !== 'reviewInProgress') {
			this.pageLoaderSvc.hide();
		}
	}

	toggleSection(index: number) {
		this.beneficiaryManager[index].editContent = !this.beneficiaryManager[index].editContent;
	}

	toggleSectionEdit(section, index) {
		if (this.toggledIndex === null || this.toggledIndex === index) {
			switch (this.editableSection) {
				case '':
					this.toggleSection(index);
					this.savedBeneficiaryData = this.beneficiaryForm.controls.beneficiaryList['controls'][index].getRawValue();
					this.toggledIndex = index;
					this.dataService.changeSection(section);
					break;
				case section:
					this.beneficiaryForm.controls.beneficiaryList['controls'][index].patchValue(this.savedBeneficiaryData);
					this.toggleSection(index);
					this.beneficiaryForm.markAsPristine();
					this.beneficiaryForm.markAsUntouched();
					this.savedBeneficiaryData = null;
					this.toggledIndex = null;
					this.dataService.changeSection('');
					break;
				default:
					throw new ApplicationError('1001');
			}
		} else {
			throw new ApplicationError('1001');
		}
	}

	refreshForm(index) {
		this.dataService.changeSection('');
		this.toggledIndex = null;
		this.savedBeneficiaryData = null;
		this.toggleSection(index);
	}

	saveData(index) {
		const dataObj = {
			accounttype: 'beneficiary',
			form: this,
			index: index
		};

		if (!this.interval) {
			this.interval = setInterval(() => {
				if (this.isZipValid) {
					clearInterval(this.interval);
					this.interval = '';
					this.save.emit(dataObj);
				}
			}, 1000);
		}
	}

	getBeneficiaryFormDetails() {
		const beneficiaryDetails: BeneficiaryDetails[] = this.beneficiaryForm.controls['beneficiaryList'].value;
		beneficiaryDetails.forEach((beneficiary) => {
			if (beneficiary.relationship) {
				const relationshipObj = this.relationshipList.find(relation => relation.id === parseInt(beneficiary.relationship, 10));
				if (relationshipObj && relationshipObj.value) {
					beneficiary.memberrelationvalue = relationshipObj.value;
				}
			}
		});
		return beneficiaryDetails;
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		const beneficiaryDetails: BeneficiaryDetails[] = this.getBeneficiaryFormDetails();
		if (this.formUtilityService.displayValidationsonBack(this.beneficiaryForm)) {
			this.pageLoaderSvc.hide();
			throw Error('1014');
		}
		this.beneficiaryDetailsSvc.processBack(beneficiaryDetails).subscribe((result) => {
			if (result === 'success') {
				if (this.consumerData.jointdetails && this.consumerData.jointdetails.length > 0) {
					const jointCount = this.consumerData.jointdetails.length;
					const pid = this.consumerData.jointdetails[jointCount - 1].pid ;
					sessionStorage.setItem('pid', pid.toString());
					this.router.navigate(['/consumer-deposit/joint-details']);
				} else {
					this.router.navigate(['/consumer-deposit/personal-details']);
				}
			}
		});
	}

	saveDataAndExit() {
		this.pageLoaderSvc.show(true, false);
		const beneficiaryDetails: BeneficiaryDetails[] = this.getBeneficiaryFormDetails();
		this.beneficiaryDetailsSvc.processSaveAndExit(beneficiaryDetails).subscribe((result) => {
			if (result === 'success') {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE['saveAndExit']]);
			} else {
				this.pageLoaderSvc.hide();
			}
		});
	}

	checkValidations() {
		const validationError = this.formUtilityService.displayValidations(this.beneficiaryForm, false);
		return validationError;
	}

	nextStep() {
		const validationError = this.checkValidations();
		if (!validationError) {
			this.pageLoaderSvc.show(true, false);
			const beneficiaryDetails: BeneficiaryDetails[] = this.getBeneficiaryFormDetails();
			this.beneficiaryDetailsSvc.processNextStepNavigation(beneficiaryDetails).subscribe((result) => {
				if (result === 'success') {
					const nextState = 'review';
					this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[nextState]]);
				}
			});
		}
	}

	private _getDobInvalidity(date: any): boolean {
		if (date.length !== 10 || this.formUtilityService.checkManualDateValidity(date)) {
			return true;
		}
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const dob = new Date(date).getTime();
		if (currentDate - dob >= 0) {
			return false;
		}
		return true;
		// let age: any = new Date(currentDate - dob);
		// age = (age.getFullYear() - 1970);
		// if (age >= 18) {
		// 	return false;
		// }
		// return true;
	}

	onDateChanged(date: IMyInputFieldChanged | any, fieldName: string, index: number) {
		let field;
		let resetPicker: boolean;
		// let isDateInvalid = false;
		if (!date) {
			return;
		}
		if (date !== null && typeof date === 'object') {
			date = date.formatted;
		}
		// const dateValue = date ? new Date(date) : new Date();
		const dateValue = new Date(date);
		const datePicker = { date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() } };
		const resetdatePicker = { date: { year: 0, month: 0, day: 0 } };

		// isDateInvalid = this.formUtilityService.checkDateValidity(date, fieldName);
		switch (fieldName) {
			case 'beneficiaryDob':
				// this.beneficiaryManager[index].beneficiaryDobInvalid = this._getDobInvalidity(date);
				field = this.beneficiaryForm.controls['beneficiaryList']['controls'][index]['controls'].dob;
				this.beneficiaryForm.controls['beneficiaryList']['controls'][index].patchValue({ dob: date });
				if ((date) && (!(dateValue instanceof Date) || isNaN(dateValue.getTime()) || dateValue.getFullYear() < 1901) || this._getDobInvalidity(date)) {
					this.beneficiaryManager[index].beneficiaryDobError = true;
					this.beneficiaryManager[index].beneficiaryDobInvalid = false;
					field.setErrors({ 'incorrect': true });
				} else if (this.beneficiaryManager[index].beneficiaryDobInvalid && field.value) {
					this.beneficiaryManager[index].beneficiaryDobError = false;
					field.setErrors({ 'incorrect': true });
				} else {
					this.beneficiaryManager[index].beneficiaryDobError = false;
					this.beneficiaryManager[index].beneficiaryDobInvalid = false;
				}
				resetPicker = (this.beneficiaryManager[index].beneficiaryDobInvalid || this.beneficiaryManager[index].beneficiaryDobError || !date) ? true : false;
				this.beneficiaryForm.controls['beneficiaryList']['controls'][index].patchValue({ dobPicker: resetPicker ? resetdatePicker : datePicker });
				break;
		}
	}

	dateValidation(date: IMyInputFieldChanged, fieldName: string, index: number) {
		let field;
		switch (fieldName) {
			case 'beneficiaryDob':
				field = this.beneficiaryForm.controls['beneficiaryList']['controls'][index]['controls'].dob;
				break;
		}
		if (field && field.value && date.value !== field.value) {
			// field.setErrors({ 'invalid': true });
			field.markAsTouched();
		}
	}

	onFocusSsn(index: number) {
		if (this.beneficiaryForm.controls['beneficiaryList']['controls'][index].getRawValue().ssn) {
			this.beneficiaryForm.controls['beneficiaryList']['controls'][index].patchValue({ ssn: '' });
		}
	}

	addBeneficiaryApplicant() {
		const beneficiaryFormArray = this.beneficiaryForm.get('beneficiaryList') as FormArray;
		const pid = this.createPid(beneficiaryFormArray);
		beneficiaryFormArray.push(this.pushFormControl(pid));
		this.beneficiaryManager.push({
			editContent: true,
			beneficiaryDobInvalid: false
		});
		this.modalBoxService.setBeneficiaryCount(this.modalBoxService.getBeneficiaryCount() + 1);
		this.getBeneficiaryFormCount();
		this.checkDuplicateSsn(this.consumerData.personaldetails.ssn);
		const ssnSubscription = this.observeSsn(beneficiaryFormArray.length - 1);
		if (ssnSubscription) {
			this.ssnSubscriptions.push(ssnSubscription);
		}
	}

	createPid(beneficiary: FormArray) {
		if (!beneficiary.length) {
			return 1;
		} else {
			return (beneficiary.controls[beneficiary.length - 1].get('pid').value + 1);
		}
	}

	checkDuplicateSsn(ssn: any) {
		this.beneficiarySsnValidations = [...this.beneficiarySsnValidations, CustomValidation.ssnDuplicateToPrimary(ssn.toString())];
		this.beneficiaryForm.controls.beneficiaryList['controls'].forEach((beneFormObj: AbstractControl) => {
			beneFormObj.get('ssn').setValidators(this.beneficiarySsnValidations);
		});
	}

	openConfirmationModal(index) {
		this.showConfirmationModal = true;
		this.indexToBeDeleted = index;
	}

	deleteForm(event) {
		if (event) {
			this.pageLoaderSvc.show(true, false);
			this.removeBeneficiary(this.indexToBeDeleted);
		}
		this.showConfirmationModal = false;
	}

	removeBeneficiary(index: number) {
		let removeBeneficiaryFromServer = false;
		const pid = this.getPid(index);
		if (this.consumerData && this.consumerData.beneficiarydetails) {
			Object.keys(this.consumerData.beneficiarydetails).forEach(key => {
				if (this.consumerData.beneficiarydetails[key].pid === pid) {
					removeBeneficiaryFromServer = true;
				}
			});
		}
		if (removeBeneficiaryFromServer) {
			this.beneficiaryDetailsSvc.processDelete(pid).subscribe((response) => {
				if (response.message === 'success') {
					if (this.reviewPage) {
						if (this.beneficiaryManager[index].editContent) {
							this.toggleSectionEdit('beneficiary-details', index);
						}
						this.deleteBeneficiary.emit(index);
					} else {
						this.beneficiaryDetailsSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
							this.consumerData = data;
							this.removeBeneficiaryForm(index);
							this.nextState();
						});
					}
				}
			}, () => {
				this.pageLoaderSvc.hide();
			});
		} else {
			this.removeBeneficiaryForm(index);
			this.nextState();
		}
	}

	getPid(index: number) {
		return this.beneficiaryForm.get('beneficiaryList')['controls'][index].get('pid').value;
	}

	removeBeneficiaryForm(index: number) {
		if (index >= 0) {
			this.pageLoaderSvc.show(true, false);
			const removeForm = <FormArray>this.beneficiaryForm.controls['beneficiaryList'];
			removeForm.removeAt(index);
			this.modalBoxService.setBeneficiaryCount(removeForm.length);
			this.beneficiaryManager.slice(index, 1);
			this.ssnSubscriptions[index].unsubscribe();
			this.ssnSubscriptions.splice(index, 1);
			if (this.reviewPage) {
				this.resetEditToggle();
			}
			this.getBeneficiaryFormCount();
		}
	}

	resetEditToggle() {
		this.beneficiaryManager.forEach((manager) => {
			manager.editContent = false;
		});
	}

	nextState() {
		this.beneficiaryDetailsSvc.setBeneficiaryCount({ count: this.beneficiaryFormCount }).subscribe(res => {
			if (!(res.nextuistate === 'beneficiaryInfo')) {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[res.nextuistate]]);
			} else {
				this.pageLoaderSvc.hide();
			}
		});
	}

	trim(index, parentControl, childControl1, childControl2 = null) {
		let trimValue;
		const patchObj = {};
		if (childControl2) {
			trimValue = this.beneficiaryForm.controls[parentControl]['controls'][index]['controls'][childControl1]['controls'][childControl2].value ? this.beneficiaryForm.controls[parentControl]['controls'][index]['controls'][childControl1]['controls'][childControl2].value.trim() : null;
			patchObj[childControl2] = trimValue;
			this.beneficiaryForm.controls[parentControl]['controls'][index]['controls'][childControl1].patchValue(patchObj);
		} else {
			trimValue = this.beneficiaryForm.controls[parentControl]['controls'][index]['controls'][childControl1].value ? this.beneficiaryForm.controls[parentControl]['controls'][index]['controls'][childControl1].value.trim() : null;
			patchObj[childControl1] = trimValue;
			this.beneficiaryForm.controls[parentControl]['controls'][index].patchValue(patchObj);
		}
	}

	getStateText(val: string) {
		let title: string = null;
		if (this.allStates !== undefined) {
			if (val !== '' && val !== null && val !== undefined) {
				this.allStates.forEach((obj) => {
					if (obj.statecode === val) {
						title = obj.statename;
					}
				});
			}
		}
		return title;
	}

	getRelationshipText(val: string) {
		let title = '';
		if (this.relationshipList !== undefined) {
			if (val !== null && val !== undefined) {
				this.relationshipList.forEach((obj) => {
					if (obj.id === parseInt(val, 10)) {
						title = obj['value'];
					}
				});
			}
		}
		return title;
	}

	zipLookUp(index: number) {
		if (this.beneficiaryManager[index].editContent) {
			this.dataService.updateZipValidityStatus(false);
			const zipControl = this.beneficiaryForm.controls.beneficiaryList['controls'][index]['controls'].zipcode;
			if (zipControl.value && !zipControl.invalid) {
				this.usps.zipLookup(zipControl.value).subscribe((data: ZipDetails) => {
					if (!data['error']) {
						if (data.state) {
							const patchObj = {
								state: data.state,
								// city: data.city
							};
							if ((this.zipCode.length && this.zipCode[index] !== zipControl.value) || !this.beneficiaryForm.controls.beneficiaryList['controls'][index]['controls'].city.value) {
								patchObj['city'] = data.city;
								this.zipCode[index] = zipControl.value;
							}
							this.beneficiaryForm.controls.beneficiaryList['controls'][index].patchValue(patchObj);
							this.standardizeAddress('beneficiaryList', index);
							this.dataService.updateZipValidityStatus(true);
						}
					} else if (zipControl.length) {
						zipControl.setErrors({ 'incorrect': true });
					}
				});
			} else if (zipControl.value === '') {
				const patchObj = {
					state: '',
					city: ''
				};
				this.beneficiaryForm.controls.beneficiaryList['controls'][index].patchValue(patchObj);
				this.dataService.updateZipValidityStatus(true);
			}
		}
	}

	standardizeAddress(holderType: string, index: number) {
		if (this.beneficiaryManager[index].editContent) {
			this.dataService.standardizeCheck.subscribe(data => {
				if (!data || !data.hasOwnProperty(holderType + `beneficirary-${index + 1}`) || data[holderType + `beneficirary-${index + 1}`] === true) {
					if (this.beneficiaryForm.controls.beneficiaryList['controls'][index]['controls'].numberandstreet.valid) {
						const add = this.beneficiaryForm.controls.beneficiaryList['controls'][index]['controls'].numberandstreet.value;
						let zip = '';
						if (this.beneficiaryForm.getRawValue()[index] !== null) {
							zip = this.beneficiaryForm.getRawValue()[holderType][index].zipcode;
						}
						if (add !== null && add !== undefined && add !== '' && zip !== null && zip !== undefined && zip !== '') {
							this.usps.standardizeAddress(add, zip).subscribe(address => {
								if (address !== null && address !== undefined && address !== '') {
									this.dataService.updateStandarizeAddressStatus(holderType, `beneficirary-${index + 1}`);
									const patchObj = { numberandstreet: address };
									this.beneficiaryForm.controls.beneficiaryList['controls'][index].patchValue(patchObj);
								}
							});
						}
					}
				}
			});
		}
	}

}
