import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { UspsService } from '../../../core/apis/usps.service';
import { DataService } from '../../../core/services/data.service';
import { FormUtilityService } from '../../../core/services/form-utility.service';
import { SharedMdmService } from '../../../shared/services/shared-mdm.service';

import { Employment } from '../../../core/models/application.model';
import { EMPLOYER_FIELD_NAME, OCCUPATION_FIELD_NAME, EMPLOYER_STATUS_VALUE, OCCUPATION_STATUS_VALUE } from '../../../core/models/enums';
import { EmploymentStatus, States } from '../../../core/models/fields-value.model';
import { ZipDetails } from '../../../core/models/usps-response.model';
import { CustomValidation } from '../../../core/utility/custom-validations';

@Component({
	selector: 'app-employment',
	templateUrl: './employment.component.html',
	styleUrls: ['./employment.component.scss']
})
export class EmploymentComponent implements OnInit, OnChanges {

	@Input() editEmpDetails: boolean;
	@Input() applicantType: string;
	@Input() pid: number;
	@Input() isSoleProprietorship: boolean;
	@Output() changeInEmploymentStatus = new EventEmitter();
	@Output() changeInWorkPhoneNumber = new EventEmitter();
	@Output() removeWorkPhoneNumber = new EventEmitter();

	employment: FormGroup;
	accountType: string;
	page: string;
	applicantId: string;
	addressType = 'employer';
	hideEmployerName = false;
	hideOccuption = false;
	allStates: Array<States>;

	phoneMask = CustomValidation.phoneMask;
	phonePattern = CustomValidation.getPattern('phoneNumberPattern');
	zipcodeMask = CustomValidation.zipcodeMask;
	zipCodePattern = CustomValidation.getPattern('numberPattern');

	employerFieldName = EMPLOYER_FIELD_NAME;
	occupationFieldName = OCCUPATION_FIELD_NAME;
	employerStatusValue = EMPLOYER_STATUS_VALUE;
	occupationStatusValue = OCCUPATION_STATUS_VALUE;

	employmentStatus: Array<EmploymentStatus>;
	filteredEmploymentStatus: Array<any>;

	employmentFieldsToSetNull = ['employername', 'occupation', 'workphonenumber', 'extension'];

	constructor(
		private dataService: DataService,
		private formUtilitySvc: FormUtilityService,
		private sharedMdm: SharedMdmService,
		private usps: UspsService,
	) { }

	ngOnInit() {
		this.dataService.currentStateCheck.subscribe(resp => {
			this.accountType = resp.accountType;
			this.page = resp.page;
			this.applicantId = this.pid ? this.applicantType + this.pid : this.applicantType;
			this._createForm();
			this.getInitialFormData();
			const eligibility = JSON.parse(sessionStorage.getItem('eligibilityQuestions'));
			if (this.accountType === 'businessDeposit' && this.pid === 1 &&
				eligibility && eligibility.ownershipstructure !== '1') {
				this.employment.controls['employmentstatus'].setValue('EMPLOYED');
				// this.showEmploymentDetails = true;
			}
		});
		this.employment.get('workphonenumber').valueChanges.subscribe(() => {
			this.changeInWorkPhoneNumber.emit();
		});

	}

	ngOnChanges(changes) {
		if (this.accountType === 'businessDeposit' && changes.pid &&
			changes.pid.previousValue !== changes.pid.currentValue &&
			changes.pid.currentValue === 1 && !this.isSoleProprietorship) {
			this.employment.controls['employmentstatus'].setValue('EMPLOYED');
		}
	}

	private _createForm() {
		this.employment = new FormGroup({
			employmentstatus: new FormControl('', [Validators.required]),
			employername: new FormControl('', {
				validators: CustomValidation.employername,
				updateOn: 'blur'
			}),
			occupation: new FormControl('', {
				validators: CustomValidation.occupation,
				updateOn: 'blur'
			}),
			workphonenumber: new FormControl('', {
				validators: CustomValidation.workphone,
				updateOn: 'blur'
			}),
			extension: new FormControl('', {
				validators: CustomValidation.extension,
				updateOn: 'blur'
			})
			// numberandstreet: new FormControl('', {
			// 	validators: CustomValidation.employmentAddress,
			// 	updateOn: 'blur'
			// }),
			// aptorsuite: new FormControl('', {
			// 	validators: CustomValidation.aptorsuite,
			// 	updateOn: 'blur'
			// }),
			// zipcode: new FormControl('', {
			// 	validators: CustomValidation.employmentZipcode,
			// 	updateOn: 'blur'
			// }),
			// city: new FormControl('', {
			// 	validators: CustomValidation.employmentCity,
			// 	updateOn: 'blur'
			// }),
			// state: new FormControl(''),
		});
	}

