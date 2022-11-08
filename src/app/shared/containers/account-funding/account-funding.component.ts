import { BsModalService } from 'ngx-bootstrap/modal';
/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Personal Deposit
File Name              :		account-funding.component.ts
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		12/06/2019
Description            :		account funding page actions.
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';

import { DueDiligenceQuestionnaireComponent } from '../due-diligence-questionnaire/due-diligence-questionnaire.component';
import { PaymentCardFormComponent } from '../../components/payment-card-form/payment-card-form.component';

import { AccountFundingService } from './account-funding.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';
import { FormUtilityService } from '../../../core/services/form-utility.service';
import { slideProductPopupAnimation } from '../../../shared/animations/slide.animation';

import { BACKEND_STATE, BACKEND_ACCOUNT } from '../../../core/models/enums';
import { AccountList } from '../../../core/models/oao-response-data.model';
import { Product } from '../../../core/models/product.model';

import { CustomValidation } from '../../../core/utility/custom-validations';
import { SharedMdmService } from '../../services/shared-mdm.service';
import { InsufficientFundsComponent } from '../../components/insufficient-funds/insufficient-funds.component';
import { Location } from '@angular/common';


@Component({
	selector: 'app-account-funding',
	animations: [slideProductPopupAnimation],
	templateUrl: './account-funding.component.html',
	styleUrls: ['./account-funding.component.scss'],
	providers: [
		AccountFundingService
	]
})
export class AccountFundingComponent implements OnInit {

	@ViewChild(PaymentCardFormComponent, { static: false }) paymentCard: PaymentCardFormComponent;
	@ViewChild(DueDiligenceQuestionnaireComponent, { static: false }) dueDiligence: DueDiligenceQuestionnaireComponent;
	numberPattern = CustomValidation.getPattern('numberPattern');
	paymentOption = 'other';
	existingUser = false;
	disableAmountFields = false;
	disableQuestionFields = false;
	showQuestions = false;
	showPaymentOptions = false;
	isAccountTypeSelected = true;
	isAchtermsSelected = false;
	// achTermError = false;
	accountsExist = false;
	openPlaidPopup = false;
	accountType: string;
	applicationType: string;
	workItem: string;
	productList: Product[];
	products: Product[];
	existingAccountList: AccountList[];
	expectedDate: string;
	fundingLimits: any;

	// achForm: FormGroup;
	accountForm: FormGroup;
	questionsForm: FormGroup;
	exisitngAccounts: FormGroup;

	// showInternalFund = false;
	// showDebitCard = false;
	// showOtherFinancialOption = false;
	// showCheck = false;
	accordionType = {
		showInternalFund: false,
		showFinancial: false,
		showCheck: false,
		showCard: false
	};

	achMask = CustomValidation.achMask;
	payAmountMask = CustomValidation.frgAmountMask;
	queryFundingAmount = 50000;
	internalFundingCount = 0;
	modalRef: any;
	achForm: FormGroup;
	constructor(
		private _fundingSvc: AccountFundingService,
		private dataService: DataService,
		private formUtilityService: FormUtilityService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private sharedMdm: SharedMdmService,
		private modalService: BsModalService,
		private _location: Location
		// private session: SessionService
	) { }

	ngOnInit() {
		this.dataService.changeStepper({ name: '/consumer-deposit/account-funding', index: 4, personalStepper: 'consumerDeposit' });
		this.dataService.currentStateCheck.subscribe(resp => {
			this.applicationType = resp.accountType;
		});
		const path = this._location.path().split('/')[3];
		if (path === 'insufficient-funds') {
			this.modalRef = this.modalService.show(InsufficientFundsComponent, { ignoreBackdropClick: true, keyboard: false });
			this.modalRef.content.clickOk.subscribe(() => {
				this.modalRef.hide();
			});
		}
		this._createForms();
		this._fundingSvc.getProductList().subscribe(data => {
			if (data.uistate === 'MDInProgress') {
				this._fundingSvc.getPlaidAccessToken().subscribe(token => {
					sessionStorage.setItem('plaidtoken', token);
					const account = BACKEND_ACCOUNT[data.applicationtype];
					this.pageLoaderSvc.show(true, false);
					this.router.navigate([`/${account}/plaid`]);
				});
			} else {
				this.workItem = data.workItem;
				this.productList = data.productList;
				this.products = data.products;
				this._createAccountForm();
				this._getDateByBusinessDays();
				// this._getFundingLimits();
				if (data.isExisting) {
					this.existingUser = true;
					this._fundingSvc.getExistingAccounts().subscribe(accounts => {
						this.existingAccountList = accounts;
						this.accountsExist = this.existingAccountList && this.existingAccountList.length > 0 ? true : false;
						this.pageLoaderSvc.hide();
					}, error => {
						this.pageLoaderSvc.hide();
					});
				} else {
					this.pageLoaderSvc.hide();
				}
			}
		}, error => {
			this.pageLoaderSvc.hide();
		});
		// uncomment to test using dummy data
		// this._createAccountForm();
		// this.pageLoaderSvc.hide();
	}

