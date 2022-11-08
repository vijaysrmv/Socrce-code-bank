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

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BusinessFormComponent } from '../../components/business-form/business-form.component';

import { BusinessDetailsService } from './business-details.service';
import { UspsService } from '../../../core/apis/usps.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { DataService } from '../../../core/services/data.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { BACKEND_STATE } from '../../../core/models/enums';
import { ZipDetails } from '../../../core/models/usps-response.model';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-business-details',
	templateUrl: './business-details.component.html',
	styleUrls: ['./business-details.component.scss'],
	providers: [
		BusinessDetailsService
	]
})
export class BusinessDetailsComponent implements OnInit {

	@ViewChild(BusinessFormComponent, { static: false }) business: BusinessFormComponent;

	reviewPage = false;
	consumerData: any;

	constructor(
		private businessDetailsSvc: BusinessDetailsService,
		private dataService: DataService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private usps: UspsService
	) { }

	ngOnInit() {
		this.dataService.changeStepper({ name: '/business-deposit/business-details', index: 2, personalStepper: 'businessDeposit' });
		if (sessionStorage.getItem('arn')) {
			this.getData();
		} else {
			this.pageLoaderSvc.hide();
		}
	}

	getData() {
		this.businessDetailsSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
			this.consumerData = data;
			if (data && data.businessdetails) {
				const eligibilityQuestions = { 'ownershipstructure': data.businessdetails.ownershipstructure, 'restrictedcategories': data.businessdetails.restrictedcategories };
				if (!sessionStorage.getItem('eligibilityQuestions')) {
					sessionStorage.setItem('eligibilityQuestions', JSON.stringify(eligibilityQuestions));
				}
				this.business.createOwnershipPercentageForm(data.responsibledetails);
				this.business.patchData(data.businessdetails);
				this.business.setBusinessType(data.businessdetails.ownershipstructure);
				if (data.businessdetails.businessaddress) {
					const physicaladdress = this.getPhysicalAddress(data.businessdetails.businessaddress, 'physicaladdress');
					if (sessionStorage.getItem('applicationFlow') === 'resume' && physicaladdress && physicaladdress.zipcode) {
						this.usps.zipLookup(physicaladdress.zipcode).subscribe((response: ZipDetails) => {
							if (response['error'] && response['error'].description && response['error'].description !== '') {
								if (response['error'].description.toLowerCase() === 'invalid zip code.') {
									// console.log('Invalid Zip Code.');
								}
							} else {
								sessionStorage.setItem('zipcode', JSON.stringify(response));
								sessionStorage.setItem('productIdList', JSON.stringify(data.products));
								sessionStorage.removeItem('applicationFlow');
							}
						});
					}
				}
			} else {
				this.pageLoaderSvc.hide();
			}
		}, (error) => {
			throw error;
		});
	}

	getPhysicalAddress(address, addresstype) {
		return address.filter(data => {
			if (data.addresstype) {
				return (data.addresstype).toLowerCase() === addresstype.toLowerCase();
			} else {
				return false;
			}
		}).map(data => {
			delete data['addresstype'];
			return data;
		});
	}

	_getMaxPid() {
		let res = 0;
		this.consumerData.responsibledetails.forEach(item => {
			const x = item.pid;
			if (x > res) {
				res = x;
			}
		});
		return res;
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		if (this.business.checkValidationsOnBack()) {
			this.pageLoaderSvc.hide();
			throw Error('1014');
		}
		const businessDetails = this.business.getbusinessFormDetails();
		this.businessDetailsSvc.processBack(businessDetails).subscribe((result) => {
			if (result === 'success') {
				const pid = this._getMaxPid();
				sessionStorage.setItem('pid', pid.toString());
				this.router.navigate(['/business-deposit/responsible-details']);
			} else {
				this.pageLoaderSvc.hide();
			}
		});
	}

	saveData() {
		this.pageLoaderSvc.show(true, false);
		const businessDetails = this.business.getbusinessFormDetails();
		businessDetails['naics'] = businessDetails.subbusinesscategory ? businessDetails.subbusinesscategory : '';
		this.businessDetailsSvc.processSaveAndExit(businessDetails).subscribe((result) => {
			if (result === 'success') {
				this.router.navigate(['/business-deposit/' + BACKEND_STATE['saveAndExit']]);
			}
		});
	}

	nextStep() {
		this.pageLoaderSvc.show(true, false);
		/*const validationError = this.business.checkValidations();
		if (!validationError) {
			this.pageLoaderSvc.show(true, false);
			const businessDetails = this.business.getbusinessFormDetails();
			businessDetails['naics'] = businessDetails.subbusinesscategory;
			this.businessDetailsSvc.processNextStepNavigation(businessDetails).subscribe((result) => {
				if (result === 'success') {
					this.businessDetailsSvc.getNextState().subscribe((res) => {
						this.router.navigate(['/business-deposit/' + BACKEND_STATE[res.nextuistate]]);
					});
				} else {
					this.pageLoaderSvc.hide();
				}
			});
		} else {
			this.pageLoaderSvc.hide();
		}*/

		this.router.navigate(['/business-deposit/responsible-details']);

	}

	ids = {
		FRONT: {
			img: '',
			id: '',
			name: '',
		},
		BACK: {
			img: '',
			id: '',
			name: '',
		}
	};

	clearImage(side: string) {
		
		this.ids[side].img = '';
	
	}


	onUploadImage(event, side: string, field?) {
		// console.log(this.idscantype);
		const target = event ? event.target : field;
		const targetValue = target.value;
		const img = target.files[0];
		
		this.readUploadedFileAsUrl(event.target.files[0]).subscribe((dataUrl) => {
					this.ids[side].id = '';
					this.ids[side].img = dataUrl;
					this.ids[side].name = img.name;
					const imgFront = this.ids.FRONT.img;
					const imgBack = this.ids.BACK.img;
					const nameFront = this.ids.FRONT.name;
					const nameBack = this.ids.FRONT.name;
					if (imgFront !== '' && imgBack !== '') {
						// if (imgFront !== '' && imgBack !== '' && this.idscantype !== 'OTHERS') {
						this.pageLoaderSvc.show(true, false);
						
						}
					})
			
			setTimeout(function(){
				this.pageLoaderSvc.hide();
			},3000)
		
		}
	


	readUploadedFileAsUrl(inputFile) {
		const temporaryFileReader = new FileReader();
		return new Observable((observer) => {
			temporaryFileReader.onerror = () => {
				temporaryFileReader.abort();
				observer.error('error');
			};
			temporaryFileReader.onload = () => {
				observer.next(temporaryFileReader.result);
				observer.complete();
			};
			temporaryFileReader.readAsDataURL(inputFile);
		});
	}

	idScanTypeChange() {
		
	}


	
	updateDataFromIdScan(data: { id: number; data: any | null }) {
		if (data) {
			// this.showForm = true;
			if (!data.data) {
				const dummyData: any = {
					firstname: "John",
					middlename: "Mariam",
					lastname: "Yussef",
					dob: "05/05/1980",
					country: "US",
					identification: {
						type: "DL",
						issuestate: "CA",
						issuedate: "09/08/2000",
						expirydate: "09/08/2025",
						number: "78653489",
					},
					physicaladdress: {
						addresstype: "PHY",
						zipcode: "37011",
						city: "ANTIOCH",
						state: "TN",
						numberandstreet: "123 Mark Street",
					},
				};

				data.data = dummyData;
			}
		}
	}

}
