/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        custom-validations.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        20/04/2019
Description            :        Custom validations for form elements
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Validators, AbstractControl, ValidatorFn } from '@angular/forms';

export abstract class CustomValidation {

	private static namePattern = /^[a-zA-Z ]{1,}$/;
	// private static namePattern = /^[a-zA-Z ]{1,}(([-]?[a-zA-Z ]{1,})?)[a-zA-Z ]{0,}$/;
	// private static employerNamePattern = /(?=.*[0-9a-zA-Z])/;
	private static businessNamePattern = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 &\-'+$#!.,?/*()_=%@~`]{1,}$/;
	private static employerNamePattern = /^([0-9a-zA-Z ]{1,}[\x00-\x7E]{0,})$/;
	private static emailPattern = /^(?!.*\.{2})[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
	// private static ssnPattern = /^(?!219099999|078051120)((?!666|000|8\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4})$/;
	private static ssnPattern = /^((?!000|8\d{2})\d{3}-\d{2}-(?!0{4})\d{4})$/;
	private static idnumberPattern = /^[0-9a-zA-Z]{1,}$/;
	// private static addressPattern = /^\s*?[0-9]{1,8}\s[a-zA-Z ]{1,}$/;
	private static addressPattern = /^\s*?[0-9]{1,8}\s[0-9a-zA-Z\. ]{1,}$/;
	private static mailingPattern = /^\s*?([0-9]{1,8}\s)?[0-9a-zA-Z\. ]{1,}$/;
	private static apartmentPattern = /^[0-9a-zA-Z]{1,}[0-9a-zA-Z\,\. ]{0,}$/;
	private static amountPattern = /^[0-9]{0,}\.[0-9]{2}$/;
	private static numberPattern = /^[0-9]*$/;
	private static websitePattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:([A-Za-z]{3}).|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/; // /^(www.){0,1}[a-z0-9]+([\-a-z0-9]+)*\.([a-z]{1,}\.)*[a-z]+$/;
	private static taxidPattern = /^(?!000)\d{3}-\d{2}-[0-9]{4}$/;
	private static phoneNumberPattern = /^\(?([2-9][0-9]{2})\)?[-. ]?([2-9](?!11)[0-9]{2})[-. ]?([0-9]{4})$/;
	private static alphaNumericWithSpace = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
	private static datePattern = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
	private static cardNumberPattern = /^([0-9]{4} ){3}[0-9]{3,4}$/;
	private static cardMonthPattern = /^(0[1-9]{1})|(1[0-2]{1})$/;
	private static cardYearPattern = /^[2-9]{1}[0-9]{1}$/;


	public static firstname = [
		Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(20)
	];

	public static middlename = [
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(1),
		Validators.maxLength(10)
	];

	public static lastname = [
		Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(40)
	];

	public static percentageMask = {
		mask: [/[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/],
		guide: false,
		placeholderChar: '\u2000',
		keepCharPositions: true
	};

	public static ssn = [
		Validators.required,
		// Validators.minLength(11), // for test run only
		Validators.pattern(CustomValidation.ssnPattern)
	];

	public static beneficiaryssn = [
		// Validators.minLength(11), // for test run only
		Validators.pattern(CustomValidation.ssnPattern)
	];

	public static ein = [
		Validators.required,
		Validators.minLength(10)
	];

	public static email = [
		Validators.required,
		Validators.pattern(CustomValidation.emailPattern),
		Validators.minLength(5),
		Validators.maxLength(40)
	];

	public static businessEmail = [
		Validators.required,
		Validators.pattern(CustomValidation.emailPattern),
		Validators.minLength(5),
		Validators.maxLength(40)
	];

	public static mothermaiden = [
		Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(20)
	];

	public static primaryphonenumber = [
		Validators.minLength(14),
		Validators.maxLength(14),
		Validators.pattern(CustomValidation.phoneNumberPattern)
	];

	public static Businessprimaryphonenumber = [
		Validators.required,
		Validators.minLength(14),
		Validators.maxLength(14),
		Validators.pattern(CustomValidation.phoneNumberPattern)
	];

	public static mobilephonenumber = [
		Validators.required,
		Validators.minLength(14),
		Validators.maxLength(14),
		Validators.pattern(CustomValidation.phoneNumberPattern)
	];

	public static benificiaryprimaryphonenumber = [
		Validators.required,
		Validators.minLength(14),
		Validators.maxLength(14),
		Validators.pattern(CustomValidation.phoneNumberPattern)
	];

	public static identificationnumber = [
		Validators.required,
		Validators.pattern(CustomValidation.idnumberPattern),
		Validators.minLength(5),
		Validators.maxLength(20)
	];

	public static minoridentificationnumber = [
		Validators.pattern(CustomValidation.idnumberPattern),
		Validators.minLength(5),
		Validators.maxLength(20)
	];

	public static passportnumber = [
		Validators.required,
		Validators.pattern(CustomValidation.idnumberPattern),
		Validators.minLength(6),
		Validators.maxLength(9)
	];

	public static minorpassportnumber = [
		Validators.pattern(CustomValidation.idnumberPattern),
		Validators.minLength(6),
		Validators.maxLength(9)
	];

	public static physicalAddress = [
		Validators.required,
		Validators.pattern(CustomValidation.addressPattern),
		Validators.minLength(5),
		Validators.maxLength(40)
	];

	public static mailingAddress = [
		Validators.required,
		Validators.pattern(CustomValidation.mailingPattern),
		Validators.minLength(5),
		Validators.maxLength(40)
	];

	public static beneficiarymailingAddress = [
		Validators.pattern(CustomValidation.mailingPattern),
		Validators.minLength(5),
		Validators.maxLength(40)
	];

	public static employmentAddress = [
		Validators.pattern(CustomValidation.mailingPattern),
		Validators.minLength(5),
		Validators.maxLength(40)
	];

	public static aptorsuite = [
		Validators.pattern(CustomValidation.mailingPattern),
		Validators.maxLength(40)
	];

	public static zipcode = [
		Validators.required,
		Validators.minLength(5),
		Validators.maxLength(5)
	];

	public static beneficiaryzipcode = [
		Validators.minLength(5),
		Validators.maxLength(5)
	];

	public static employmentZipcode = [
		Validators.minLength(5),
		Validators.maxLength(5)
	];

	public static city = [
		Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(26)
	];

	public static beneficiarycity = [
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(26)
	];

	public static employmentCity = [
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(26)
	];

	public static occupation = [
		Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(40)
	];

	public static employername = [
		Validators.required,
		Validators.pattern(CustomValidation.businessNamePattern),
		Validators.minLength(3),
		Validators.maxLength(50)
	];

	public static referredEmployeeName = [
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(60)
	];

	public static grossmonthlyincome = [
		Validators.required,
		Validators.maxLength(19)
	];

	public static employeeincome = [
		Validators.required,
		Validators.maxLength(19),
		Validators.pattern(CustomValidation.numberPattern)
	];

	public static workphone = [
		Validators.maxLength(14),
		Validators.minLength(14),
		Validators.pattern(CustomValidation.phoneNumberPattern)
	];

	public static businessExtension = [
		Validators.maxLength(6),
		Validators.minLength(6),
		Validators.pattern(CustomValidation.numberPattern)
	];

	public static extension = [
		Validators.maxLength(6),
		Validators.minLength(0)
	];

	public static businessname = [
		Validators.required,
		Validators.minLength(2),
		Validators.maxLength(80),
		Validators.pattern(CustomValidation.businessNamePattern)
	];

	public static rentPayment = [
		Validators.required,
		Validators.minLength(1),
		Validators.maxLength(15)
		// Validators.pattern(CustomValidation.numberPattern)
	];

	public static approximatevalue = [
		Validators.required
	];

	public static businessCollateral = [
		Validators.required,
		Validators.maxLength(50)
	];

	public static businessFinancialInfo = [
		Validators.required,
		Validators.maxLength(19),
		// Validators.pattern(CustomValidation.numberPattern)
	];

	public static currentDeposit = [
		Validators.required,
		Validators.minLength(2),
		Validators.maxLength(50),
		Validators.pattern(CustomValidation.namePattern)
	];

	// public static monthValidation = [
	//     Validators.required,
	//     Validators.min(0),
	//     Validators.max(11)
	// ];

	public static websiteUrl = [
		Validators.pattern(CustomValidation.websitePattern)
	];

	public static cardMonth = [
		Validators.required,
		Validators.pattern(CustomValidation.cardMonthPattern)
	];

	public static cardYear = [
		Validators.required,
		Validators.pattern(CustomValidation.cardYearPattern)
	];

	public static accountname = [
		Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(1),
		Validators.maxLength(30)
	];

	public static accountnumber = [
		Validators.required,
		Validators.pattern(CustomValidation.numberPattern),
		Validators.minLength(4),
		Validators.maxLength(17)
	];

	public static routingnumber = [
		Validators.required,
		Validators.pattern(CustomValidation.numberPattern),
		Validators.minLength(9),
		Validators.maxLength(9)
	];

	public static institutionname = [
		Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(50)
	];

	public static businesslender = [
		// Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(50)
	];

	public static businesscollateral = [
		// Validators.required,
		Validators.pattern(CustomValidation.namePattern),
		Validators.minLength(2),
		Validators.maxLength(50)
	];

	public static businessOutstanding = [
		Validators.maxLength(19)
	];

	public static dateMask = {
		mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		keepCharPositions: true
	};

	public static payAmountMask = {
		mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		keepCharPositions: true
	};

	public static phoneMask = {
		mask: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		modelClean: true
	};

	public static ssnMask = {
		mask: [/\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		modelClean: true
	};

	public static tinMask = {
		mask: [/\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		modelClean: true
	};

	public static zipcodeMask = {
		mask: [/\d/, /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		modelClean: true
	};

	public static achMask = {
		mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		modelClean: true
	};

	public static numberMask = {
		mask: [/\d/],
		guide: false,
		placeholderChar: '\u2000'
	};

	public static frgAmountMask = {
		mask: [/[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/, /[0-9\.]/],
		guide: false,
		placeholderChar: '\u2000',
		keepCharPositions: true
	};

	public static dobOptions = {
		dateFormat: 'mm/dd/yyyy',
		showTodayBtn: false,
		showInputField: false,
		showClearDateBtn: false,
		alignSelectorRight: true
	};

	public static idIssueOptions = {
		dateFormat: 'mm/dd/yyyy',
		showTodayBtn: false,
		showInputField: false,
		showClearDateBtn: false,
		alignSelectorRight: true
	};

	public static idExpiryOptions = {
		dateFormat: 'mm/dd/yyyy',
		showTodayBtn: false,
		showInputField: false,
		showClearDateBtn: false,
		alignSelectorRight: true
	};

	public static businessFormationOptions = {
		dateFormat: 'mm/dd/yyyy',
		showTodayBtn: false,
		showInputField: false,
		showClearDateBtn: false,
		alignSelectorRight: true
	};

	public static resumeDobOptions = {
		dateFormat: 'mm/dd/yyyy',
		showTodayBtn: false,
		showInputField: false,
		showClearDateBtn: false,
		alignSelectorRight: true,
		openSelectorTopOfInput: true
	};

	public static getPattern(fieldName: string): RegExp | null {
		return this[fieldName] ? this[fieldName] : null;
	}

	public static setResponsiblityValidaitons(page) {
		if (page === 'authorizerInfo') {
			return [Validators.required];
		}
		return null;
	}

	public static setEmploymentFormValidation(empStatus: string = '', accountType: string, controlName: string, showPreviousEmployment?: boolean) {
		switch (empStatus) {
			case 'Unemployed':
			case 'Retired':
				switch (controlName) {
					case 'incomesource':
						return this.setControlValidations(controlName);
					case 'grossmonthlyincome':
						return this.setControlValidations(controlName);
					case 'previousoccupation':
						return this.setControlValidations(controlName);
					default:
						return null;
				}
			case '':
			default:
				switch (controlName) {
					case 'employername':
						return this.setControlValidations(controlName);
					case 'occupation':
						return this.setControlValidations(controlName);
					case 'workphonenumber':
						return this.setControlValidations(controlName);
					case 'extension':
						return this.setControlValidations(controlName);
					case 'grossmonthlyincome':
						return this.setControlValidations(controlName);
					default:
						return null;
				}
		}
	}

	public static setControlValidations(controlName: string, accountType?: string) {
		if (accountType === 'joint' && controlName === 'numberandstreet') {
			return this.mailingAddress;
		}
		switch (controlName) {
			case 'numberandstreet':
				return this.physicalAddress;
			case 'aptorsuite':
				return this.aptorsuite;
			case 'zipcode':
				return this.zipcode;
			case 'city':
				return this.city;
			case 'state':
				return [Validators.required];
			case 'incomesource':
				return [Validators.required];
			case 'grossmonthlyincome':
				return this.grossmonthlyincome;
			case 'previousemployername':
				return this.employername;
			case 'previousoccupation':
				return this.occupation;
			case 'employername':
				return this.employername;
			case 'occupation':
				return this.occupation;
			case 'workphonenumber':
				return this.workphone;
			case 'extension':
				return this.extension;
			case 'grossmonthlyincome':
				return this.grossmonthlyincome;
			case 'country':
				return [Validators.required];
		}
	}

	public static minAndMaxAmountValidator(minAmount: number, maxAmount: number): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			if (control.value === null || control.value === undefined || control.value < minAmount || control.value > maxAmount) {
				return { 'rangeError': true };
			} else {
				return null;
			}
		};
	}

	public static ssnDuplicateToPrimary(primarySSN: string): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			if (control.value === primarySSN) {
				return { 'duplicateSsn': true };
			} else {
				return null;
			}
		};
	}

	public static emailDuplicateToPrimary(primaryEmail: string): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			const value: string = control.value;
			if (value) {
				if (value.toUpperCase() === primaryEmail.toUpperCase()) {
					return { 'duplicateEmail': true };
				} else {
					return null;
				}
			}
		};
	}

