import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';


import { UspsService } from '../../../core/apis/usps.service';
import { DataService } from '../../../core/services/data.service';
// import { FormUtilityService } from '../../../core/services/form-utility.service';
import { SharedMdmService } from '../../../shared/services/shared-mdm.service';

import { Address } from '../../../core/models/application.model';
import { States } from '../../../core/models/fields-value.model';
import { ZipDetails } from '../../../core/models/usps-response.model';
import { CustomValidation } from '../../../core/utility/custom-validations';

@Component({
	selector: 'app-address',
	templateUrl: './address.component.html',
	styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

	@Input() addressType: string;
	@Input() editContactInfo: boolean;
	@Input() editMailingAddress: boolean;
	@Input() selectedSingleAccount: boolean;
	@Input() showAdditionalAddressDetials: boolean;
	@Input() addressFor: string;
	@Input() showLengthOfStayInOLB = false;
	// @Input() showPreviousAddress = false;

	// @Output() callGetData = new EventEmitter();
	@Output() displayPreviousAddress = new EventEmitter();

	addressForm: FormGroup;
	allStates: Array<States>;
	page: string;
	accountType: string;
	disableAddressFields = false;
	physicalAddress = false;
	zipCode: string;

	zipcodeMask = CustomValidation.zipcodeMask;
	zipCodePattern = CustomValidation.getPattern('numberPattern');

	constructor(
		private dataService: DataService,
		// private formUtlityService: FormUtilityService,
		private sharedMdm: SharedMdmService,
		private usps: UspsService,
	) { }

	ngOnInit() {
		this.physicalAddress = this.addressType === 'physical' ? true : false;
		this.getInitialFieldData();
		this._createForm();
		this.dataService.currentStateCheck.subscribe(resp => {
			this.accountType = resp.accountType;
			this.page = resp.page;
		});
		if ((this.page === 'personalInfo' || this.page === 'review' || this.page === 'businessInfo') && this.physicalAddress) {
			const zipData = JSON.parse(sessionStorage.getItem('zipcode'));
			if (zipData !== null && zipData !== undefined) {
				//this.addressForm.patchValue({ zipcode: zipData['zip5'], city: zipData['city'], state: zipData['state'] });
				if(typeof(zipData) === 'object') {
					this.addressForm.patchValue({ zipcode: zipData['zip5']});
				}
				else {
					this.addressForm.patchValue({ zipcode: zipData});
				}
				
				this.zipCode = zipData;
				// setTimeout(() => {
				// 	this.disableAddressFields = true;
				// }, 0);
			}
		}
	}

	private _createForm() {
		this.addressForm = new FormGroup({
			numberandstreet: new FormControl('', {
				validators: this.physicalAddress ? CustomValidation.physicalAddress : CustomValidation.mailingAddress,
				updateOn: 'blur'
			}),
			aptorsuite: new FormControl('', {
				validators: CustomValidation.aptorsuite,
				updateOn: 'blur'
			}),
			zipcode: new FormControl('', {
				validators: CustomValidation.zipcode,
				updateOn: 'blur'
			}),
			city: new FormControl('', {
				validators: CustomValidation.city,
				updateOn: 'blur'
			}),
			state: new FormControl('', [Validators.required]),
		});
	}

	getInitialFieldData() {
		if (this.sharedMdm.allStates && this.sharedMdm.allStates.length > 0) {
			this.allStates = this.sharedMdm.allStates;
		} else {
			this.sharedMdm.getStates().subscribe((data: Array<States>) => {
				this.allStates = data;
			});
		}
	}

	trim(control: string) {
		let trimValue;
		trimValue = this.addressForm['controls'][control].value ? this.addressForm['controls'][control].value.trim() : null;
		this.addressForm.patchValue({ control: trimValue });
	}

	zipLookUp() {
		if (this.editContactInfo) {
			this.dataService.updateZipValidityStatus(false);
			const zipControl = this.addressForm['controls'].zipcode;
			if (!zipControl.invalid) {
				this.usps.zipLookup(zipControl.value).subscribe((data: ZipDetails) => {
					if (!data['error']) {
						if (data.state) {
							const patchObj = {
								state: data.state,
								// city: data.city
							};
							if (this.zipCode !== zipControl.value || !this.addressForm.getRawValue().city) {
								patchObj['city'] = data.city;
								this.zipCode = zipControl.value;
							}
							this.addressForm.patchValue(patchObj);
							this.standardizeAddress(this.addressType);
							this.dataService.updateZipValidityStatus(true);
						} else {
							zipControl.setErrors({ 'incorrect': true });
						}
					} else {
						zipControl.setErrors({ 'incorrect': true });
					}
				});
			}
		}
	}

	standardizeAddress(addressType) {
		if (this.editContactInfo) {
			this.dataService.standardizeCheck.subscribe(data => {
				if (!data || !data.hasOwnProperty(this.page + addressType) || data[this.page + addressType] === true) {
					if (this.addressForm['controls'].numberandstreet.valid) {
						const add = this.addressForm['controls'].numberandstreet.value;
						let zip = '';
						if (this.addressForm.getRawValue()['zipcode'] !== null) {
							zip = this.addressForm.getRawValue()['zipcode'];
						}
						if (add !== null && add !== undefined && add !== '' &&
							zip !== null && zip !== undefined && zip !== '') {
							this.usps.standardizeAddress(add, zip).subscribe(address => {
								if (address !== null && address !== undefined && address !== '') {
									this.dataService.updateStandarizeAddressStatus(this.page, addressType);
									const patchObj = { numberandstreet: address };
									this.addressForm.patchValue(patchObj);
								}
							});
						}
					}
				}
			});
		}
	}

	// updateZipcode(zipcode) {
	// 	this.addressForm['controls'].zipcode.patchValue(zipcode);
	// 	this.zipLookUp();
	// 	this.addressForm.get('zipcode').disable();
	// 	this.addressForm.updateValueAndValidity();
	// 	this.disableAddressFields = true;
	// }

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

	patchData(data: Address) {
		this.addressForm.patchValue(data);
		this.zipCode = data.zipcode;
		// if (this.page === 'businessInfo' && this.physicalAddress) {
		// 	this.disableAddressFields = true;
		// }
	}

	// getYearText(year: number) {
	// 	return this.formUtlityService.getYearText(year);
	// }

	// getMonthText(month: number) {
	// 	return this.formUtlityService.getMonthText(month);
	// }

	updateCity() {
		// if ((this.page === 'personalInfo' || this.page === 'review' || this.page === 'responsibleInfo') && this.physicalAddress) {
		// 	const zipData = JSON.parse(sessionStorage.getItem('zipcode'));
		// 	const city = this.addressForm.getRawValue().city;
		// 	if (zipData !== null && zipData !== undefined && city) {
		// 		zipData['city'] = city;
		// 		this.addressForm.patchValue({ zipcode: zipData['zip5'], city: zipData['city'], state: zipData['state'] });
		// 		sessionStorage.setItem('zipcode', JSON.stringify(zipData));
		// 	}
		// }
	}

}