	getInitialFormData() {
		this.getEmploymentStatus();
		if (this.sharedMdm.allStates && this.sharedMdm.allStates.length > 0) {
			this.allStates = this.sharedMdm.allStates;
		} else {
			this.sharedMdm.getStates().subscribe((data: Array<States>) => {
				this.allStates = data;
			});
		}
	}

	getEmploymentStatus() {
		this.filteredEmploymentStatus = [];
		if (this.sharedMdm.employmentStatus && this.sharedMdm.employmentStatus.length > 0) {
			this.employmentStatus = this.sharedMdm.employmentStatus;
			if (this.accountType === 'businessDeposit') {
				this.employmentStatus.forEach((item) => {
					if (item.value.toLowerCase() === 'employed' || item.value.toLowerCase() === 'self employed') {
						this.filteredEmploymentStatus.push(item);
					}
				});
			}
		} else {
			this.sharedMdm.getEmploymentStatus().subscribe((data: Array<EmploymentStatus>) => {
				this.employmentStatus = data.sort((a, b) => a.value.localeCompare(b.value));
				if (this.accountType === 'businessDeposit') {
					this.employmentStatus.forEach((item) => {
						if (item.value.toLowerCase() === 'employed' || item.value.toLowerCase() === 'self employed') {
							this.filteredEmploymentStatus.push(item);
						}
					});
				}
			});
		}
	}

	getEmploymentStatusValue(id) {
		if (this.employmentStatus) {
			const empObj = this.employmentStatus.find(status => {
				return status.value === id;
			});
			return empObj && empObj.value ? empObj.value : '';
		}
	}

	onEmploymentChange(resetEmployment: boolean) {
		const empstatus = this.employment.getRawValue().employmentstatus;
		if (this.accountType === 'businessDeposit') {
			this.changeInEmploymentStatus.emit(empstatus);
		}
		if (empstatus !== '' && empstatus !== null) {
			if (resetEmployment) {
				this._resetFields();
			}
			if (empstatus === 'RETIRED' || empstatus === 'STUDENT' || empstatus === 'UNEMPLOYED') {
				this.removeWorkPhoneNumber.emit(true);
				this.hideEmployerName = true;
				this.employment.patchValue({ employername: this.employerStatusValue[empstatus] });
				if (empstatus === 'STUDENT') {
					this.hideOccuption = true;
					this.employment.patchValue({ occupation: this.occupationStatusValue[empstatus] });
				} else {
					this.hideOccuption = false;
				}
			} else {
				this.hideOccuption = false;
				this.hideEmployerName = false;
			}
		}
		const employmentDetails = this.employment.getRawValue();
		this.employment.patchValue(employmentDetails);
	}

	getEmployerFieldName(): string {
		const empstatus = this.employment.getRawValue().employmentstatus;
		let value = '';
		if (empstatus !== '' && empstatus !== null) {
			value = this.employerFieldName[empstatus];
		}
		return value ? value : this.employerFieldName['EMPLOYED'];
	}

	getOccupationFieldName(): string {
		const empstatus = this.employment.getRawValue().employmentstatus;
		let value = '';
		if (empstatus !== '' && empstatus !== null) {
			value = this.occupationFieldName[empstatus];
		}
		return value ? value : this.occupationFieldName['EMPLOYED'];
	}

	trim(control: string, control1?: string, index?: number) {
		let trimValue;
		const patchObj = {};
		if (control) {
			trimValue = this.employment['controls'][control].value ? this.employment['controls'][control].value.trim() : null;
			patchObj[control] = trimValue;
			this.employment.patchValue(patchObj);
		}
	}

	patchData(data: Employment) {
		if (data) {
			if (data.employmentstatus) {
				const empStatus = this.getEmploymentStatusValue(data.employmentstatus);
				this.employment.patchValue(data);
				this.checkEmploymentStatus();
				this.onEmploymentChange(false);
			} else {
				this.employment.patchValue(data);
				this.checkEmploymentStatus();
			}
		}
	}

