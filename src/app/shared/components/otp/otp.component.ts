/*------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Shared
File Name              :        otp.component.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        25/02/2019
Description            :        otp component to validate otp sent to user
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ElementRef, ViewChild, Output, EventEmitter, AfterViewInit, HostListener } from '@angular/core';

import { OtpService } from '../../services/otp.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';

import { AppConfig } from '../../../app.config';
import { CustomValidation } from '../../../core/utility/custom-validations';


@Component({
	selector: 'app-otp',
	templateUrl: './otp.component.html',
	styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit, AfterViewInit {

	@ViewChild('otpFields', {static: false}) otpFields: ElementRef;

	@Output() validate = new EventEmitter();
	@Output() resend = new EventEmitter();

	otp = '';
	savedApplications: any;
	email: string;
	resendOtpTime = '00:30';
	resendDisabled = true;
	isNotMobile = true;  // initiate as true, assume for desktop first
	transunionResponse: any;
	flowType: string;
	otpLength = 6;
	responseDisplayName: string;
	numberMask = CustomValidation.numberMask;

	constructor(
		private dataService: DataService,
		private notificationSvc: NotificationService,
		private otpService: OtpService,
		private pageLoaderSvc: PageLoaderService
	) { }

	ngOnInit() {
		this.dataService.savedApplications.subscribe(data => {
			this.savedApplications = data;
			this.pageLoaderSvc.hide();
		});
		this.email = sessionStorage.getItem('linkedEmail');
		this.startTimer();
		// this.otpFields.nativeElement.querySelectorAll('input')[0].focus();
		this.checkDevice();
		if (this.flowType === 'transunion') {
			this.responseDisplayName = this.transunionResponse.authenticationquestions[0].displayname;
		}
	}

	ngAfterViewInit() {
		this.otpFields.nativeElement.querySelectorAll('input')[0].focus();
	}

	checkNumericField(event: any, index: number) {
		if (event.ctrlKey === true && event.key === 'v' || event.key.toLowerCase() === 'tab') {
			return;
		}
		event.preventDefault();
		if (event.key.toLowerCase() === 'backspace') {
			this.keytab(event, index);
			return;
		}
		setTimeout(() => {
			event.preventDefault();
			const pattern = /[0-9]/;
			let inputChar = event.key;
			if (event.key.toString().toLowerCase() === 'unidentified' && (event.charCode === 0 || event.charCode === 229)) {
				if (event.target) {
					inputChar = event.target.value;
				} else {
					inputChar = event.srcElement.value;
				}
			}
			// const inputChar = String.fromCharCode(event.charCode);
			if (inputChar.length === 1 && pattern.test(inputChar)) {
				const currentElement = event.target || event.srcElement; // get the element
				const nselement = currentElement.nextElementSibling; // get next sibling element
				// if (currentElement.value === null || currentElement.value === '') {
				if (index !== this.otp.length && this.otp.length < this.otpLength) {
					// currentElement.value = inputChar;
					this.otp = this.otp + inputChar;
					currentElement.value = inputChar;
					// 	this.validateFocus(nselement);
					// } else {
					// 	event.preventDefault();
				}
				this.validateFocus(event, nselement);
			} else {
				// invalid character, prevent input
				event.preventDefault();
			}
		}, 0);
		// event.preventDefault();
	}

	clickNumPad(event) {
		event.preventDefault();
		const pattern = /[0-9]/;
		// const inputChar = event.target.innerText || event.srcElement.innerText;
		const inputChar = event.srcElement ? event.srcElement.innerText : event.target.innerText;
		let activeOtpField = this.otpFields.nativeElement.querySelectorAll('input')[this.otp.length < this.otpLength ? this.otp.length : this.otpLength - 1];
		if (inputChar.length === 1 && pattern.test(inputChar)) {
			activeOtpField.focus();
			const nselement = activeOtpField.nextElementSibling; // get next sibling element
			if (activeOtpField.value === null || activeOtpField.value === '') {
				this.otp = this.otp + inputChar;
				activeOtpField.value = inputChar;
			}
			this.validateFocus(event, nselement);
			// const e = new KeyboardEvent('keypress', { key: inputChar });
			// activeOtpField.dispatchEvent(e);
		} else if (inputChar.toUpperCase() === 'C') {
			activeOtpField.focus();
			this.clearOtp();
			this.otp = '';
			this.setInputFocus(this.otpFields.nativeElement.querySelectorAll('input')[0]);
		} else {
			activeOtpField = this.otpFields.nativeElement.querySelectorAll('input')[this.otp.length > 0 ? this.otp.length - 1 : 0];
			activeOtpField.focus();
			if (this.otp.length > 0) {
				const pselement = activeOtpField.previousElementSibling; // get previous sibling element
				if (activeOtpField.value === null || activeOtpField.value === '') {
					pselement.value = '';
					this.otp = this.otp.slice(0, this.otp.length - 1);
				} else {
					activeOtpField.value = '';
					this.otp = this.otp.slice(0, this.otp.length - 1);
				}
				if (this.otp.length === 0) {
					this.setInputFocus(activeOtpField);
				} else {
					this.validateFocus(event, (this.otp.length <= this.otpLength - 1 ? activeOtpField : pselement));
				}
				event.preventDefault();
			}
		}
	}

	keytab(event, index) {
		const currentElement = event.target || event.srcElement; // get the element
		const pselement = currentElement.previousElementSibling; // get previous sibling element
		if (currentElement.value === null || currentElement.value === '') {
			// this.validateFocus(event, pselement);
			// event.preventDefault();
			if (pselement) {
				pselement.value = '';
				this.otp = this.otp.slice(0, index - 2);
				this.validateFocus(event, pselement);
			}
		} else {
			currentElement.value = '';
			this.otp = this.otp.slice(0, index - 1);
		}
		// if (this.otp.length <= index) {
		// 	this.validateFocus(event, currentElement);
		// }
		// event.preventDefault();
	}

	validateFocus(event, inputElement) {
		if (inputElement === null) { // check if its null
			return;
		}
		inputElement.focus(); // focus if not null
		event.preventDefault();
	}

	setInputSelection(event: any) {
		event.preventDefault();
		const input = event.target || event.srcElement;
		this.setInputFocus(input);
		return false;
	}

	setInputFocus(inputElement: any) {
		if (inputElement.value === '') {
			if (inputElement.previousElementSibling !== null && inputElement.previousElementSibling.value === '') {
				this.setInputFocus(inputElement.previousElementSibling);
			} else {
				this.setFocus(inputElement);
			}
		} else {
			if (inputElement.nextElementSibling !== null) {
				// && inputElement.nextElementSibling.value === ''
				this.setInputFocus(inputElement.nextElementSibling);
			} else {
				this.setFocus(inputElement);
			}
		}
	}

	setFocus(input) {
		input.focus();
		if (typeof input.selectionStart !== 'undefined') {
			input.selectionStart = 1;
			input.selectionEnd = 1;
		} else if (input.selection && input.selection.createRange) {
			// IE branch
			input.select();
			const range = input.selection.createRange();
			range.collapse(true);
			range.moveEnd('character', 1);
			range.moveStart('character', 1);
			range.select();
		}
	}

	setTimeRemaining(remainingTime: number) {
		// const time = 30 - remainingTime;
		const minutes = Math.floor(remainingTime / 60);
		const seconds = Math.floor(remainingTime % 60);
		this.resendOtpTime = this.getTimeString(minutes) + ':' + this.getTimeString(seconds);
	}

	getTimeString(time) {
		return (time < 10) ? ('0' + time) : time.toString();
	}

	startTimer() {
		let timer = AppConfig.settings.RESEND_OTP_TIME;
		this.setTimeRemaining(timer);
		const interval = setInterval(() => {
			if (timer === 0) {
				clearInterval(interval);
				this.resendDisabled = false;
			}
			this.setTimeRemaining(timer--);
		}, 1000);
	}

	resendOtp() {
		const hashcode = sessionStorage.getItem('hashcode');
		if (!this.resendDisabled) {
			this.pageLoaderSvc.show(true, false);
			this.resendDisabled = true;
			if (this.flowType && this.flowType.toUpperCase() === 'TRANSUNION') {
				this.resend.emit();
			} else {
				if (hashcode) {
					this.otpService.resendOtp().subscribe((response: any) => {
						this.pageLoaderSvc.hide();
						this.resendDisabled = true;
						this.notificationSvc.displayToast('info', 'OTP Resent Successfully', 'The verification code has been sent to the email address you provided.', 5000);
						this.startTimer();
					}, (error: any) => {
						this.resendDisabled = false;
						throw new ApplicationError('1002');
					});
				} else {
					this.resendDisabled = false;
					throw new ApplicationError('1000');
				}
			}
		}
	}

	validateOtp() {
		if (this.otp.length !== this.otpLength) {
			return;
		}
		if (this.flowType && this.flowType.toUpperCase() === 'TRANSUNION') {
			const quesAnsRequest = this.createArequestObject(this.otp);
			this.validate.emit({ request_QA: quesAnsRequest });
		} else {
			this.validate.emit({ otp: this.otp });
		}
	}

	createArequestObject(otp: string) {
		const question = this.transunionResponse;
		const quesObj = [];
		const obj = {
			name: question.authenticationquestions[0].name,
			value: otp
		};
		quesObj.push(obj);
		const sessionsArn = sessionStorage.getItem('arn');
		const quesAnsRequest = {
			authenticationData: quesObj,
			referenceNumber: this.transunionResponse.referencenbr,
			nextRequestState: this.transunionResponse.nextrequeststate,
			iReqDeclined: this.transunionResponse.irequestdeclined,
			arn: sessionsArn
		};
		return quesAnsRequest;
	}

	checkDevice() {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
			this.isNotMobile = false;
		}
	}

	clearOtp() {
		const inputField = this.otpFields.nativeElement.querySelectorAll('input');
		for (let i = 0; i < inputField.length; i++) {
			inputField[i].value = null;
		}
		this.otp = '';
		this.setInputFocus(this.otpFields.nativeElement.querySelectorAll('input')[0]);
	}

	handlePaste(event: any, pasteTarget: any) {
		let content = '';
		if (window['clipboardData']) {
			content = window['clipboardData'].getData('Text');
		}
		if (event.clipboardData) {
			content = event.clipboardData.getData('text/plain');
		}
		// const content = window['clipboardData'].getData('Text') || event.clipboardData.getData('text/plain');
		const pattern = /^[0-9]*$/;
		// let pasteTarget = event.target || event.srcElement;
		if (pasteTarget.value === '' && pattern.test(content)) {
			for (let i = 0; i < content.length; i++) {
				pasteTarget.value = Number(content.charAt(i));
				this.otp = this.otp + content.charAt(i);
				if (pasteTarget.nextElementSibling === null) {
					break;
				}
				setTimeout(() => { this.setInputFocus(pasteTarget); }, 0);
				pasteTarget = pasteTarget.nextElementSibling;
			}
		}
	}

	@HostListener('paste', ['$event']) handlePasteEvt(e: any) {
		if (this.otp.length < 6) {
			const activeOtpField = this.otpFields.nativeElement.querySelectorAll('input')[this.otp.length > 0 ? this.otp.length : 0];
			activeOtpField.focus();
			this.handlePaste(e, activeOtpField);
		}
		e.preventDefault();
	}

}