	_getDateByBusinessDays() {
		this._fundingSvc.getDateByBusinessDays(5).subscribe(result => {
			this.expectedDate = result.expecteddate;
		});
	}

	_getFundingLimits() {
		this.sharedMdm.getFundingLimits(this.applicationType).subscribe(result => {
			this.fundingLimits = result;
		});
	}

	_createForms() {
		this.accountForm = new FormGroup({
			accountList: new FormArray([])
		});
		this.questionsForm = new FormGroup({
			questionList: new FormArray([])
		});
		this.exisitngAccounts = new FormGroup({
			accountDetail: new FormControl('', {
				validators: [Validators.required]
			})
		});
	}

	_createAccountForm() {
		const formArray = this.accountForm.get('accountList') as FormArray;
		// uncomment to test using dummy data
		// this.productList = [{
		// 	minopeningdeposit: '25.00',
		// 	displayname: 'Checking Product',
		// 	atmcard: false,
		// 	accounttypedescription: '',
		// 	ach: false,
		// 	billpay: false,
		// 	debitcard: false,
		// 	estatements: true,
		// 	interestrate: 0.20,
		// 	isbusinesscustomer: false,
		// 	oktopay: false,
		// 	olb: false,
		// 	onlinewire: false,
		// 	productid: '010',
		// 	productname: 'Free Checking',
		// 	productshareid: '234',
		// 	sharetypename: 'sadfsdf',
		// 	status: true,
		// 	producttype: 'DD',
		// 	accounttypeid: 'asadad',
		// 	minimumamount: 0.00
		// }];
		this.productList.forEach(product => {
			// let amount = new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.minopeningdeposit);
			// amount = amount.replace('$', '').replace(/\,/g, '').trim();
			let cdProduct = [];
			if (product.producttype === 'CD') {
				cdProduct = this.products.filter(x => x.productid === product.productid);
			}
			const productAmount = cdProduct.length > 0 ? cdProduct[0].dividendamount : product.minopeningdeposit;
			const amount = this.getFloatAmountString(productAmount);

			formArray.push(new FormControl(amount, {
				validators: [
					Validators.required,
					this.minAmountValidator(parseFloat(product.minopeningdeposit))
				],
				// updateOn: 'blur'
			}));
		});
	}

	minAmountValidator(value: number): ValidatorFn {
		return function (control: AbstractControl) {
			return parseFloat(control.value) < value ? { 'minamount': true } : null;
		};
	}

	proceedFunding(section) {
		// if (!this.formUtilityService.displayValidations(this.accountForm['controls'].accountList)) {
		// 	this.disableAmountFields = !this.disableAmountFields;
		// 	const fundingAmount = this.getTotalAmount();
		// 	if (this.disableAmountFields) {
		// 		if (fundingAmount > 0) {
		// 			this.showPaymentOptions = true;
		// 		} else {
		// 			this._checkZeroPayment();
		// 		}
		// 	} else {
		// 		this.exisitngAccounts.reset();
		// 		this.showPaymentOptions = false;
		// 	}
		// }
		switch (section) {
			case 'accounts':
				if (!this.formUtilityService.displayValidations(this.accountForm['controls'].accountList)) {
					this.disableAmountFields = !this.disableAmountFields;
					if (this.disableAmountFields) {
						const fundingAmount = this.getTotalAmount();
						if (this.applicationType === 'consumerDeposit' && fundingAmount >= this.queryFundingAmount) {
							this.pageLoaderSvc.show(true, true);
							this.showQuestions = true;
						} else if (fundingAmount > 0) {
							this.showPaymentOptions = true;
						} else {
							this._checkZeroPayment();
						}
					} else {
						this.exisitngAccounts.reset();
						this.showQuestions = false;
						this.showPaymentOptions = false;
						this.disableQuestionFields = false;
					}
				}
				break;
			case 'questions':
				this.disableQuestionFields = !this.disableQuestionFields;
				if (this.disableQuestionFields) {
					this.pageLoaderSvc.show(true, true);
					this._fundingSvc.saveFundingQuestionnaire(this.dueDiligence.questionsList).subscribe((data) => {
						this.pageLoaderSvc.hide();
						this.showPaymentOptions = true;
					}, error => {
						this.pageLoaderSvc.hide();
					});
				} else {
					this.exisitngAccounts.reset();
					this.showPaymentOptions = false;
				}
				break;
		}
	}