	checkEmploymentStatus() {
		if (this.sharedMdm.employmentStatus && this.sharedMdm.employmentStatus.length > 0) {
			let statusNotFound = true;
			const empStatus = this.employment.getRawValue().employmentstatus;
			this.sharedMdm.employmentStatus.forEach(status => {
				if (status.value === empStatus) {
					statusNotFound = false;
					return;
				}
			});
			if (statusNotFound) {
				this.employment.patchValue({ employmentstatus: '' });
			}
		}
	}

	formatPhone(workphone: any) {
		if (workphone) {
			const formattedPhoneNumber = this.formUtilitySvc.formatPhoneNumber(workphone);
			this.employment.patchValue({ workphonenumber: formattedPhoneNumber });
		}
	}

	applyEmploymentFormValidations(group: any, empStatus) {
		const status = this.getEmploymentStatusValue(empStatus);
		Object.keys(group.controls).forEach((control) => {
			if (group.controls[control]['controls']) {
				if (Array.isArray(group.controls[control]['controls'])) {
					group.controls[control]['controls'].forEach(groupControl => {
						this.applyEmploymentFormValidations(groupControl, empStatus);
					});
				} else {
					this.applyEmploymentFormValidations(group.controls[control]['controls'], empStatus);
				}
			} else {
				const validations: any = CustomValidation.setEmploymentFormValidation(status, this.accountType, control);
				if (validations) {
					group['controls'][control].setValidators(validations);
					group['controls'][control].updateValueAndValidity({
						onlySelf: true
					});
				} else {
					group['controls'][control].clearValidators();
					group['controls'][control].updateValueAndValidity({
						onlySelf: true
					});
					group['controls'][control].setErrors(null);
				}
				// group['controls'][control].markAsUntouched();
				// group['controls'][control].markAsPristine();
				if (group['controls'][control].dirty) {
					group['controls'][control].markAsTouched();
					// group['controls'][control].markAsPristine();
				} else {
					group['controls'][control].markAsUntouched();
					group['controls'][control].markAsPristine();
				}
			}
		});
	}

	getEmploymentFormDetails() {
		const employmentData: Employment = this.employment.getRawValue();
		return employmentData;
	}

	_resetFields() {
		this.employmentFieldsToSetNull.forEach(field => {
			this.employment.controls[field].setValue('');
		});
	}

	zipLookUp() {
		if (this.editEmpDetails) {
			this.dataService.updateZipValidityStatus(false);
			const zipControl = this.employment['controls'].zipcode;
			if (zipControl.value && zipControl.valid) {
				this.usps.zipLookup(zipControl.value).subscribe((data: ZipDetails) => {
					if (!data['error'] && data.state) {
						const patchObj = {
							state: data.state,
							city: data.city
						};
						this.employment.patchValue(patchObj);
						this.standardizeAddress();
						this.dataService.updateZipValidityStatus(true);
					} else {
						zipControl.setErrors({ 'incorrect': true });
					}
				});
			} else if (zipControl.value === '') {
				const patchObj = {
					state: '',
					city: ''
				};
				this.employment.patchValue(patchObj);
			}
		}
	}

	standardizeAddress() {
		if (this.editEmpDetails) {
			this.dataService.standardizeCheck.subscribe(data => {
				if (!data || !data.hasOwnProperty(this.page + this.addressType) || data[this.page + this.addressType] === true) {
					if (this.employment['controls'].numberandstreet.valid) {
						const add = this.employment['controls'].numberandstreet.value;
						let zip = '';
						if (this.employment.getRawValue()['zipcode'] !== null) {
							zip = this.employment.getRawValue()['zipcode'];
						}
						if (add !== null && add !== undefined && add !== '' &&
							zip !== null && zip !== undefined && zip !== '') {
							this.usps.standardizeAddress(add, zip).subscribe(address => {
								if (address !== null && address !== undefined && address !== '') {
									this.dataService.updateStandarizeAddressStatus(this.page, this.addressType);
									const patchObj = { numberandstreet: address };
									this.employment.patchValue(patchObj);
								}
							});
						}
					}
				}
			});
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

}
