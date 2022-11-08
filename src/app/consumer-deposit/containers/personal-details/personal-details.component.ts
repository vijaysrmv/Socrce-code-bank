/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            : 		Newgen Portal
Module                 :		Consumer Deposit
File Name              :        personal-details.component.ts
Author                 : 		Aditya Agrawal
Date (DD/MM/YYYY)      : 	    16/09/2019
Description            : 		Personal Details Component
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { ConsumerFormComponent } from '../../../shared/components/consumer-form/consumer-form.component';

import { PersonalDetailsService } from './personal-details.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';
import { FormUtilityService } from '../../../core/services/form-utility.service';
import { ModalBoxService } from './../../../shared/services/modal-box.service';

import { ApplicationDetails, Document, DocResponse, Address } from '../../../core/models/application.model';
import { APPLICANT_TYPE, BACKEND_STATE, BACKEND_ID_TYPES } from '../../../core/models/enums';
import { ModalBoxInfo } from '../../../core/models/modalBoxInfo.model';
import { Product } from '../../../core/models/product.model';
import { AppConstants } from '../../../core/utility/app.constants';


@Component({
	selector: 'app-personal-details',
	templateUrl: './personal-details.component.html',
	styleUrls: ['./personal-details.component.scss'],
	providers: [
		PersonalDetailsService
	]
})
export class PersonalDetailsComponent implements OnInit, AfterViewInit {

	@ViewChild(ConsumerFormComponent, { static: false }) consumer: ConsumerFormComponent;
	@Output() sendJointData = new EventEmitter();

	showJointModal = false;
	showBeneficiaryModal = false;
	saveExitDisability = true;
	selectedSingleAccount = true;
	// showMailingAddress = true;

	consumerData: ApplicationDetails;
	jointModalData: ModalBoxInfo;
	beneficiaryModalData: ModalBoxInfo;
	activeProducts: Array<Product>;
	applicantType = APPLICANT_TYPE['consumerPrimary'];

	jointAccountType = 'joint owner';
	beneficiaryAccountType = 'beneficiary';
	isAPICalled = false;
	showForm = true;
	// isOLB = false;
	pid = 1;
	selectedProducts = [];

	constructor(
		private dataService: DataService,
		private formUtilityService: FormUtilityService,
		private modalBoxService: ModalBoxService,
		private pageLoaderSvc: PageLoaderService,
		private personalDetailsSvc: PersonalDetailsService,
		private router: Router,
		private cdr: ChangeDetectorRef,
	) { }

	switchAccountType(selectSingleAccount: boolean) {
		this.selectedSingleAccount = selectSingleAccount;
	}

	ngOnInit() {
		this.dataService.changeStepper({ name: '/consumer-deposit/personal-details', index: 2, personalStepper: 'consumerDeposit' });

		this.jointModalData = this.modalBoxService.getModalBoxData(this.jointAccountType);
		this.beneficiaryModalData = this.modalBoxService.getModalBoxData(this.beneficiaryAccountType);
		// const tyfoneData = JSON.parse(sessionStorage.getItem('tyfoneDetails'));
		// if (tyfoneData && tyfoneData.olb) {
		// 	if (sessionStorage.arn) {
		// 		this.getData();
		// 	} else {
		// 		this.createOlbApplication();
		// 	}
		// } else if (sessionStorage.arn) {
		if (sessionStorage.arn) {
			this.getData();
		} else {
			this.showForm = false;
			this.pageLoaderSvc.hide();
		}
	}

	ngAfterViewInit() {
		const dob = sessionStorage.getItem('dob');
		if (dob && !sessionStorage.arn) {
			this.consumer.autoFillDob(dob);
		}
		if (sessionStorage.arn) {
			this.consumer.showForm = true;
		}else {
			this.consumer.showForm = false;
		}
		this.cdr.detectChanges();
	}

	getExistingProductIndex(id: string) {
		return this.activeProducts.findIndex(product => {
			return product.productid === id;
		});
	}

	setDob(activeProducts: Array<Product>, dob: any) {
		/**
		 ** Uncomment below code to disable dob when product is dob specific
		 **/
		// const result = activeProducts.findIndex(product => {
		// 	return product.productid === 'youth_checking_30' || product.productid === 'youth_share_01';
		// });
		// if (result !== -1) {
		// 	sessionStorage.setItem('dob', dob);
		// 	this.consumer.autoFillDob(dob);
		// }
		this.consumer.validateDobAfterPatch(dob);
	}

