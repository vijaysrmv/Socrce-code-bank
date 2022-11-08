/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Consumer OAO
File Name              :        review-approve.component.ts
Author                 :    	Amir Masaood
Date (DD/MM/YYYY)      :       	28/01/2019
Description            :        Review approve component to update previously saved details
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, Input, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { BeneficiaryDetailsComponent } from '../../containers/beneficiary-details/beneficiary-details.component';
import { ConsumerFormComponent } from '../../../shared/components/consumer-form/consumer-form.component';
import { IdentityComponent } from '../../../shared/components/identity/identity.component';

import { ReviewApproveService } from './review-approve.service';
import { JointDetailsService } from '../joint-details/joint-details.service';
import { MdmService } from '../../../core/apis/mdm.service';
import { UspsService } from '../../../core/apis/usps.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';
import { ModalBoxService } from './../../../shared/services/modal-box.service';

import { ApplicationDetails, ApplicantDetails } from '../../../core/models/application.model';
import { BACKEND_STATE } from '../../../core/models/enums';
import { ZipDetails } from '../../../core/models/usps-response.model';
import { MfaFormComponent } from '../../../shared/components/mfa-form/mfa-form.component';
import { PersonalDetailsService } from '../personal-details/personal-details.service';
import { OtpComponent } from './../../../shared/components/otp/otp.component';
import { FormUtilityService } from '../../../core/services/form-utility.service';


@Component({
	selector: 'app-review-approve',
	templateUrl: './review-approve.component.html',
	styleUrls: ['./review-approve.component.scss'],
	providers: [
		ReviewApproveService,
		JointDetailsService,
		PersonalDetailsService
	]
})
export class ReviewApproveComponent implements OnInit {

	@ViewChild(ConsumerFormComponent, { static: false }) consumer: ConsumerFormComponent;
	@ViewChild(BeneficiaryDetailsComponent, { static: false }) beneficiary: BeneficiaryDetailsComponent;
	@ViewChild(IdentityComponent, { static: false }) identity: IdentityComponent;
	@ViewChild(MfaFormComponent, { static: false }) mfa: MfaFormComponent;

	@Input() selectedSingleAccount = true;

	consumerData: ApplicationDetails;
	modalRef: BsModalRef;
	otpLength = 5;
	// showMailingAddress = true;
	currentUIState: string;
	selectedProducts = [];
	productList = {};
	jointCount = 0;
	beneficiaryCount = 0;
	showConfirmationModal = false;
	indexToBeDeleted: any;
	beneficiaryIndexToBeDeleted: any;
	showRemoveButton = false;

	constructor(
		private cdr: ChangeDetectorRef,
		private dataService: DataService,
		private mdm: MdmService,
		private modalBoxService: ModalBoxService,
		private modalService: BsModalService,
		private pageLoaderSvc: PageLoaderService,
		private jointDetailsService: JointDetailsService,
		private personalDetailsService: PersonalDetailsService,
		private formUtilityService: FormUtilityService,
		private reviewService: ReviewApproveService,
		private router: Router,
		private usps: UspsService,
	) { }

	ngOnInit() {
		if (this.consumer) {
			this.consumer.isPrimaryApplicant = true;
		}
		this.dataService.changeStepper({ name: '/consumer-deposit/review', index: 3, personalStepper: 'consumerDeposit' });

		// this.jointCount = this.modalBoxService.getJointCount();
		// this.beneficiaryCount = this.modalBoxService.getBeneficiaryCount();

		if (sessionStorage.getItem('arn')) {
			this.getData();
		}
		const uistate = sessionStorage.getItem('uistate');
		if (uistate === 'reviewInProgress') {
			this.pageLoaderSvc.show(true, false);
			this.nextStep();
		}
	}

	setSelectedProducts() {
		this.mdm.getProducts('consumerShare').subscribe(data => {
			const activeProducts = data.filter(product => product.status);
			const productList = activeProducts.reduce((mappedProduct, product) => {
				const obj = mappedProduct;
				obj[product.productid] = product.productname;
				return obj;
			}, {});
			this.selectedProducts = this.consumerData.products.map(product => productList[product.productid]);
		});
	}

	// patchJointData(component) {
	// 	if (this.consumerData.jointdetails.length !== 0) {
	// 		component.initializeJointForm();
	// 		component.checkDuplicateSsnEmail(this.consumerData.personaldetails.email, this.consumerData.personaldetails.ssn);
	// 		component.patchData(this.consumerData.jointdetails);
	// 		this.cdr.detectChanges();
	// 	}
	// }