	// public static ssnDuplicateBusinessApplicants(ssn1: string, ssn2: string): ValidatorFn {
	// 	return (control: AbstractControl): { [key: string]: boolean } | null => {
	// 		const value: string = control.value;
	// 		if (value && (ssn1 || ssn2)) {
	// 			if ((ssn1 && value === ssn1) || (ssn2 && value === ssn2)) {
	// 				return { 'duplicateSsn': true };
	// 			} else {
	// 				return null;
	// 			}
	// 		}
	// 	};
	// }

	public static checkDuplicateSsn(ssnList: Array<string>): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			const value: string = control.value;
			if (value && (ssnList.length > 0)) {
				if (ssnList.includes(value)) {
					return { 'duplicateSsn': true };
				} else {
					return null;
				}
			}
		};
	}

	public static checkDuplicateEmail(emailList: Array<string>): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			const value: string = control.value;
			if (value && (emailList.length > 0)) {
				if (emailList.includes(value.toUpperCase())) {
					return { 'duplicateEmail': true };
				} else {
					return null;
				}
			}
		};
	}

	// public static emailDuplicateBusinessApplicants(email1: string, email2: string): ValidatorFn {
	// 	return (control: AbstractControl): { [key: string]: boolean } | null => {
	// 		const value: string = control.value;
	// 		if (value && (email1 || email2)) {
	// 			if ((email1 && value.toUpperCase() === email1.toUpperCase()) || (email2 && value.toUpperCase() === email2.toUpperCase())) {
	// 				return { 'duplicateEmail': true };
	// 			} else {
	// 				return null;
	// 			}
	// 		}
	// 	};
	// }

	public static emailDuplicateJointApplicants(email1: string): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			const value: string = control.value;
			if (value && email1) {
				if (email1 && value.toUpperCase() === email1.toUpperCase()) {
					return { 'duplicateJointEmail': true };
				} else {
					return null;
				}
			}
		};
	}

	public static ssnDuplicateJointApplicants(ssn1: string): ValidatorFn {
		return (control: AbstractControl): { [key: string]: boolean } | null => {
			const value: string = control.value;
			if (value && ssn1) {
				if (value === ssn1) {
					return { 'duplicateJointSsn': true };
				} else {
					return null;
				}
			}
		};
	}

}
