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

import { Injectable } from '@angular/core';
import { IMyInputFieldChanged } from 'mydatepicker';

import { ApplicationDetails } from '../models/application.model';
import { AppConstants } from '../utility/app.constants';


@Injectable()
export class FormUtilityService {

	constructor() { }

	checkMilestoneError(consumerForm: any): boolean {
		let personal: any, lastnameError: any, dobError: any, emailError: any, ssnError: any;
		personal = consumerForm;

		lastnameError = (personal['controls'].lastname.value === null || personal['controls'].lastname.value === '') || (personal['controls'].lastname.errors) && (personal['controls'].lastname.dirty || !personal['controls'].lastname.touched);
		dobError = (personal['controls'].dob.value === null || personal['controls'].dob.value === '') || (personal['controls'].dob.errors && (personal['controls'].dob.dirty || !personal['controls'].dob.touched));
		emailError = (personal['controls'].email.value === null || personal['controls'].email.value === '' || personal['controls'].confirmEmail.value === null || personal['controls'].confirmEmail.value === '') || ((personal.errors || personal['controls'].confirmEmail.errors) && (personal['controls'].confirmEmail.dirty || !personal['controls'].confirmEmail.touched));
		ssnError = (personal['controls'].ssn.value === null || personal['controls'].ssn.value === '') || (personal['controls'].ssn.errors) && (personal['controls'].ssn.dirty || !personal['controls'].ssn.touched);

		return (lastnameError || dobError || emailError || ssnError);
	}

	checkFormSemantics(group: any, errorStatus: boolean) {
		Object.keys(group.controls).forEach(key => {
			if (errorStatus === false || errorStatus === null) {
				if (group.controls[key]['controls']) {
					errorStatus = this.checkFormSemantics(group.controls[key], errorStatus);
				} else {
					errorStatus = (group.controls[key].errors && (group.controls[key].dirty || group.controls[key].touched) && !group.controls[key].hasError('required'));
					if (errorStatus === true) {
						return errorStatus;
					}
				}
			} else {
				return errorStatus;
			}
		});
		return errorStatus;
	}

	checkDateValidity(date: IMyInputFieldChanged | any, fieldName: string): boolean {
		// const dateValue = new Date(date);
		// const datePicker = { date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() } };
		// if (dateValue.getFullYear() === datePicker.date.year && dateValue.getMonth() === datePicker. date.month && dateValue.getDate() ===  datePicker.date.day) {
		// 	return true;
		// }
		let isInvalid = false;
		switch (fieldName) {
			case 'dob':
			case 'jointDob':
			case 'beneficiaryDob':
				isInvalid = this._getDobInvalidity(date);
				break;
			case 'issueDate':
			case 'jointIssueDate':
				isInvalid = this._getIssueDateInvalidity(date);
				break;
			case 'expiryDate':
			case 'jointExpiryDate':
				isInvalid = this._getExpiryDateInvalidity(date);
				break;
		}
		return isInvalid;
	}

	checkDateOfBirthValidity(date, ageRange) {
		const age = this.getAge(date);
		switch (ageRange) {
			case 'minor':
				if (age >= 13 && age < 18) {
					return false;
				}
				break;
			case 'adult':
				if (age >= 18) {
					return false;
				}
				break;
		}
		return true;
	}

	private _getDobInvalidity(date: any): boolean {
		// if (date) {
		if (!date || date.length !== 10  || this.checkManualDateValidity(date)) {
			return true;
		}
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const dob = new Date(date).getTime();
		let age: any = new Date(currentDate - dob);
		age = (age.getFullYear() - 1970);
		if (age >= 18) {
			return false;
		}
		return true;
		// }
	}

	private _getIssueDateInvalidity(date: any): boolean {
		// if (date) {
		if (!date || date.length !== 10  || this.checkManualDateValidity(date)) {
			return true;
		}
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const issueDate = new Date(date).getTime();
		// let age: any = new Date(currentDate - issueDate);
		// age = (age.getFullYear() - 1970);
		if (currentDate - issueDate >= 0) {
			return false;
		}
		return true;
		// }
	}

	_issueDateandDobValidity(issuedate: any, dobDate: any): boolean {
		const issueDate = new Date(issuedate).getTime();
		const dob = new Date(dobDate).getTime();
		return issueDate <= dob ? true : false;
	}