	patchAddjoint(component) {
		const res = this.consumerData.jointdetails.filter(data => data.pid === component.pid)[0];
		component.patchData(res);
	}

	patchBeneficiaryData(component) {
		if (this.consumerData.beneficiarydetails.length !== 0) {
			component.initializeBeneficaryForm();
			component.patchData(this.consumerData);
			this.cdr.detectChanges();
		}
	}

	getData(callBeneficiaryPatch?: boolean, component?: any) {
		this.reviewService.getConsumerData().subscribe((data: ApplicationDetails) => {
			this.currentUIState = data.uistate;
			this.consumerData = data;
			// if (data['isolb']) {
			// 	this.dataService.changeOlbState(true);
			// }
			if (data.products) {
				// this.selectedProducts = data.products.map(product => this.productList[product.productid]);
				this.setSelectedProducts();
			}
			if (data.jointdetails && data.jointdetails.length) {
				const isMinor = this.formUtilityService.getAgeRange(data.personaldetails.dob) === 'minor';
				this.jointCount = data.jointdetails.length;
				this.showRemoveButton = isMinor ? this.jointCount > 1 : true;
			}
			// 	if (!this.modalBoxService.getJointCount()) {
			// 		this.modalBoxService.setJointCount(data.jointdetails.length);
			// 	}
			// 	if (callJointPatch) {
			// 		// component.patchData(data.jointdetails);
			// 		component.removeJointForm(this.indexToBeDeleted);
			// 	}
			// } else {
			// 	this.jointCount = 0;
			// 	this.modalBoxService.setJointCount(0);
			// }
			if (data.beneficiarydetails && data.beneficiarydetails.length) {
				this.beneficiaryCount = data.beneficiarydetails.length;
				if (!this.modalBoxService.getBeneficiaryCount()) {
					this.modalBoxService.setBeneficiaryCount(data.beneficiarydetails.length);
				}
				if (callBeneficiaryPatch && this.beneficiaryIndexToBeDeleted) {
					component.removeBeneficiaryForm(this.beneficiaryIndexToBeDeleted);
					this.beneficiaryIndexToBeDeleted = null;
				}
			} else {
				this.beneficiaryCount = 0;
				this.modalBoxService.setBeneficiaryCount(0);
			}
			if (data.personaldetails) {
				this.consumer.showForm = true;
				this.consumer.patchData(data.personaldetails, (data.jointdetails && data.jointdetails.length) ? true : false);
				this.consumer.consumerForm.controls['dob'].disable();
				this.consumer.consumerForm.controls['dobPicker'].disable();
				if (sessionStorage.getItem('applicationFlow') === 'resume' && data.personaldetails.physicaladdress && data.personaldetails.physicaladdress.zipcode) {
					this.usps.zipLookup(data.personaldetails.physicaladdress.zipcode).subscribe((response: ZipDetails) => {
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
			const uistate = sessionStorage.getItem('uistate');
			if (uistate !== 'reviewInProgress') {
				this.pageLoaderSvc.hide();
			}
		}, (error) => {
			this.pageLoaderSvc.hide();
			console.log(error);
		});
	}

	checkSectionEditable() {
		const uistate = sessionStorage.getItem('uistate');
		if (uistate === 'reviewInProgress' || (this.consumer && this.consumer.editableSection === '')) {
			return false;
		} else {
			// console.log('Please save or discard the already editing section.');
			return true;
		}
	}

	prevStep() {
		if (this.checkSectionEditable()) {
			throw new ApplicationError('1001');
		}
		this.pageLoaderSvc.show(true, false);
		if (this.consumerData.beneficiarydetails && this.consumerData.beneficiarydetails.length > 0) {
			// if (this.modalBoxService.getBeneficiaryCount() !== undefined && this.modalBoxService.getBeneficiaryCount() !== 0) {
			this.router.navigate(['/consumer-deposit/beneficiary-details']);
		} else {
			if (this.consumerData.jointdetails && this.consumerData.jointdetails.length > 0) {
				// if (this.modalBoxService.getJointCount() !== undefined && this.modalBoxService.getJointCount() !== 0) {
				const jointCount = this.consumerData.jointdetails.length;
				const pid = this.consumerData.jointdetails[jointCount - 1].pid;
				sessionStorage.setItem('pid', pid.toString());
				this.router.navigate(['/consumer-deposit/joint-details']);
			} else {
				this.router.navigate(['/consumer-deposit/personal-details']);
			}
		}
	}

	getConsumerDetails(data): object {
		const consumerDetails = {};
		switch (data['accounttype']) {
			case 'personal':
				const pid = data.form.consumerForm.getRawValue().pid;
				if (pid === 1) {
					consumerDetails['personal'] = this.consumer.getConsumerFormDetails('next');
				} else {
					consumerDetails['joint'] = this._getJointData(pid, data);
				}
				// consumerDetails['joint'] = this.consumerData.jointdetails;
				// consumerDetails['pid'] = pid;
				break;
			case 'beneficiary':
				if (this.beneficiary) {
					consumerDetails['beneficiary'] = this.beneficiary.getBeneficiaryFormDetails();
				}
				break;
		}
		return consumerDetails;
	}

	saveData(event: any) {
		this.pageLoaderSvc.show(true, false);
		if (event['accounttype'] === 'personal') {
			this._setValidationOnEmailSsn(event);
		}
		const validationError = event['form'].checkValidations();
		if (!validationError) {
			this.pageLoaderSvc.show(true, false);
			let pid;
			if (event['accounttype'] === 'personal') {
				pid = event.form.consumerForm.getRawValue().pid;         // for setting jointInfo pid.
				if (pid > 1) {
					pid = pid - 1;
				}
			}
			const consumerDetails = this.getConsumerDetails(event);
			console.log(consumerDetails, pid);
			this.reviewService.saveDetails(consumerDetails, pid).subscribe((result) => {
				if (result === 'success') {
					// event['form'].refreshForm();
					this.cdr.detectChanges();
					switch (event['accounttype']) {
						// case 'joint':
						// 	event['form'].refreshForm(event['section'], event['index']);
						// 	this.getData(true, false, event['form']);
						// 	break;
						case 'beneficiary':
							event['form'].refreshForm(event['index']);
							this.getData(true, event['form']);
							break;
						case 'personal':
							event['form'].refreshForm(event['section']);
							this.getData(false);
					}
					// this.pageLoaderSvc.hide();
				} else {
					this.pageLoaderSvc.hide();
				}
			});
		} else {
			this.pageLoaderSvc.hide();
		}
	}

	nextStep() {
		if (this.checkSectionEditable()) {
			throw new ApplicationError('1001');
		}else if (this.consumerData && this.consumerData.products.findIndex(p => p.productid === 'HSA') !== -1 && this.consumerData.jointdetails.length === 3) {
			throw new ApplicationError('1018');
		}
		this.pageLoaderSvc.show(true, true);
		this.reviewService.reviewContinue().subscribe(data => {
			if (data.message === 'TUIDV') {
				this.reviewService.iRequest().subscribe(response => {
					if (response.nextrequeststate === 'Present Exam') {
						this.identity.showTransunionQues(response);
					} else if (response.nextrequeststate === 'Pin Exam') {
						this.mfa.showVerificationOptions(response);
					} else if (response.irequestdeclined === true) {
						this.handleRequestDeclined(response);
					} else {
						this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[response.nextrequeststate]]);
					}
					this.pageLoaderSvc.hide();
				}, error => {
					this.router.navigate(['/errors/technical-error']);
				});
			} else {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[data.message]]);
			}
		}, error => {
			this.router.navigate(['/errors/technical-error']);
		});
	}