	getTotalAmount() {
		const initialAmount = 0;
		const finalTotal = this.accountForm.get('accountList')['controls'].reduce((total, account) => {
			let val = parseFloat(account.value);
			if (Number.isNaN(val)) {
				val = 0;
			}
			return total + val;
		}, initialAmount);
		// let cal = new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(finalTotal);
		// cal = cal.replace('$', '').replace(/\,/g, '').trim();
		return finalTotal;
	}

	getTotalAmountString() {
		const totalAmount = this.getTotalAmount();
		return this.getAmountString(totalAmount);
	}

	// onChangeAchTerm() {
	// 	if (this.isAchtermsSelected) {
	// 		this.achTermError = false;
	// 	} else {
	// 		this.achTermError = true;
	// 	}
	// }

	getToken() {
		// todo: actual integration on https
	}

	_isFundingLimitValid(method) {
		let isValid = true;
		const fundingAmount = this.getTotalAmount();
		if (this.fundingLimits && this.fundingLimits.length > 0) {
			this.fundingLimits.forEach((item) => {
				if (item.fundingtype === method) {
					if (fundingAmount > parseInt(item['fundinglimit'], 10)) {
						isValid = false;
					}
				}
			});
		}
		return isValid;
	}

	initiatePayment(fundingMethod: string) {
		// if (this._isFundingLimitValid(fundingMethod)) {
		if (fundingMethod === 'internal') {
			this._internalPayment();
		} else if (fundingMethod === 'ach') {
			this._achPayment();
		} else if (fundingMethod === 'check') {
			this._checkPayment();
		} else if (fundingMethod === 'external') {
			this._cardPayment();
		}
		// } else {
		// 	if (fundingMethod === 'internal') {
		// 		throw new ApplicationError('3001');
		// 	} else if (fundingMethod === 'ach') {
		// 		throw new ApplicationError('3002');
		// 	} else if (fundingMethod === 'external') {
		// 		throw new ApplicationError('3000');
		// 	} else if (fundingMethod === 'check') {
		// 		throw new ApplicationError('3005');
		// 	}
		// }
	}

	_internalPayment() {
		if (!this.formUtilityService.displayValidations(this.exisitngAccounts)) {
			if (this.internalFundingCount < 3) {
				this.internalFundingCount++;
				this.pageLoaderSvc.show(true, true);
				const accountNumber = this.exisitngAccounts.get('accountDetail').value;
				const selectedAccount: AccountList = this.existingAccountList.filter(x => x.accountnumber === accountNumber)[0];
				const productList = this._getProductList();
				const totalamount = this.getTotalAmount();
				const internalData = {
					sourceacc: selectedAccount.accountnumber,
					sourceaccounttype: selectedAccount.accounttype,
					amount: totalamount
				};
				this._fundingSvc.makeInternalPayment(internalData, productList, totalamount).subscribe((data) => {
					this.pageLoaderSvc.hide();
					const account = BACKEND_ACCOUNT[this.applicationType];
					this.router.navigate(['/' + account + '/' + BACKEND_STATE[data]]);
				}, error => {
					this._fundingSvc.getUIState().subscribe((response) => {
						if (response && response.nextuistate === 'FundingLocked') {
							const account = BACKEND_ACCOUNT[this.applicationType];
							this.router.navigate(['/' + account + '/' + BACKEND_STATE['FundingLocked']]);
							throw new ApplicationError('1013');
						} else {
							throw new ApplicationError('1012');
							// this.pageLoaderSvc.hide();
						}
					});
				});
			} else {
				const account = BACKEND_ACCOUNT[this.applicationType];
				this.router.navigate(['/' + account + '/' + BACKEND_STATE['FundingLocked']]);
				throw new ApplicationError('1013');
			}
		}
	}

