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

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, Validators } from '@angular/forms';
import { CustomValidation } from '../../../core/utility/custom-validations';

@Component({
	selector: 'payment-card-form',
	templateUrl: './payment-card-form.component.html',
	styleUrls: ['./payment-card-form.component.scss']
})
export class PaymentCardFormComponent implements OnInit {

	cardForm: FormGroup;
	validationError: boolean;

	cardNumberMask = {
		mask: [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000'
	};

	dateMask = {
		mask: [/\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000'
	};

	// namePattern = /^[a-zA-Z ]{1,}(([-]?[a-zA-Z ]{1,})?)[a-zA-Z ]{0,}$/;
	// monthPattern = /^(0[1-9]{1})|(1[0-2]{1})$/;
	// yearPattern = /^(0[1-9]{1})|([1-9]{1}[0-9]{1})$/;
	numberPattern = CustomValidation.getPattern('numberPattern');
	cardNumberPattern = CustomValidation.getPattern('cardNumberPattern');
	monthPattern = CustomValidation.getPattern('cardMonthPattern');
	yearPattern = CustomValidation.getPattern('cardYearPattern');

	constructor() { }

	ngOnInit() {
		this._createCardForm();
	}

	private _createCardForm() {
		this.cardForm = new FormGroup({
			cardnumber: new FormControl('', {
				validators: [
					Validators.required,
					this._cardNumberValidator
				],
				updateOn: 'blur'
			}),
			cardholderfirstname: new FormControl('', {
				validators: CustomValidation.firstname,
				updateOn: 'blur'
			}),
			cardholderlastname: new FormControl('', {
				validators: CustomValidation.lastname,
				updateOn: 'blur'
			}),
			expmonth: new FormControl('', {
				validators: CustomValidation.cardMonth,
				updateOn: 'blur'
			}),
			expyear: new FormControl('', {
				validators: CustomValidation.cardYear,
				updateOn: 'blur'
			}),
			cardcvv: new FormControl('', {
				validators: [
					Validators.required
				],
				updateOn: 'blur'
			})
		}, this._checkExpiry);
	}

	private _cardNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
		const number = control.value.replace(/\s/g, '');
		const valid = validateCard(number);
		return valid ? null : { invalidCardNumber: true };

		function validateCard(cardNumber) {
			// test numeric and length between 12 and 19
			/*
   * Validate Card Number. Returns true if card number valid. Only allows
   * non-empty numeric values between 12 and 19 characters. A Luhn check is
   * also run against the card number.
   */
			if (!/^\d{12,19}$/.test(cardNumber)) {
				return false;
			}
			// luhn check
			let sum = 0;
			let digit = 0;
			let addend = 0;
			let timesTwo = false;

			for (let i = cardNumber.length - 1; i >= 0; i--) {
				digit = parseInt(cardNumber.substring(i, i + 1), 10);
				if (timesTwo) {
					addend = digit * 2;
					if (addend > 9) {
						addend -= 9;
					}
				} else {
					addend = digit;
				}
				sum += addend;
				timesTwo = !timesTwo;
			}

			const modulus = sum % 10;
			if (modulus !== 0) {
				return false;
			}

			return true;
		}
	}

	isCardDetailsValid(group: any) {
		let validationError = false;
		Object.keys(group.controls).forEach(field => {
			const control = group.get(field);
			control.markAsTouched(true);
			if (control.errors !== null && validationError === false) {
				validationError = true;
				control['nativeElement'].focus();
			}

		});
		return !validationError;
	}

	getCredentials() {
		const cardDetails = this.cardForm.getRawValue();
		cardDetails.cardnumber = cardDetails.cardnumber.replace(/\s/g, '');
		return cardDetails;
	}

	private _checkExpiry(individualForm: FormGroup) {
		if (individualForm.get('expmonth') && individualForm.get('expmonth').value && individualForm.get('expyear') && individualForm.get('expyear').value) {
			const year = new Date().getFullYear().toString().slice(-2);
			let month = (new Date().getMonth() + 1).toString();
			if (month && month.length === 1) {
				month = '0' + month;
			}
			return (individualForm.get('expmonth').value >= month && individualForm.get('expyear').value >= year || individualForm.get('expyear').value > year) ? null : { 'invalidexpiry': true };
		}
		return null;
	}

}
