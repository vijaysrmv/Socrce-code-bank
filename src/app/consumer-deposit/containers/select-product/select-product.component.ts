/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Consumer Deposit
File Name              :		select-product.component.ts
Author                 :		Aditya Agrawal
Date (DD/MM/YYYY)      :		06/09/2019
Description            :		Product selection page for selecting products
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { SelectProductService } from './select-product.service';
import { MdmService } from '../../../core/apis/mdm.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';
import { FormUtilityService } from '../../../core/services/form-utility.service';
import { SharedMdmService } from '../../../shared/services/shared-mdm.service';
import { slideUpDownAnimation, slideProductPopupAnimation, slideDownUpAnimation } from '../../../shared/animations/slide.animation';

import { ApplicationDetails, SelectedProduct } from '../../../core/models/application.model';
// import { PRODUCTLIST } from '../../../core/models/enums';
import { InterestRates } from '../../../core/models/fields-value.model';
import { Product } from '../../../core/models/product.model';
import { AppConstants } from '../../../core/utility/app.constants';
import { CustomValidation } from '../../../core/utility/custom-validations';
import { IMyInputFieldChanged, IMyDpOptions } from 'mydatepicker';


@Component({
	selector: 'app-select-product',
	animations: [slideProductPopupAnimation, slideUpDownAnimation, slideDownUpAnimation],
	templateUrl: './select-product.component.html',
	styleUrls: ['./select-product.component.scss'],
	providers: [
		SelectProductService
	]
})
export class SelectProductComponent implements OnInit {

	// maxProductsAllowed = AppConstants.maxConsumerProducts;
	activeProducts: Array<Product>;
	allActiveProducts: Array<Product>;
	certificateDepositProductList: Array<Product>;

	CODProductGroup = this.formBuilder.group({
		CODProductFormArray: this.formBuilder.array([])
	});

	interestRates: Array<InterestRates>;
	selectedProductList: SelectedProduct[] = [];
	visibleFeatureList = [];
	viewSavingsInterest = false;
	viewMoneyMarketInterest = false;
	showMoreTerms = false;

	checkingProduct = false;
	savingProduct = true;
	certificateDepositProduct = true;
	openCDAccordion = false;

	hideSavingProducts = false;
	hideCheckingProducts = false;
	amountForSelectedProducts = 0;
	showMaximumAmountError = false;
	maxAmount: number;

	dateOfBirthForm: FormGroup;
	applicantDob: string;
	dobreferencedate: string;
	showDateOfBirthModal = false;
	showdobEditAlert = false;
	dobError = false;
	dobIncorrect = false;
	HSAcontributiontype = null;
	HSAplan = null;
	IRAcontributiontype = null;
	IRAplan = null;
	contributionTypes = [];
	planList = [];