	_checkPayment() {
		this.pageLoaderSvc.show(true, true);
		const productList = this._getProductList();
		const totalamount = this.getTotalAmount();
		this._fundingSvc.makeCheckPayment(productList, totalamount).subscribe((data) => {
			this.pageLoaderSvc.hide();
			const account = BACKEND_ACCOUNT[this.applicationType];
			this.router.navigate(['/' + account + '/' + BACKEND_STATE[data]]);
		}, error => {
			this._fundingSvc.getUIState().subscribe((response) => {
				if (response && response.nextuistate === 'FundingLocked') {
					const account = BACKEND_ACCOUNT[this.applicationType];
					this.router.navigate(['/' + account + '/' + BACKEND_STATE['FundingLocked']]);
					throw new ApplicationError('1013');
				} else {
					this.pageLoaderSvc.hide();
				}
			});
			// this.pageLoaderSvc.hide();
		});
	}

	_checkZeroPayment() {
		this.pageLoaderSvc.show(true, true);
		const productList = this._getProductList();
		const totalamount = this.getTotalAmount();
		this._fundingSvc.makeZeroPayment(productList, totalamount).subscribe((data) => {
			this.pageLoaderSvc.hide();
			const account = BACKEND_ACCOUNT[this.applicationType];
			this.router.navigate(['/' + account + '/' + BACKEND_STATE[data]]);
		}, error => {
			this.pageLoaderSvc.hide();
		});
	}

	_achPayment() {
		// if (this.isAchtermsSelected) {
		// 	this.openPlaidPopup = true;
		// }
		// else {
		// 	this.achTermError = true;
		// }
		let validForm = false;
		validForm = this.formUtilityService.displayValidations(this.achForm, validForm);
		if (!validForm) {
			this.pageLoaderSvc.show(true, false);
			const account = BACKEND_ACCOUNT[this.applicationType];
			let accountBody = {};
			accountBody = {
				fundingview: {
					totalamount: this.getTotalAmount(),
					transfertype: 'ach',
					productlist: this._getProductList(),
				},
				achview: this.achForm.value
			};
			this._fundingSvc.validatePlaidAccount(accountBody).subscribe((resp: any) => {
				this.pageLoaderSvc.hide();
				if (resp === 'applicationCompleted') {
					this.router.navigate(['/' + account + '/finish/success']);
				} else if (resp === 'achInProgress') {
					this.router.navigate(['/' + account + '/funding/ach-inprogress']);
				} else if (resp === 'MDInProgress') {
					this.router.navigate(['/' + account + '/funding/plaid']);
				} else if (resp === 'AMDInProgress') {
					this.router.navigate(['/' + account + '/funding/amd-inprogress']);
				}
			}, error => {
				if (error.error.code === 2114) {
					// this.plaidExit.emit();
					this.router.navigate(['/' + account + '/account-funding/insufficient-funds']);
					// throw new ApplicationError('1015');
				} else {
					// this.plaidExit.emit();
					this.pageLoaderSvc.hide();
					throw new ApplicationError(error.error.code);
				}
			});
		}
	}

	_getProductList() {
		return this.accountForm.value['accountList'].map((amount, index) => {
			return {
				productid: this.productList[index].productid,
				amount
			};
		});
	}

	saveData() {
		this.pageLoaderSvc.show(true, false);
		this._fundingSvc.processSaveAndExit().subscribe((data: any) => {
			if (data === 'success') {
				// this.session.clearSession();
				const account = BACKEND_ACCOUNT[this.applicationType];
				this.router.navigate(['/' + account + '/' + BACKEND_STATE['saveAndExit']]);
			}
		});
	}

	// private _accountMatchValidator(accountForm: FormGroup) {
	// 	if (accountForm.get('accountnumber').value && accountForm.get('confirmaccountnumber').value) {
	// 		return accountForm.get('accountnumber').value.toLowerCase() === accountForm.get('confirmaccountnumber').value.toLowerCase() ? null : { 'mismatch': true };
	// 	}
	// 	return null;
	// }

