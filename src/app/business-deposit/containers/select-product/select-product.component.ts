/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Business Deposit
File Name              :		select-product.component.ts
Author                 :		Amir Masood
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
import { InterestRates } from '../../../core/models/fields-value.model';
import { Product } from '../../../core/models/product.model';
import { AppConstants } from '../../../core/utility/app.constants';
import { CustomValidation } from '../../../core/utility/custom-validations';

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

	maxProductsAllowed = AppConstants.maxConsumerProducts;
	activeProducts: Array<Product>;

	CODProductGroup = this.formBuilder.group({
		CODProductFormArray: this.formBuilder.array([])
	});
	minDepositCd = '';
	ratesHyperLink = '';
	interestRates: Array<InterestRates>;
	selectedProductList: SelectedProduct[] = [];
	visibleFeatureList = [];
	viewSavingsInterest = false;
	viewMoneyMarketInterest = false;
	viewIoltaInterest = false;
	showMoreTerms = false;

	checkingProduct = false;
	savingProduct = true;
	certificateDepositProduct = true;

	amountForSelectedProducts = 0;
	showMaximumAmountError = false;
	maxAmount: number;

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
		this.dataService.changeStepper({ name: '/business-deposit/select-product', index: 1, personalStepper: 'businessDeposit' });

		this.mdm.getProducts('businessShare').subscribe(data => {
			this.activeProducts = data.filter(product => product.status);
			this.activeProducts.map((item) => {
				item.showhighlighter = item.highlighter ? true : false;
			});
			this.getInterestRates();
			this.fetchAndPrefillProducts();
			this.selectedProductList.forEach(product => {
				this.updateProductTotalAmount(true, this.getProductAmount(product.productid));
			});

			this.mdm.getProductsMaxAmount('external').subscribe(product => {
				this.maxAmount = +product[0]['fundingLimit'];
			});
		});
	}

	get CODProductFormArray() {
		return this.CODProductGroup.get('CODProductFormArray') as FormArray;
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

	private fetchAndPrefillProducts() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			this.selectProductSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
				if (data.products) {
					sessionStorage.setItem('productIdList', JSON.stringify(data.products));
				}
				this.preselectProducts();
				this.createCdForm();
				this.pageLoaderSvc.hide();
			});
		} else {
			this.preselectProducts();
			this.createCdForm();
			this.pageLoaderSvc.hide();
		}
	}

	private preselectProducts() {
		const productIdList = sessionStorage.getItem('productIdList');
		if (productIdList && productIdList !== 'undefined') {
			this.selectedProductList = JSON.parse(productIdList);

			this.selectedProductList.forEach((product: SelectedProduct) => {
				const preselectedProduct: Product = this.getProduct(product.productid);
				if (preselectedProduct.producttype === 'CD') {
					preselectedProduct.dividendtype = product.dividendtype;
					preselectedProduct.dividendamount = Number(product.dividendamount);
					preselectedProduct.cdterm = Number(product.cdterm);
				}
				this.updateProductTotalAmount(true, this.getProductAmount(product.productid));
			});
		}
	}

	createCdForm() {
		this.activeProducts = this.activeProducts.filter(product => {
			if (product.producttype === 'CD') {
				this.minDepositCd = product.minopeningdeposit;
				this.ratesHyperLink = product.hyperlink;
				// const dividendtype = product.dividendtype ? product.dividendtype : 'quaterly';
				const dividendtype = 'monthly';
				const formGroup = new FormGroup({
					viewcdinterest: new FormControl(false),
					apy: new FormControl(''),
					productid: new FormControl(product.productid),
					description: new FormControl(product.displayname),
					minimumdeposit: new FormControl(product.minopeningdeposit),
					dividendtype: new FormControl(dividendtype),
					dividendamount: new FormControl(product.dividendamount, {
						validators: [
							Validators.min(parseFloat(product.minopeningdeposit)),
							Validators.pattern(this.amountPattern),
							Validators.required
						],
						updateOn: 'blur'
					}),
					isselected: new FormControl(false),
					cdterm: new FormControl(product.cdterm, {
						validators: [
							Validators.min(product.minterm),
							Validators.max(product.maxterm),
							Validators.pattern(this.numberPattern),
						],
						updateOn: 'blur'
					}),
					termunit: new FormControl(product.termunit)
				});
				this.CODProductFormArray.push(formGroup);
				if (product.dividendamount) {
					this.onChangeOfCdAmount(this.CODProductFormArray.value.length - 1, product.productid, product.dividendamount);
				}
			}
			return true;
		});
		for (let i = 0; i < this.CODProductFormArray.length; i++) {
			const codID = this.CODProductFormArray.controls[i].get('productid').value;
			this.selectedProductList.forEach((product: SelectedProduct) => {
				const preselectedProduct: Product = this.getProduct(product.productid);
				if (preselectedProduct.productid === codID) {
					this.CODProductFormArray.controls[i].patchValue({
						dividendamount: this.formUtilityService.getFloatAmountString(product.dividendamount), cdterm: Number(product.cdterm),
						isselected: true
					});
				}
				if (product.dividendamount) {
					this.onChangeOfCdAmount(i, product.productid, product.dividendamount);
				}
			});
		}
	}

	getProductAmount(productID: string) {
		const product: Product = this.getProduct(productID);
		if (product) {
			return parseFloat(product.minopeningdeposit);
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

	getProduct(id: string) {
		if (!this.activeProducts) {
			return;
		}
		return this.activeProducts.find((value) => {
			return value.productid === id;
		});
	}

	onChangeOfCdAmount(index: number, id: string, amount: number) {
		this.selectedProductList.map((product) => {
			if (product.productid === id) {
				product.dividendamount = amount;
			}
		});
		const cdProduct = this.CODProductGroup.controls.CODProductFormArray['controls'][index];
		if (cdProduct.controls.productid.value === id) {
			// const productAmounts = this.interestRates.filter(rates => rates.productid === id);
			const productAmounts = this.interestRates[id];
			const filteredProduct = productAmounts.find(product => {
				return Number(amount) >= Number(product.minamount) && (Number(amount) <= Number(product.maxamount) || product.maxamount === '');
			});
			if (filteredProduct && filteredProduct.apy) {
				cdProduct.patchValue({ apy: filteredProduct.apy });
			} else {
				cdProduct.patchValue({ apy: '' });
			}
		}
	}

	selectedProduct(id: string): boolean {
		return this.getExistingProductIndex(id) !== -1;
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
			this.selectedProductList.splice(this.getExistingProductIndex(id), 1);
			if (codProduct) {
				for (let i = 0; i < this.CODProductFormArray.length; i++) {
					const codID = this.CODProductFormArray.controls[i].get('productid').value;
					if (id === codID) {
						this.CODProductFormArray['controls'][i]['controls'].dividendamount.reset();
						this.CODProductFormArray['controls'][i]['controls'].cdterm.reset();
						this.CODProductFormArray['controls'][i]['controls'].isselected.reset();
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
						if (!this.enableCheck(i)) {
							const selectedProductInfo: SelectedProduct = {
								productid: id,
								dividendamount: this.CODProductFormArray['controls'][i]['controls'].dividendamount.value,
								cdterm: this.CODProductFormArray['controls'][i]['controls'].cdterm.value,
								dividendtype: this.CODProductFormArray['controls'][i]['controls'].dividendtype.value,
							};
							this.selectedProductList.push(selectedProductInfo);
						} else {
							this.CODProductGroup.get('CODProductFormArray')['controls'][i]['controls'].isselected.setValue(false);
						}
					}
				}
			} else {
				const product = this.activeProducts.filter(data => data.productid === id)[0];
				this.selectedProductList.push({ productid: product.productid, dividendamount: product.minimumamount });
			}
			this.updateProductTotalAmount(true, this.getProductAmount(id));
		}
	}

	cdProductToggle(id: string) {
		if (this.selectedProduct(id)) {
			this.selectedProductList.splice(this.getExistingProductIndex(id), 1);
		} else {
			this.selectedProductList.push({ productid: id });
		}
	}

	// handleProceed(event, id: string): void {
	// 	event.preventDefault();
	// 	this.toggleProduct(id);
	// }

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

	getProductDisability(index: number, currentId: string) {
		const cdProduct = this.CODProductGroup.controls.CODProductFormArray['controls'][index];
		const amountField = cdProduct.get('dividendamount');
		const termField = cdProduct.get('cdterm');
		if (amountField.value === null || amountField.value === '' || amountField.errors || termField.value === null || termField.value === '' || termField.errors) {
			if (this.selectedProduct(currentId)) {
				this.selectedProductList.splice(this.getExistingProductIndex(currentId), 1);
				this.cdf.detectChanges();
			}
			return true;
		} else {
			return false;
		}
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		this.router.navigate(['/business-deposit/getting-started']);
	}

	nextStep(): void {
		this.pageLoaderSvc.show(true, false);
		const productIdList = this.selectedProductList;
		this.selectProductSvc.checkApplicationUniqueness(productIdList);
	}

	viewRatesClick(url) {
		window.open(url, '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
	}

	hideHighlighter(id) {
		this.activeProducts.find((product) => {
			return product.productid === id;
		}).showhighlighter = false;
	}

	enableCheck(i) {
		let flag = false;
		// const temp = this.CODProductGroup.get('CODProductFormArray')['controls'][i]['controls'].isselected;
		if (this.CODProductGroup.get('CODProductFormArray')['controls'][i]['controls'].dividendamount.value === null || this.CODProductGroup.get('CODProductFormArray')['controls'][i]['controls'].dividendamount.value === 0 || (this.CODProductGroup.get('CODProductFormArray')['controls'][i]['controls'].dividendamount.errors && this.CODProductGroup.get('CODProductFormArray')['controls'][i]['controls'].dividendamount.errors.min)) {
			// temp.disable();
			// temp.updateValueAndValidity({ onlySelf: true });
			flag = true;
		} else {
			// temp.enable();
			// temp.updateValueAndValidity({ onlySelf: true });
			flag = false;
		}
		return flag;
	}

	checkInput(i) {
		if (!this.enableCheck(i)) {
			return this.CODProductGroup.get('CODProductFormArray')['controls'][i]['controls'].isselected.value === true ? true : false;
		}
	}

}