	getData() {
		this.personalDetailsSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
			if (data['qualifications']) {
				sessionStorage.setItem('qualificationDetails', JSON.stringify(data.qualifications));
			}
			this.consumerData = data;
			this.selectedProducts = data.products;
			this.personalDetailsSvc._setValidationOnEmailSsn(1, this.consumer, this.consumerData);
			// if (data['isolb']) {
			// 	this.dataService.changeOlbState(true);
			// }
			// this.activeProducts = data.products;
			if (data.personaldetails) {
				this.showForm = true;
				this.consumer.patchData(data.personaldetails);
				if (data.personaldetails.dob && data.products) {
					this.setDob(data.products, data.personaldetails.dob);
				}
				if (data.personaldetails.dob && data.personaldetails.lastname && data.personaldetails.ssn && data.personaldetails.email) {
					this.saveExitDisability = false;
				}
				// this.consumer.olbLoginCheck();
				if (data.personaldetails['documents'] && data.personaldetails['documents'].length > 0) {
					this._setDocuments(data.personaldetails['documents'], data.personaldetails.pid);
				} else {
					this.pageLoaderSvc.hide();
				}
			}
			// this.pageLoaderSvc.hide();
		}, () => {
			this.pageLoaderSvc.hide();
		});
	}

	// createOlbApplication() {
	// 	const reqData: TyfoneDetails = JSON.parse(sessionStorage.getItem('tyfoneDetails'));
	// 	this.personalDetailsSvc.createOlbApplication(reqData).subscribe((data: ApplicationDetails) => {
	// 		this.getData();
	// 		const tyfoneData = sessionStorage.getItem('tyfoneDetails');
	// 		if (tyfoneData) {
	// 			sessionStorage.removeItem('tyfoneDetails');
	// 		}
	// 	});
	// }

	private _setDocuments(documents: Document[], pid) {
		this.pageLoaderSvc.show(true, false);
		let doctype;
		documents.forEach(doc => {
			doctype = BACKEND_ID_TYPES[doc.doctype];
		});
		this.consumer.updateIdScanType(doctype);
		this.personalDetailsSvc.fetchDocs(this.applicantType, pid).subscribe((data: DocResponse) => {
			const idScandocument = data.applicationdocuments.filter((document: Document) => {
				return (document.applicanttype === this.applicantType && document.pid === pid);
			});
			idScandocument.forEach(doc => {
				this.consumer.updateIdScanImg(doc);
			});
			// this.pageLoaderSvc.hide();
			setTimeout(() => {
				this.pageLoaderSvc.hide();
			}, 0);
		}, err => {
			this.pageLoaderSvc.hide();
		});
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		if (sessionStorage.arn) {
			if (this.consumer.checkValidationsOnBack()) {
				this.pageLoaderSvc.hide();
				throw Error('1014');
			}
			const idObj = this.consumer.getIdscanImages();
			const consumerDetails = this.consumer.getConsumerFormDetails('back');
			if (this.consumer.tyfoneEditableFields && this.consumer.tyfoneEditableFields.length) {
				consumerDetails['manualtyfonefields'] = this.consumer.tyfoneEditableFields;
			}
			this.checkForDeletedDocs();
			// if (!this.isOLB) {
			// 	this.checkForDeletedDocs();
			// }
			this.personalDetailsSvc.saveDocs(idObj).subscribe(data => {
				this.personalDetailsSvc.processBack(consumerDetails).subscribe((result) => {
					if (result === 'success') {
						this.router.navigate(['/consumer-deposit/select-product']);
					} else {
						this.pageLoaderSvc.hide();
					}
				});
			});
		} else {
			this.router.navigate(['/consumer-deposit/select-product']);
		}
	}

	saveAddressData(section) {
		const validationError = this.formUtilityService.displayValidations(this.consumer.physicalAddress.addressForm);
		if (!validationError) {
			this.pageLoaderSvc.show(true, false);
			// this.saveData(false, section);
			const consumerDetails = this.consumer.getConsumerFormDetails('next');
			this.personalDetailsSvc.processNextStepNavigation(consumerDetails).subscribe((result) => {
				if (result === 'success') {
					this.consumer.refreshForm(section);
				}
				this.pageLoaderSvc.hide();
			});
		}
	}

	checkSaveAndExitDisability(mileStoneError: boolean) {
		if (mileStoneError) {
			this.saveExitDisability = true;
		} else {
			this.saveExitDisability = false;
		}
	}

	saveData(exit = true, section?: string) {
		const mileStoneError = this.formUtilityService.checkMilestoneError(this.consumer.consumerForm);
		if (!mileStoneError) {
			this.pageLoaderSvc.show(true, false);
			const idObj = this.consumer.getIdscanImages();
			const consumerDetails = this.consumer.getConsumerFormDetails('save');
			if (this.consumer.tyfoneEditableFields && this.consumer.tyfoneEditableFields.length) {
				consumerDetails['manualtyfonefields'] = this.consumer.tyfoneEditableFields;
			}
			this.checkForDeletedDocs();
			// if (!this.isOLB) {
			// 	this.checkForDeletedDocs();
			// }
			// if (this.consumerData.jointdetails && !this.consumerData.jointdetails[0].documents) {
			// 	this.personalDetailsSvc.processJointDelete(this.consumerData.jointdetails[0].pid).subscribe((response) => {
			// 		if (response.message === 'success') {
			// 			this.saveAndExitRedirection(idObj, consumerDetails, exit, section);
			// 		}
			// 	}, () => {
			// 		this.pageLoaderSvc.hide();
			// 	});
			// }else {
				this.saveAndExitRedirection(idObj, consumerDetails, exit, section);
			// }
		} else {
			const el = this.consumer.consumerForm.controls.lastname['nativeElement'];
			el.scrollIntoView({ behavior: 'smooth' });
		}
	}

	saveAndExitRedirection(idObj, consumerDetails, exit, section) {
		this.personalDetailsSvc.saveDocs(idObj).subscribe(data => {
			this.personalDetailsSvc.processSaveAndExit(consumerDetails).subscribe((result) => {
				if (result === 'success') {
					if (exit) {
						this.router.navigate(['/consumer-deposit/' + BACKEND_STATE['saveAndExit']]);
					} else {
						this.consumer.refreshForm(section);
					}
				}
				this.pageLoaderSvc.hide();
			});
		});
	}

	checkSectionEditable() {
		if (this.consumer.editableSection === '') {
			return false;
		} else {
			return true;
		}
	}

	nextStep() {
		if (this.checkSectionEditable()) {
			throw new ApplicationError('1001');
		}
		this.pageLoaderSvc.show(true, false);
		const validationError = this.consumer.checkValidations();
		if (validationError) {
			this.pageLoaderSvc.hide();
			return;
		}
		if (!sessionStorage.arn) {
			this.consumer.checkApplication(true);
		} else {
			this.continueNextStep();
		}
	}

	continueNextStep() {
		const idObj = this.consumer.getIdscanImages();
		// const validationError = this.consumer.checkValidations();
		// if (!validationError) {
		const consumerDetails = this.consumer.getConsumerFormDetails('next');
		if (this.consumer.tyfoneEditableFields && this.consumer.tyfoneEditableFields.length) {
			consumerDetails['manualtyfonefields'] = this.consumer.tyfoneEditableFields;
		}
		this.checkForDeletedDocs();
		// if (!this.isOLB) {
		// 	this.checkForDeletedDocs();
		// }
		this.personalDetailsSvc.saveDocs(idObj).subscribe(() => {
			this.personalDetailsSvc.processNextStepNavigation(consumerDetails).subscribe((result) => {
				if (result === 'success') {
					let jointCount;
					const products = sessionStorage.getItem('productIdList');
					this.selectedProducts = this.selectedProducts.length > 0 ? this.selectedProducts :  products && products !== undefined ? JSON.parse(products) : undefined;
					const ageRange = this.formUtilityService.getAgeRange(consumerDetails.dob);
					const HSAIndex = this.selectedProducts.findIndex(p => p.productid === 'HSA');
					if (HSAIndex !== -1 && this.selectedProducts[HSAIndex].plantype === 'Individual') {
						this.personalDetailsSvc.setJointApplicantCount({ count: 0 }).subscribe(req => {
							this.personalDetailsSvc.setBeneficiaryCount({ count: 0 }).subscribe(data => {
								this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[data.nextuistate]]);
								this.pageLoaderSvc.hide();
							});
						});
					}else {
						if (ageRange === 'minor') {
							jointCount = this.getJointCount() === 0 ? 1 : this.getJointCount();
						} else {
							jointCount = this.getJointCount();
						}
						if (jointCount !== 0) {
							sessionStorage.removeItem('dob');
							if (ageRange === 'minor' && (this.consumerData === undefined || this.consumerData.jointdetails.length === 0)) {
								this.personalDetailsSvc.setJointApplicantCount({ count: jointCount }).subscribe(req => {
									this.pid = Number(req.nextuistate.split('-')[1]) + 1;
									sessionStorage.setItem('pid', this.pid.toString());
									this.router.navigate(['/consumer-deposit/' + BACKEND_STATE['jointInfo']]);
									this.pageLoaderSvc.hide();
								});
							} else {
								sessionStorage.setItem('pid', this.consumerData.jointdetails[0].pid.toString());
							}
							this.router.navigate(['/consumer-deposit/' + BACKEND_STATE['jointInfo']]);
							this.pageLoaderSvc.hide();
						} else {
							this.showJointModal = true;
							this.pageLoaderSvc.hide();
						}
					}
				} else {
					this.pageLoaderSvc.hide();
				}
			});
		});
		// }
	}

	getPrimaryAddress(): Address[] {
		const address = [];
		const primary = {
			addresstype: 'physicalAddress',
			applicanttype: APPLICANT_TYPE['consumerPrimary'],
			zipcode: this.consumer.physicalAddress.addressForm.getRawValue().zipcode,
			city: this.consumer.physicalAddress.addressForm.getRawValue().city,
			state: this.consumer.physicalAddress.addressForm.getRawValue().state
		};
		address.push(primary);
		return address;
	}

	createApplication(consumerData) {
		if (!this.isAPICalled) {
			this.isAPICalled = true;
			const callNextStep = consumerData['callnextstep'];
			delete consumerData['callnextstep'];

			consumerData.address = this.getPrimaryAddress();
			this.personalDetailsSvc.createApplication(consumerData).subscribe((result) => {
				if (result === 'success') {
					this.isAPICalled = false;
					if (callNextStep) {
						this.continueNextStep();
					}
					this.saveExitDisability = false;
				}
				this.pageLoaderSvc.hide();
			}, error => {
				this.isAPICalled = false;
				this.pageLoaderSvc.hide();
				if (error.error && error.error.code && error.error.code === 2017) {
					this.dataService.showResumePopup();
				} else {
					throw new ApplicationError(error.code);
				}
			});
		}
	}

	getJointCount() {
		return this.consumerData ? this.consumerData.jointdetails ? this.consumerData.jointdetails.length : 0 : 0;
	}

	addApplicant() {
		if (this.showBeneficiaryModal) {
			if (this.beneficiaryModalData.applicantCount < AppConstants.maxConsumerBeneficiaries) {
				this.beneficiaryModalData.applicantCount = this.beneficiaryModalData.applicantCount + 1;
			}
		}
	}

	subtractApplicant() {
		if (this.showBeneficiaryModal) {
			if (this.beneficiaryModalData.applicantCount > 1) {
				this.beneficiaryModalData.applicantCount = this.beneficiaryModalData.applicantCount - 1;
			}
		}
	}

	addAccount(event) {
		this.pageLoaderSvc.show(true, false);
		if (this.showJointModal) {
			const jointCount = event ? 1 : 0;
			this.modalBoxService.setJointCount(jointCount);
			this.personalDetailsSvc.setJointApplicantCount({ count: jointCount }).subscribe(data => {
				if (data.nextuistate === 'personalInfo') {
					const applicationDetails: ApplicationDetails = this.personalDetailsSvc.setConsumerData(this.consumer.getConsumerFormDetails());
					// if (this.formUtilityService.checkProductAgeValidation(applicationDetails)) {
					// 	this.showJointModal = false;
					// 	this.showBeneficiaryModal = false;
					// 	throw new ApplicationError('1011');
					// }
					this.showJointModal = false;
					// if (this.isOLB) {
					// 	this.showBeneficiaryModal = false;
					// 	this.addAccount(false);
					// } else {
					this.showBeneficiaryModal = true;
					// }
					this.pageLoaderSvc.hide();
				} else {
					// this.pageLoaderSvc.show(true, false);
					if (data.nextuistate.indexOf('jointInfo') !== -1) {
						const nextuistate = data.nextuistate.split('-')[0];
						sessionStorage.removeItem('dob');
						this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[nextuistate]]);
					} else {
						sessionStorage.removeItem('dob');
						this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[data.nextuistate]]);
					}
				}
			});
		} else {
			const beneficiaryCount = event ? this.beneficiaryModalData.applicantCount : 0;
			this.modalBoxService.setBeneficiaryCount(beneficiaryCount);
			this.personalDetailsSvc.setBeneficiaryCount({ count: beneficiaryCount }).subscribe(data => {
				sessionStorage.removeItem('dob');
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[data.nextuistate]]);
			});
		}
	}

	private checkForDeletedDocs() {
		const deleteDocIds = [];
		if (this.consumer.idscanCmp.ids.FRONT.img === '' && this.consumer.idscanCmp.ids.FRONT.id !== '') {
			deleteDocIds.push(this.consumer.idscanCmp.ids.FRONT.id);
		}
		if (this.consumer.idscanCmp.ids.BACK.img === '' && this.consumer.idscanCmp.ids.BACK.id !== '') {
			deleteDocIds.push(this.consumer.idscanCmp.ids.BACK.id);
		}

		if (deleteDocIds.length > 0) {
			this.personalDetailsSvc.deleteConsumerDoc(deleteDocIds).subscribe();
		}
		return;
	}

	setFooterActions(event) {
		if (event) {
			this.showForm = true;
		}
	}

}