	achTermOfServiceClick() {
		window.open('https://www.newgensoft.com/', '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
	}

	getFormattedAmount(incomeIndex: number) {
		let amount = this.accountForm.getRawValue()['accountList'][incomeIndex];
		if (amount) {
			amount = amount - 0;
			// let cal = new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
			// cal = cal.replace('$', '').replace(/\,/g, '').trim();
			const formattedAmount = this.getFloatAmountString(amount);
			this.accountForm.controls.accountList['controls'][incomeIndex].patchValue(formattedAmount);
		}
	}

	getFloatAmountString(amount: any) {
		const floatAmount = this.getAmountString(amount).replace(/\,/g, '').trim();
		return floatAmount;
	}

	getAmountString(amount: any) {
		const amountString = new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount).replace('$', '').trim();
		return amountString;
	}

	toggleAccordion(type: string) {
		Object.keys(this.accordionType).forEach(accordion => {
			if (accordion === type) {
				this.accordionType[accordion] = !this.accordionType[accordion];
			} else {
				this.accordionType[accordion] = false;
			}
		});
		if (type = 'showFinancial') {
			// this.achTermError = false;
			this.isAchtermsSelected = false;
			if (!this.achForm) {
				this._createACHForm();
			}
		}
		// this.accordionType[type] = !this.accordionType[type];
		// this.accordionType = {
		// 	showFinancial: false,
		// 	showCheck: false
		// };
	}

	plaidExit(event) {
		// console.log(event);
		// this.pageLoaderSvc.hide();
		this.openPlaidPopup = false;
		this._fundingSvc.getUIState().subscribe((response) => {
			if (response && response.nextuistate === 'FundingLocked') {
				const account = BACKEND_ACCOUNT[this.applicationType];
				this.router.navigate(['/' + account + '/' + BACKEND_STATE['FundingLocked']]);
				throw new ApplicationError('1013');
			} else {
				this.pageLoaderSvc.hide();
			}
		});
	}

	_cardPayment() {
		if (this.paymentCard.isCardDetailsValid(this.paymentCard.cardForm)) {
			const cardDetails = this.paymentCard.getCredentials();
			const productList = this._getProductList();
			const totalamount = this.getTotalAmount();
			this.pageLoaderSvc.show(true, true);
			this._fundingSvc.makeCardPayment(cardDetails, productList, totalamount).subscribe((resp: any) => {
				this._navigate(resp);
			}, error => {
				this.checkFundingLocked(error);
			});
			// this._fundingSvc.makeCardPayment(paymentData, cardDetails);
		} else {

		}
		// if (!this.formUtilityService.displayValidations(this.paymentCard.cardForm)) {
		// this.pageLoaderSvc.show(true, true);
		// this._checkPayment();
		// }
	}

	_navigate(state: string) {
		this.pageLoaderSvc.hide();
		const account = BACKEND_ACCOUNT[this.applicationType];
		this.router.navigate(['/' + account + '/' + BACKEND_STATE[state]]);
	}

	checkFundingLocked(error?: any) {
		this._fundingSvc.getUIState().subscribe(data => {
			if (data && data.nextuistate === 'FundingLocked') {
				this._navigate(data.nextuistate);
				throw new ApplicationError('1013');
			} else if (error) {
				console.log(error);
				throw new ApplicationError('1012');
			}
			this.pageLoaderSvc.hide();
		});
	}

	_createACHForm() {
		this.achForm = new FormGroup({
			accountName: new FormControl('', {
				validators: CustomValidation.accountname,
				updateOn: 'blur'
			}),
			accountNumber: new FormControl('', {
				validators: CustomValidation.accountnumber,
				updateOn: 'blur'
			}),
			accountType: new FormControl('', {
				validators: CustomValidation.firstname,
				updateOn: 'blur'
			}),
			routingNumber: new FormControl('', {
				validators: CustomValidation.routingnumber,
				updateOn: 'blur'
			}),
			financialInstitute: new FormControl('', {
				validators: CustomValidation.institutionname,
				updateOn: 'blur'
			})
		});
	}

	toggleAccountType(accountType: string) {
		if (accountType) {
			this.achForm.patchValue({ accountType: accountType });
		}
	}

	routingNumberChanged() {
		if (!this.achForm['controls'].routingNumber.errors) {
			this.pageLoaderSvc.show(true, true);
			const rn = this.achForm['controls'].routingNumber.value;
			this._fundingSvc.getInstitutionName(rn).subscribe(res => {
				this.achForm.patchValue({
					'financialInstitute': res['name']
				});
				this.pageLoaderSvc.hide();
			});
		} else {
			this.achForm.patchValue({
				'financialInstitute': null
			});
		}
	}
}