	dateMask = {
		mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/],
		guide: false,
		placeholderChar: '\u2000',
		keepCharPositions: true,
		// pipe: createAutoCorrectedDatePipe('mm/dd/yyyy')
	};

	public dobOptions: IMyDpOptions = {
		dateFormat: 'mm/dd/yyyy',
		minYear: 1901,
		showTodayBtn: false,
		showInputField: false,
		showClearDateBtn: false,
		alignSelectorRight: true
	};

	amountPattern = CustomValidation.getPattern('amountPattern');
	numberPattern = CustomValidation.getPattern('numberPattern');

	constructor(
		private cdf: ChangeDetectorRef,
		private dataService: DataService,
		private formBuilder: FormBuilder,
		private formUtilityService: FormUtilityService,
		private mdm: MdmService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private selectProductSvc: SelectProductService,
		private sharedMdm: SharedMdmService
	) { }

	ngOnInit() {
		this.dataService.changeStepper({ name: '/consumer-deposit/select-product', index: 1, personalStepper: 'consumerDeposit' });
		this._dateOfBirthForm();
		this.mdm.getProductsMaxAmount('external').subscribe(product => {
			this.maxAmount = +product[0]['fundingLimit'];
			console.log(this.maxAmount);
		});
		this.mdm.getPlan().subscribe(data => {
			this.planList = data;
		});
		this.mdm.getContributionTypeList().subscribe(data => {
			this.contributionTypes = data;
		});
		this.mdm.getProducts('consumerShare').subscribe(data => {
			this.allActiveProducts = this.activeProducts = data.filter(product => product.status);
			this.activeProducts.map((item) => {
				item.showhighlighter = item.highlighter ? true : false;
				item.showoverlay = false;
				item.monthlymaintenancefee = item.monthlymaintenancefee ? `$${item.monthlymaintenancefee}.00` : 'None';
				item.disabled = false;
			});
			this.getInterestRates();
			this.fetchAndPrefillProducts();
			this.selectedProductList.forEach(product => {
				this.updateProductTotalAmount(true, this.getProductAmount(product.productid));
			});
		});
	}

	get CODProductFormArray() {
		return this.CODProductGroup.get('CODProductFormArray') as FormArray;
	}

	createCdForm() {
		const maxamount = this.maxAmount ? this.maxAmount.toString() : '';
		this.activeProducts = this.activeProducts.filter(product => {
			if (product.producttype === 'CD') {
				// const dividendtype = product.dividendtype ? product.dividendtype : 'quaterly';
				// const dividendtype = 'monthly';
				const formGroup = new FormGroup({
					viewcdinterest: new FormControl(false),
					// apy: new FormControl(''),
					productid: new FormControl(product.productid),
					description: new FormControl(product.displayname),
					minimumdeposit: new FormControl(product.minopeningdeposit),
					// dividendtype: new FormControl(dividendtype),
					dividendamount: new FormControl(product.dividendamount, {
						validators: [
							Validators.min(parseFloat(product.minopeningdeposit)),
							Validators.max(parseFloat(maxamount)),
							// Validators.pattern(this.amountPattern),
						],
						updateOn: 'blur'
					}),
					showhighlighter: new FormControl(product.showhighlighter),
					highlighter: new FormControl(product.highlighter),
					// cdterm: new FormControl(product.cdterm, {
					// 	validators: [
					// 		Validators.min(product.minterm),
					// 		Validators.max(product.maxterm),
					// 		Validators.pattern(this.numberPattern),
					// 	],
					// 	updateOn: 'blur'
					// }),
					hyperlink: new FormControl(product.hyperlink)
				});
				this.CODProductFormArray.push(formGroup);
				if (product.dividendamount) {
					this.onChangeOfCdAmount(undefined, this.CODProductFormArray.value.length - 1, product.productid, product.dividendamount);
				}
			}
			return true;
		});
		for (let i = 0; i < this.CODProductFormArray.length; i++) {
			const codID = this.CODProductFormArray.controls[i].get('productid').value;
			this.selectedProductList.forEach((product: SelectedProduct) => {
				const preselectedProduct: Product = this.getProduct(product.productid);
				if (preselectedProduct.productid === codID) {
					this.CODProductFormArray.controls[i].patchValue({ dividendamount: this.formUtilityService.getFloatAmountString(product.dividendamount), cdterm: Number(product.cdterm) });
				}
				if (product.dividendamount) {
					this.onChangeOfCdAmount(undefined, i, product.productid, product.dividendamount);
				}
			});
		}
	}

	private fetchAndPrefillProducts() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			this.selectProductSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
				sessionStorage.setItem('productIdList', JSON.stringify(data.products));
				this.applicantDob = data.personaldetails.dob;
				this.createCdForm();
				this.activeProducts = this.filterProducts(this.applicantDob);
				this.preselectProducts();
				this.dateOfBirthForm.controls.dob.setValue(data.personaldetails.dob);
				// this.dobreferencedate = data.personaldetails.dobreferencedate;
				this.dobError = false;
				this.showdobEditAlert = true;
				this.pageLoaderSvc.hide();
			});
		} else {
			this.preselectProducts();
			this.preselectDob();
			this.createCdForm();

			this.pageLoaderSvc.hide();
		}
	}

	private preselectProducts() {
		const productIdList = sessionStorage.getItem('productIdList');
		if (productIdList && productIdList !== 'undefined') {
			this.selectedProductList = JSON.parse(productIdList);
			if ((this.selectedProductList.findIndex(p => p.productid === 'HSA') !== -1) || this.selectedProductList.findIndex(p => p.productid === 'IRA') !== -1) {
				this.allActiveProducts.map(product => product.disabled = true);
				if (this.selectedProductList[0].productid === 'HSA') {
					this.selectedProductList[0].disabled = false;
					this.HSAplan = this.selectedProductList[0].plantype;
					this.HSAcontributiontype = this.selectedProductList[0].contributiontype;
				} else if (this.selectedProductList[0].productid === 'IRA') {
					this.selectedProductList[0].disabled = false;
					this.IRAplan = this.selectedProductList[0].plantype;
					this.IRAcontributiontype = this.selectedProductList[0].contributiontype;
				}
			} else {
				this.selectedProductList.forEach((product: SelectedProduct) => {
					const preselectedProduct: Product = this.getProduct(product.productid);
					if (preselectedProduct.producttype === 'CD') {
						// preselectedProduct.dividendtype = product.dividendtype;
						preselectedProduct.dividendamount = Number(product.dividendamount);
						// preselectedProduct.cdterm = Number(product.cdterm);
					}
					this.updateProductTotalAmount(true, this.getProductAmount(product.productid));
				});
			}
		}

	}

	private preselectDob() {
		const dob = sessionStorage.getItem('dob');
		if (dob) {
			this.applicantDob = dob;
			this.dateOfBirthForm.controls.dob.setValue(this.applicantDob);
			this.dobError = false;
			this.showdobEditAlert = true;
			this.activeProducts = this.filterProducts(this.applicantDob);
		} else {
			this.pageLoaderSvc.hide();
			this.activeProducts = this.allActiveProducts;
			this.showDateOfBirthModal = true;
			this.showdobEditAlert = false;
		}
	}

	getInterestRates() {
		if (this.sharedMdm.interestRates && this.sharedMdm.interestRates.length > 0) {
			this.interestRates = this.sharedMdm.interestRates;
			this.setInterestRates();
		} else {
			this.sharedMdm.getInterestRates().subscribe((data) => {
				this.interestRates = data;
				this.setInterestRates();
			});
		}
	}

	setInterestRates() {
		const products = [];
		const productRates = [];
		this.interestRates.forEach(item => {
			if (!products.includes(item.productid)) {
				products.push(item.productid);
			}
		});
		this.interestRates.forEach(item => {
			products.forEach(id => {
				if (item.productid === id) {
					if (productRates[id] && productRates[id].length) {
						productRates[id].push(item);
					} else {
						productRates[id] = [];
						productRates[id].push(item);
					}
				}
			});
		});
		this.interestRates = productRates;
	}

	getExistingProductIndex(id: string) {
		return this.selectedProductList.findIndex(product => {
			return product.productid === id;
		});
	}

	selectProduct(currentID: string): void {
		this.toggleProduct(currentID);
	}

	toggleProduct(id: string): void {
		const codProduct = this.getProduct(id).producttype === 'CD';
		if (this.selectedProduct(id)) {
			if (id === '62-DD-100' || id === '62-SV-100') {
				this.selectedProductList.splice(this.getExistingProductIndex('62-DD-100'), 1);
				this.selectedProductList.splice(this.getExistingProductIndex('62-SV-100'), 1);
			} else {
				if (id === 'HSA' || id === 'IRA') {
					this.allActiveProducts.map(p => p.disabled = (p.productid === 'HSA' || p.productid === 'IRA') ? true : false);
				}
				this.HSAplan = this.IRAplan = this.HSAcontributiontype = this.IRAcontributiontype = null;
				this.selectedProductList.splice(this.getExistingProductIndex(id), 1);
			}
			if (codProduct) {
				for (let i = 0; i < this.CODProductFormArray.length; i++) {
					const codID = this.CODProductFormArray.controls[i].get('productid').value;
					if (id === codID) {
						this.CODProductFormArray['controls'][i]['controls'].dividendamount.reset();
						// this.CODProductFormArray['controls'][i]['controls'].cdterm.reset();
						// this.CODProductFormArray['controls'][i]['controls'].dividendtype.patchValue('monthly');
					}
				}
			}
			this.updateProductTotalAmount(false, this.getProductAmount(id));
		} else {
			// if (this.selectedProductList.length >= this.maxProductsAllowed) {
			// 	throw new ApplicationError('1007');
			// }
			if (codProduct) {
				for (let i = 0; i < this.CODProductFormArray.length; i++) {
					const codID = this.CODProductFormArray.controls[i].get('productid').value;
					if (id === codID) {
						const selectedProductInfo: SelectedProduct = {
							productid: id,
							dividendamount: this.CODProductFormArray['controls'][i]['controls'].dividendamount.value,
							// cdterm: this.CODProductFormArray['controls'][i]['controls'].cdterm.value,
							// dividendtype: this.CODProductFormArray['controls'][i]['controls'].dividendtype.value,
						};
						this.selectedProductList.push(selectedProductInfo);
					}
				}
			} else {
				if (id === '62-DD-100' || id === '62-SV-100') {
					const product1 = this.activeProducts.filter(data => data.productid === '62-DD-100')[0];
					const product2 = this.activeProducts.filter(data => data.productid === '62-SV-100')[0];
					this.selectedProductList.push({ productid: product1.productid, dividendamount: product1.minimumamount });
					this.selectedProductList.push({ productid: product2.productid, dividendamount: product2.minimumamount });
				} else {
					const product = this.activeProducts.filter(data => data.productid === id)[0];
					if (id === 'HSA' || id === 'IRA') {
						this.selectedProductList = [];
						this.allActiveProducts.map(p => p.disabled = true);
						product.plantype = (id === 'HSA') ? this.HSAplan : this.IRAplan;
						product.contributiontype = (id === 'HSA') ? this.HSAcontributiontype : this.IRAcontributiontype;
					} else {
						this.HSAplan = this.IRAplan = this.HSAcontributiontype = this.IRAcontributiontype = null;
					}
					product.disabled = false;
					this.selectedProductList.push({ productid: product.productid, dividendamount: product.minimumamount, plantype: product.plantype, contributiontype: product.contributiontype });
				}
			}
			this.updateProductTotalAmount(true, this.getProductAmount(id));
		}
	}

	updateProductTotalAmount(addAmount: boolean, selectedProductAmount: number) {
		if (addAmount) {
			this.amountForSelectedProducts = this.amountForSelectedProducts + selectedProductAmount;
		} else {
			this.amountForSelectedProducts = this.amountForSelectedProducts - selectedProductAmount;
		}

		if (this.amountForSelectedProducts > this.maxAmount) {
			this.showMaximumAmountError = true;
		} else {
			this.showMaximumAmountError = false;
		}
	}

	onChangeOfCdAmount(event: any, index: number, id: string, amount: number) {
		const cdProduct = this.CODProductGroup.controls.CODProductFormArray['controls'][index];
		if (event) {
			let amountVal;
			amountVal = event.target.value;
			if (+amountVal >= +this.activeProducts.find(product => product.productid === id).minopeningdeposit) {
				cdProduct.controls.dividendamount.setValue(amountVal);
				this.cdf.detectChanges();
			}else {
				cdProduct.controls.dividendamount.setValue(event.target.value);
			}
		}
		this.selectedProductList.map((product) => {
			if (product.productid === id) {
				product.dividendamount = amount;
			}
		});
		// const cdProduct = this.CODProductGroup.controls.CODProductFormArray['controls'][index];
		// if (cdProduct.controls.productid.value === id) {
		// const productAmounts = this.interestRates.filter(rates => rates.productid === id);
		// const productAmounts = this.interestRates[id];
		// const filteredProduct = productAmounts.find(product => {
		// 	return Number(amount) >= Number(product.minamount) && (Number(amount) <= Number(product.maxamount) || product.maxamount === '');
		// });
		// if (filteredProduct && filteredProduct.apy) {
		// 	cdProduct.patchValue({ apy: filteredProduct.apy });
		// } else {
		// 	cdProduct.patchValue({ apy: '' });
		// }
		// }
	}

	cdProductToggle(id: string) {
		if (this.selectedProduct(id)) {
			this.selectedProductList.splice(this.getExistingProductIndex(id), 1);
		} else {
			this.selectedProductList.push({ productid: id });
		}
	}

	selectedProduct(id: string): boolean {
		return this.getExistingProductIndex(id) !== -1;
	}

	handleProceed(event, id: string): void {
		event.preventDefault();
		this.toggleProduct(id);
	}

	toggleFeature(id: String): void {
		if (this.visibleFeatureList.includes(id)) {
			this.visibleFeatureList.splice(this.visibleFeatureList.indexOf(id), 1);
		} else {
			this.visibleFeatureList.push(id);
		}
	}

	visibleFeature(id: String): boolean {
		return this.visibleFeatureList.includes(id);
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		this.router.navigate(['/consumer-deposit/getting-started']);
	}

	nextStep(): void {
		this.pageLoaderSvc.show(true, false);
		const hsaIndex = this.selectedProductList.findIndex(p => p.productid === 'HSA');
		const iraIndex = this.selectedProductList.findIndex(p => p.productid === 'IRA');
		if (hsaIndex !== -1 || iraIndex !== -1) {
			if (this.selectedProductList[hsaIndex].productid === 'HSA') {
				this.selectedProductList[hsaIndex].plantype = this.HSAplan;
				this.selectedProductList[0].contributiontype = this.HSAcontributiontype;
			} else if (this.selectedProductList[iraIndex].productid === 'IRA') {
				this.selectedProductList[iraIndex].plantype = this.IRAplan;
				this.selectedProductList[iraIndex].contributiontype = this.IRAcontributiontype;
			}
		}
		const productIdList = this.selectedProductList;
		this.selectProductSvc.checkApplicationUniqueness(productIdList);
	}

	getProduct(id: string) {
		if (!this.activeProducts) {
			return;
		}
		return this.activeProducts.find((value) => {
			return value.productid === id;
		});
	}

	getProductDisability(index: number, currentId: string) {
		const cdProduct = this.CODProductGroup.controls.CODProductFormArray['controls'][index];
		const amountField = cdProduct.get('dividendamount');
		// const termField = cdProduct.get('cdterm');
		const hsaoriraselected = (this.selectedProductList.findIndex(p => p.productid === 'HSA') !== -1) || (this.selectedProductList.findIndex(p => p.productid === 'IRA') !== -1);
		if (amountField.value === null || amountField.value === '' || amountField.errors || +amountField.value < +this.activeProducts.find(product => product.productid === currentId).minopeningdeposit || hsaoriraselected) {
			if (this.selectedProduct(currentId)) {
				this.selectedProductList.splice(this.getExistingProductIndex(currentId), 1);
				this.cdf.detectChanges();
			}
			return true;
		} else {
			return false;
		}
	}

	checkProductDisability(productid: string) {
		if (productid === 'HSA') {
			return (this.selectedProductList.findIndex(p => p.productid === 'IRA') !== -1) || ((!this.HSAplan || !this.HSAcontributiontype));
		} else {
			return (this.selectedProductList.findIndex(p => p.productid === 'HSA') !== -1) || ((!this.IRAplan || !this.IRAcontributiontype));
		}
	}

	getProductAmount(productID: string) {
		const product: Product = this.getProduct(productID);
		if (product) {
			return parseFloat(product.minopeningdeposit);
		}
	}

	private _dateOfBirthForm() {
		this.dateOfBirthForm = new FormGroup({
			dob: new FormControl(null, [Validators.required]),
			dobPicker: new FormControl(null)
		});
	}

	dateValidation(date: IMyInputFieldChanged) {
		if (!date.value && sessionStorage.getItem('dob')) {
			date.value = sessionStorage.getItem('dob');
		}
		const field = this.dateOfBirthForm['controls'].dob;
		if (field && field.value && date.value !== '' && date.value !== field.value) {
			field.setErrors({ 'invalid': true });
			field.markAsTouched();
		}
	}

	private _checkDateValidity(date: any) {
		const age = this.formUtilityService.getAge(date);
		if (age < 0 || age > 99) {
			return false;
		} else {
			return true;
		}
	}

	callSubmit(event: any, date: any) {
		const code = (event.keyCode ? event.keyCode : event.which);
		if (code === 13) {
			this.getAge(date);
		}
	}

	getAge(date: any) {
		if (this.formUtilityService.displayValidations(this.dateOfBirthForm)) {
			return;
		}
		this.activeProducts = this.filterProducts(date);
		if (this.applicantDob !== date) {
			sessionStorage.setItem('dob', date);
			this.applicantDob = date;
			this.selectedProductList = [];
		}
		this.showDateOfBirthModal = false;
		this.showdobEditAlert = true;
	}

	onDateChanged(date: IMyInputFieldChanged | any) {
		let resetPicker: boolean;
		if (date !== null && typeof date === 'object') {
			date = date.formatted;
		}
		const dateValue = new Date(date);
		const datePicker = { date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() } };
		const resetdatePicker = { date: { year: 0, month: 0, day: 0 } };
		if ((date) && (!(dateValue instanceof Date) || isNaN(dateValue.getTime()) || dateValue.getFullYear() < 1901)) {
			this.dobError = true;
		} else {
			this.dobError = false;
		}

		if (!this.dobError && this.formUtilityService.checkDOBWithRange(date, 99, 0)) {
			this.dobIncorrect = true;
		} else {
			this.dobIncorrect = false;
		}

		const field = this.dateOfBirthForm['controls'].dob;
		this.dateOfBirthForm.patchValue({ dob: date });
		if (this.dobIncorrect) {
			field.setErrors({ 'incorrect': true });
			// this.dobIncorrect = true;
		} else {
			if (field.value) {
				field.setErrors({});
				field.updateValueAndValidity();
			}
		}
		resetPicker = (this.dobError || !date) ? true : false;
		this.dateOfBirthForm.patchValue({ dobPicker: resetPicker ? resetdatePicker : datePicker });
	}

	hideHighlighter(id, type?: string, index?: number) {
		if (type === 'CD') {
			const cdProduct = this.CODProductGroup.controls.CODProductFormArray['controls'][index];
			cdProduct.patchValue({ showhighlighter: false });
		} else {
			this.activeProducts.find((product) => {
				return product.productid === id;
			}).showhighlighter = false;
		}

	}

	filterProducts(date) {
		const dob = new Date(date).getTime();
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const age = new Date(currentDate - dob);
		const actualAge = (age.getUTCFullYear() - 1970);
		let filteredProducts;
		filteredProducts = this.allActiveProducts.filter(product => {
			return actualAge <= Number(product.maxage) && actualAge >= Number(product.minage);
		});
		return filteredProducts;
	}

	openLink(url) {
		// e.preventDefault();
		window.open(url, '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
	}

	toggleOverlay(id) {
		if (this.selectedProduct(id)) {
			this.toggleProduct(id);
		} else {
			this.activeProducts.find((product) => {
				return product.productid === id;
			}).showoverlay = true;
		}
	}

	// plantypeChange(productid: string) {
	// 	const hsaIndex = this.selectedProductList.findIndex(p => p.productid === 'HSA');
	// 	const iraIndex = this.selectedProductList.findIndex(p => p.productid === 'HSA');
	// 	if (productid === 'HSA' && hsaIndex !== -1  && this.selectedProductList[hsaIndex].plantype === 'Family' && this.HSAplan === 'Individual') {
	// 		throw new ApplicationError('');
	// 	}else if (productid === 'IRA' && iraIndex !== -1  && this.selectedProductList[iraIndex].plantype === 'Family' && this.IRAplan === 'Individual') {
	// 		throw new ApplicationError('');
	// 	}
	// }

	// setContributionTypeList(productid: string, contributionTypeId?: string, callContributionType = false) {
	// 	const plan = (productid === 'HSA') ? this.HSAplan : this.IRAplan;
	// 	if (callContributionType) {
	// 		this.setContributionType(productid, contributionTypeId);
	// 	}
	// 	// 	this.pageLoaderSvc.hide();
	// 	// });
	// }

	// setContributionType(productid, id) {
	// 	const type = this.contributionTypes.filter((data) => data.id === id);
	// 	if (type && type.length > 0) {
	// 		if (productid === 'HSA') {
	// 			this.HSAcontributiontype = type[0].description;
	// 		} else {
	// 			this.IRAcontributiontype = type[0].description;
	// 		}
	// 	}
	// }

}