	private _getExpiryDateInvalidity(date: any): boolean {
		// if (date) {
		if (!date || date.length !== 10  || this.checkManualDateValidity(date)) {
			return true;
		}
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const expiryDate = new Date(date).getTime();
		// let age: any = new Date(currentDate - expiryDate);
		// age = (age.getFullYear() - 1970);
		if (currentDate - expiryDate <= 0) {
			return false;
		}
		return true;
		// }
	}

	displayValidations(group: any, validationError = false) {
		if (group.invalid && group.errors && group.errors.mismatch) {
			validationError = true;
			const control = group.get('confirmEmail');
			control.markAsTouched(true);
			control['nativeElement'].focus();
		} else {
			Object.keys(group.controls).forEach(field => {
				if (group.controls[field]['controls']) {
					validationError = this.displayValidations(group.controls[field], validationError);
				} else {
					const control = group.get(field);
					control.markAsTouched(true);
					if (control.errors !== null && validationError === false) {
						validationError = true;
						if (control['nativeElement']) {
							control['nativeElement'].focus();
						}
					}
				}
			});
		}
		return validationError;
	}

	displayValidationsonBack(group: any, validationError = false) {
		Object.keys(group.controls).forEach(field => {
			if (group.controls[field]['controls']) {
				validationError = this.displayValidationsonBack(group.controls[field], validationError);
			} else {
				const control = group.get(field);
				// control.markAsTouched(true);
				if (control.errors !== null && validationError === false && !control.errors.required) {
					validationError = true;
					if (control['nativeElement']) {
						control['nativeElement'].focus();
					}
				}
			}
		});
	return validationError;
}

	resetPhoneNumber(phone: any) {
		return phone !== null ? phone.replace(/\D+/g, '') : null;
	}

	resetAndClearControlValidations(control: any, reset: boolean) {
		if (reset) {
			control.reset();
		}
		control.setErrors(null);
		control.clearValidators();
		control.updateValueAndValidity({
			onlySelf: true
		});
	}

	formatPhoneNumber(phone: any) {
		return phone = [phone.slice(0, 0), '(', phone.slice(0, 3), ') ', phone.slice(3, 6), '-', phone.slice(6, 10)].join('');
	}

	getYearText(year: number) {
		return (year > 1) ? year + ' years' : year + ' year';
	}

	getMonthText(month: number) {
		return (month > 1) ? month + ' months' : month + ' month';
	}

	getAge(date: any) {
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const dob = new Date(date).getTime();
		let age: any = new Date(currentDate - dob);
		age = (age.getFullYear() - 1970);
		return age;
	}

	getAgeRange(date: any) {
		let ageRange = 'adult';
		// const date = sessionStorage.getItem('dob');
		const age = this.getAge(date);
		if (age >= 13 && age < 18) {
			ageRange = 'minor';
		} else if (age >= 18) {
			ageRange = 'adult';
			// } else if (age >= 18) {
			// 	ageRange = 'adult';
		}
		return ageRange;
	}

	checkProductAgeValidation(consumerData: ApplicationDetails): boolean {
		if (consumerData.products.find((product) => product.productid === AppConstants.seniorCheckingID)) {
			if (this.getAge(consumerData.personaldetails.dob) >= AppConstants.minSeniorAge) {
				return false;
			}
			if (consumerData.jointdetails && consumerData.jointdetails.length) {
				let seniorFound = false;
				consumerData.jointdetails.forEach(joint => {
					if (this.getAge(joint.dob) >= AppConstants.minSeniorAge) {
						seniorFound = true;
					}
				});
				if (seniorFound) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	}

	getAmountString(amount: any) {
		const amountString = new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount).replace('$', '').trim();
		return amountString;
	}

	getFloatAmountString(amount: any) {
		const floatAmount = this.getAmountString(amount).replace(/\,/g, '').trim();
		return floatAmount;
	}

	checkManualDateValidity(date) {
		const dateWithoutDateObj = date.split('/')[1];
		let datefromdateObj = new Date(date).getDate().toString();
		datefromdateObj = datefromdateObj.length === 1 ? '0' + datefromdateObj : datefromdateObj;
		return dateWithoutDateObj !== datefromdateObj;
	}

	checkDOBWithRange(date: any, maxAge: any, minAge: any) {
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const dob = new Date(date).getTime();
		const age: any = new Date(currentDate - dob);
		const actualAge = (age.getFullYear() - 1970);
		if (actualAge <= Number(maxAge) && actualAge >= Number(minAge)) {
			// if (actualAge === Number(maxAge) && (age.getUTCMonth() !== 0 || age.getUTCDate() !== 1)) {
			// 	return true;
			// }
			return false;
		}
		return true;
	}

}