	_getJointData(pid, data) {
		const jointDetails = data['form'].getConsumerFormDetails('next', this.consumerData.personaldetails);
		const jointFormArray: ApplicantDetails[] = this.jointDetailsService.getJointFormArray(this.consumerData, jointDetails, pid);
		return jointFormArray;
	}

	submitQuestionnaireForm($event) {
		$event.ref.closeModal();
		this.pageLoaderSvc.show(true, true);
		this.reviewService.aRequest($event.request_QA).subscribe(response => {
			if (response.nextrequeststate === 'Pin Verify') {
				this.processOtpVerification(response);
			} else if (response.nextrequeststate === 'Present Exam') {
				this.identity.showTransunionQues(response);
			} else if (response.irequestdeclined === true) {
				this.handleRequestDeclined(response);
			} else {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[response.nextrequeststate]]);
			}
			this.pageLoaderSvc.hide();
		}, error => {
			this.router.navigate(['/errors/technical-error']);
		});
	}

	processOtpVerification(res) {
		const initialState = {
			otpLength: 5,
			flowType: 'transunion',
			transunionResponse: res
		};
		this.modalRef = this.modalService.show(OtpComponent, { ignoreBackdropClick: true, keyboard: false, backdrop: true, initialState });
		this.modalRef.content.validate.subscribe(value => {
			this.modalRef.hide();
			this.validateOtp(value);
		});
	}

	validateOtp($event) {
		this.pageLoaderSvc.show(true, true);
		this.reviewService.aRequest($event.request_QA).subscribe(response => {
			if (response.nextrequeststate === 'Pin Verify') {
				this.processOtpVerification(response);
			} else if (response.irequestdeclined === true) {
				this.handleRequestDeclined(response);
			} else {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[response.nextrequeststate]]);
			}
			this.pageLoaderSvc.hide();
		}, error => {
			this.router.navigate(['/errors/technical-error']);
		});
	}

	resendOtp($event) {
		console.log($event);
	}

	saveAndExit() {
		if (this.checkSectionEditable()) {
			throw new ApplicationError('1001');
		}
		this.pageLoaderSvc.show(true, false);
		const consumerDetails: ApplicationDetails = {};

		consumerDetails['personal'] = this.consumer.getConsumerFormDetails('next');
		// if (this.joint) {
		// 	consumerDetails['joint'] = this.joint.getJointFormDetails(this.consumer.getConsumerFormDetails());
		// }
		if (this.beneficiary) {
			consumerDetails['beneficiary'] = this.beneficiary.getBeneficiaryFormDetails();
		}

		this.reviewService.processSaveAndExit(consumerDetails, this.currentUIState).subscribe(result => {
			if (result === 'success') {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE['saveAndExit']]);
			}
			this.pageLoaderSvc.hide();
		});
	}

	showOrHideConfirmationModal(event) {
		this.showConfirmationModal = event['delete'];
		this.indexToBeDeleted = event['index'];
	}

	// deleteJointDetailForm(event) {
	// 	if (event) {
	// 		this.pageLoaderSvc.show(true, false);
	// 		this.removeApplicant(this.indexToBeDeleted);
	// 	} else {
	// 		this.indexToBeDeleted = null;
	// 	}
	// 	this.showConfirmationModal = false;
	// }

	removeApplicant(pid: number) {
		this.pageLoaderSvc.show(true, false);
		if (this.consumer.editableSection) {
			this.consumer.toggleSectionEdit(this.consumer.editableSection);
		}
		this.jointDetailsService.processDelete(pid).subscribe((response) => {
			if (response.message === 'success') {
				this.getData(false, this.consumer);
			} else {
				this.pageLoaderSvc.hide();
			}
		}, () => {
			this.pageLoaderSvc.hide();
		});

		// this.pageLoaderSvc.show(true, false);
		// if (this.editableSection) {
		// 	const arr = this.consumer.toArray();
		// 	const res = arr.filter(data => data.pid === pid)[0];
		// 	res.toggleSectionEdit(this.editableSection);
		// }
		// this.jointDetailsService.processDelete(pid).subscribe((response) => {
		// 	if (response.message === 'success') {
		// 		this.getData();
		// 	}
		// }, () => {
		// 	this.pageLoaderSvc.hide();
		// });
	}

	deleteBeneficiary(index: number) {
		this.beneficiaryIndexToBeDeleted = index;
		this.getData(true, this.beneficiary);
	}

	handleRequestDeclined(transReponse) {
		this.pageLoaderSvc.show(true, true);
		const reqData = this.createArequestObject(transReponse);
		this.reviewService.aRequest(reqData).subscribe(response => {
			this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[response.nextRequestState]]);
			this.pageLoaderSvc.hide();
		}, error => {
			this.router.navigate(['/errors/technical-error']);
		});
	}

	createArequestObject(transReponse) {
		const sessionsArn = sessionStorage.getItem('arn');
		const reqObj = {
			authenticationData: null,
			referenceNumber: transReponse.referencenbr,
			nextRequestState: transReponse.nextrequeststate,
			irequestdeclined: transReponse.irequestdeclined,
			arn: sessionsArn
		};
		return reqObj;
	}

	_setValidationOnEmailSsn(data) {
		const pid = data.form.consumerForm.getRawValue().pid;
		if (pid === 1) {
			this.personalDetailsService._setValidationOnEmailSsn(pid, data['form'], this.consumerData);
		} else {
			this.jointDetailsService._setValidationOnEmailSsn(pid, data['form'], this.consumerData);
			this.cdr.detectChanges();
		}
	}

}
