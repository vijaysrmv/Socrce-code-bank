/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            : 		Newgen OAO
Module                 :		Consumer OAO
File Name              : 		joint-details.component.ts
Author                 : 		Aditya Agrawal
Date (DD/MM/YYYY)      : 		29/01/2019
Description            : 		joint detail component
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { JointDetailsService } from './joint-details.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';
import { FormUtilityService } from '../../../core/services/form-utility.service';
import { ModalBoxService } from './../../../shared/services/modal-box.service';

import { ApplicationDetails, ApplicantDetails, Document, DocResponse } from '../../../core/models/application.model';
import { APPLICANT_TYPE, BACKEND_ID_TYPES, BACKEND_STATE } from '../../../core/models/enums';
import { ModalBoxInfo } from '../../../core/models/modalBoxInfo.model';
import { AppConstants } from '../../../core/utility/app.constants';
import { ConsumerFormComponent } from '../../../shared/components/consumer-form/consumer-form.component';
import { CustomValidation } from '../../../core/utility/custom-validations';


@Component({
	selector: 'app-joint-details',
	templateUrl: './joint-details.component.html',
	styleUrls: ['./joint-details.component.scss'],
	providers: [
		JointDetailsService
	]
})
export class JointDetailsComponent implements OnInit {

	@ViewChild(ConsumerFormComponent, { static: false }) jointDetailForm: ConsumerFormComponent;

	MAX_COUNT = AppConstants.maxConsumerJoints;
	showCountDiv = false;
	consumerData: ApplicationDetails;
	reviewPage = false;
	jointApplicantCount: number;

	showBeneficiaryModal = false;
	showJointModal = false;
	showConfirmationModal = false;
	beneficiaryModalData: ModalBoxInfo;
	jointModalData: ModalBoxInfo;
	beneficiaryAccountType = 'beneficiary';
	jointAccountType = 'joint holder';
	jointFormCount: number;
	indexToBeDeleted: number;
	applicantType = APPLICANT_TYPE['consumerJoint'];
	pid: number;
	isPrimaryMinor = false;
	showForm = true;
	// isOLB = false;

	constructor(
		private dataService: DataService,
		private jointDetailsService: JointDetailsService,
		private formUtilitySvc: FormUtilityService,
		private modalBoxService: ModalBoxService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
	) { }

	ngOnInit() {
		this.dataService.changeStepper({ name: '/consumer-deposit/joint-details', index: 2, personalStepper: 'consumerDeposit' });
		// this.dataService.isOLBUser.subscribe(olb => {
		// 	this.isOLB = olb;
		// });
		this.beneficiaryModalData = this.modalBoxService.getModalBoxData(this.beneficiaryAccountType);
		this.jointModalData = this.modalBoxService.getModalBoxData(this.jointAccountType);
		if (sessionStorage.getItem('pid')) {
			this.pid = Number(sessionStorage.getItem('pid'));
			sessionStorage.removeItem('pid');
		}
		if (!this.pid) {
			this.pid = 2;
		}
		if (sessionStorage.getItem('arn')) {
			this.getData();
		}
	}

	// getJointCount() {
	// 	this.jointFormCount = this.modalBoxService.getJointCount();
	// }

	getData() {
		this.jointDetailsService.getConsumerData().subscribe((data: ApplicationDetails) => {
			this.consumerData = data;
			// In case of HSA joint count is 2, for all others, its 3.
			this.MAX_COUNT = (data.products.findIndex(product => product.productid === 'HSA') !== -1) ? 2 : this.MAX_COUNT;
			this.isPrimaryMinor = this.formUtilitySvc.getAgeRange(data.personaldetails.dob) === 'minor';
			if (data.jointdetails) {
				console.log('here');
				this.resetConsumerForm();
			}
			// this.pid = Number(data.uistate.split('-')[1]) + 1;
			// } else {
			// 	this.pid = data.jointdetails.length + 1;
			// }
			// if (data['isolb']) {
			// 	this.isOLB = true;
			// 	this.dataService.changeOlbState(true);
			// }
			// if (data.jointdetails) {
			// 	if (!this.modalBoxService.getJointCount()) {
			// 		if (data.jointdetails.length === 0) {
			// 			this.modalBoxService.setJointCount(1);
			// 			this.jointFormCount = 1;
			// 		} else {
			// 			this.modalBoxService.setJointCount(data.jointdetails.length);
			// 			this.jointFormCount = data.jointdetails.length;
			// 		}
			// 	}
			// 	this.pageLoaderSvc.hide();
			// this.jointDetailForm.initializeJointForm();
			// this.jointDetailForm.checkDuplicateSsnEmail(data.personaldetails.email, data.personaldetails.ssn);
			// this.jointDetailForm.patchData(data.jointdetails);
			// } else {
			// 	// this.jointDetailForm.initializeJointForm();
			// 	this.pageLoaderSvc.hide();
			// }
		}, (error) => {
			throw error;
		});
	}

	resetConsumerForm() {
		this._refreshforms();
		this.jointDetailsService._setValidationOnEmailSsn(this.pid, this.jointDetailForm, this.consumerData);
		this.jointDetailForm.showPhysicalAddress = false;
		this._patchData();
	}

	_refreshforms() {
		this.jointDetailForm.resetIdscanImages();
		if (this.jointDetailForm.physicalAddress) {
			this.jointDetailForm.physicalAddress.addressForm.reset();
		}
		if (this.jointDetailForm.mailingAddress) {
			this.jointDetailForm.mailingAddress.addressForm.reset();
		}
		this.jointDetailForm.consumerForm.reset();
		this.jointDetailForm.consumerForm.get('confirmEmail').disable();
		this.jointDetailForm.consumerForm.patchValue({ title: '', suffix: '', mailingsameasphysical: true, addresssameasprimary: true, uscitizen: true, identification: { type: '', issuestate: '', issuecountry: '' } });
		if (this.jointDetailForm.employmentDetails) {
			this.jointDetailForm.employmentDetails.employment.reset();
			this.jointDetailForm.employmentDetails.employment.patchValue({ employmentstatus: '', state: '' });
		}
	}

	_patchData() {
		const res = this.consumerData.jointdetails.filter(data => data.pid === this.pid)[0];
		if (res) {
			if (!res.lastname && !res.dob) {
				this.showForm = false;
				this.jointDetailForm.showForm = false;
			} else {
				this.showForm = true;
				this.jointDetailForm.showForm = true;
			}
			this.jointDetailForm.patchData(res);
			if (res['documents'] && res['documents'].length > 0) {
				this._setDocuments(res['documents'], res.pid);
			} else {
				this.pageLoaderSvc.hide();
			}
		} else {
			this.showForm = false;
			this.jointDetailForm.showForm = false;
			this.jointDetailForm.changeInEmploymentStatus('');
			this.jointDetailForm.samePhysicalAsPrimary = true;
			this.jointDetailForm.sameMailingAddress = true;
			this.pageLoaderSvc.hide();
		}
	}

	// callSetDocuments(event) {
	// 	this._setDocuments(event.documents, event.pid, event.index);
	// }

	private _setDocuments(documents: Document[], pid) {
		this.pageLoaderSvc.show(true, false);
		// let doctype;
		// documents.forEach(doc => {
		// 	doctype = BACKEND_ID_TYPES[doc.doctype];
		// });
		// this.jointDetailForm.updateIdScanType(doctype, index);
		this.jointDetailsService.fetchDocs(this.applicantType, pid).subscribe((data: DocResponse) => {
			const doctype = BACKEND_ID_TYPES[documents[0].doctype];
			this.jointDetailForm.updateIdScanType(doctype);
			const idScandocument = data.applicationdocuments.filter((document: Document) => {
				return (document.applicanttype === this.applicantType && document.pid === pid);
			});
			idScandocument.forEach(doc => {
				this.jointDetailForm.updateIdScanImg(doc);
			});
			// this.pageLoaderSvc.hide();
			setTimeout(() => {
				this.pageLoaderSvc.hide();
			}, 0);
		});
	}

	private checkForDeletedDocs() {
		const deleteDocIds = [];
		if (this.jointDetailForm.idscanCmp.ids.FRONT.img === '' && this.jointDetailForm.idscanCmp.ids.FRONT.id !== '') {
			deleteDocIds.push(this.jointDetailForm.idscanCmp.ids.FRONT.id);
		}
		if (this.jointDetailForm.idscanCmp.ids.BACK.img === '' && this.jointDetailForm.idscanCmp.ids.BACK.id !== '') {
			deleteDocIds.push(this.jointDetailForm.idscanCmp.ids.BACK.id);
		}
		if (deleteDocIds.length > 0) {
			this.jointDetailsService.deleteConsumerDoc(deleteDocIds).subscribe();
		}
	}

	saveData() {
		this.pageLoaderSvc.show(true, false);
		const idsList = this.jointDetailForm.getIdscanImages();
		const jointForm = this.jointDetailForm.getConsumerFormDetails('save', this.consumerData.personaldetails);
		const jointFormArray: ApplicantDetails[] = this.jointDetailsService.getJointFormArray(this.consumerData, jointForm, this.pid);
		this.checkForDeletedDocs();
		// const nextPid = this._getNextPid();
		// const nextPidDocsCheck = nextPid !== 0 && !this.consumerData.jointdetails[nextPid].documents;
		// const currentPidDocsCheck = nextPid === 0 && !this.consumerData.jointdetails[this.pid].documents;
		// if (nextPidDocsCheck || currentPidDocsCheck) {
		// 	const pidToBeDeleted = currentPidDocsCheck ? this.pid : nextPid;
		// 	console.log('NExt joint', currentPidDocsCheck, nextPid, this.consumerData.jointdetails[pidToBeDeleted]);
		// 	this.jointDetailsService.processDelete(pidToBeDeleted).subscribe((response) => {
		// 		if (response.message === 'success') {
		// 			this.saveAndExitRedirection(idsList, jointFormArray);
		// 		}
		// 	}, () => {
		// 		this.pageLoaderSvc.hide();
		// 	});
		// } else {
			this.saveAndExitRedirection(idsList, jointFormArray);
		// }
	}

	saveAndExitRedirection(idsList, jointFormArray) {
		this.jointDetailsService.saveDocs(idsList).subscribe(resp => {
			if (resp) {
				this.jointDetailsService.processSaveAndExit(jointFormArray, this.pid).subscribe((response) => {
					if (response === 'success') {
						this.router.navigate(['/consumer-deposit/' + BACKEND_STATE['saveAndExit']]);
					}
					this.pageLoaderSvc.hide();
				});
			}
		});
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		if (this.jointDetailForm.checkValidationsOnBack()) {
			this.pageLoaderSvc.hide();
			throw Error('1014');
		}
		const idsList = this.jointDetailForm.getIdscanImages();
		const jointForm = this.jointDetailForm.getConsumerFormDetails('back', this.consumerData.personaldetails);
		const jointFormArray: ApplicantDetails[] = this.jointDetailsService.getJointFormArray(this.consumerData, jointForm, this.pid);
		this.checkForDeletedDocs();
		this.jointDetailsService.saveDocs(idsList).subscribe(resp => {
			if (resp) {
				this.jointDetailsService.processBack(jointFormArray, this.pid).subscribe((response) => {
					if (response === 'success') {
						// if (this.pid === 2) {
						// 	this.router.navigate(['/consumer-deposit/personal-details']);
						// } else {
						const prevPid = this._getPrevPid();
						if (prevPid !== 0) {
							this.pid = prevPid;
							this.resetConsumerForm();
							const el = this.jointDetailForm.idscanCmp.idFront['nativeElement'];
							el.scrollIntoView({ behavior: 'smooth' });
						} else {
							this.router.navigate(['/consumer-deposit/personal-details']);
						}
						// }
					}
				});
			}
		});
	}

	nextStep() {
		const idObj = this.jointDetailForm.getIdscanImages();
		const validationError = this.jointDetailForm.checkValidations();
		if (!validationError) {
			this.pageLoaderSvc.show(true, false);
			const applicationDetails: ApplicationDetails = this.consumerData;
			const jointForm = this.jointDetailForm.getConsumerFormDetails('next', this.consumerData.personaldetails);
			const jointFormArray: ApplicantDetails[] = this.jointDetailsService.getJointFormArray(this.consumerData, jointForm, this.pid);
			applicationDetails.jointdetails = this.jointDetailsService.setConsumerData(jointFormArray, this.pid)['jointdetails'];
			if (this.formUtilitySvc.checkProductAgeValidation(applicationDetails)) {
				throw new ApplicationError('1011');
			}
			this.checkForDeletedDocs();
			this.jointDetailsService.saveDocs(idObj).subscribe(response => {
				if (response) {
					this.jointDetailsService.processNextStepNavigation(jointFormArray, this.pid).subscribe((resp) => {
						if (resp === 'success') {
							this.jointDetailsService.getConsumerData().subscribe((appDetails: ApplicationDetails) => {
								this.consumerData = appDetails;
								this.nextState();
							});
						}
					});
				}
			});
		}
	}

	getBeneficiaryCount() {
		return this.consumerData.beneficiarydetails ? this.consumerData.beneficiarydetails.length : 0;
	}

	addApplicant() {
		if (this.showBeneficiaryModal) {
			if (this.beneficiaryModalData.applicantCount < AppConstants.maxConsumerBeneficiaries) {
				this.beneficiaryModalData.applicantCount = this.beneficiaryModalData.applicantCount + 1;
			}
		}
		// else if (this.showJointModal) {
		// 	this.jointModalData.applicantCount = this.jointModalData.applicantCount + 1;
		// }
	}

	subtractApplicant() {
		if (this.showBeneficiaryModal) {
			if (this.beneficiaryModalData.applicantCount > 1) {
				this.beneficiaryModalData.applicantCount = this.beneficiaryModalData.applicantCount - 1;
			}
		}
		// else if (this.showJointModal) {
		// 	this.jointModalData.applicantCount = this.jointModalData.applicantCount - 1;
		// }
	}

	addAccount(event) {
		const beneficiaryCount = event ? this.beneficiaryModalData.applicantCount : 0;
		this.modalBoxService.setBeneficiaryCount(beneficiaryCount);
		this.jointDetailsService.setBeneficiaryCount({ count: beneficiaryCount }).subscribe(data => {
			this.pageLoaderSvc.show(true, false);
			this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[data.nextuistate]]);
		});
	}

	addJointApplicant(event) {
		// if (this.modalBoxService.getJointCount() >= this.MAX_COUNT) {
		// 	return;
		// }
		// this.jointDetailForm.addJointForm(1);
		// this.jointDetailForm.setJointAccountManager(true);
		// this.modalBoxService.setJointCount(this.modalBoxService.getJointCount() + 1);
		// this.getJointCount();
		// this.jointDetailForm.checkDuplicateSsnEmail(this.consumerData.personaldetails.email, this.consumerData.personaldetails.ssn);
		if (this.showJointModal) {
			const jointCount = event ? 1 : 0;
			// this.modalBoxService.setJointCount(jointCount);
			this.jointDetailsService.setJointApplicantCount({ count: jointCount }, this.pid).subscribe(data => {
				if (data.nextuistate.indexOf('jointInfo') !== -1) {
					this.showJointModal = false;
					this.pid = Number(data.nextuistate.split('-')[1]) + 1;
					this.resetConsumerForm();
					const el = this.jointDetailForm.idscanCmp.idFront['nativeElement'];
					el.scrollIntoView({ behavior: 'smooth' });
					this.pageLoaderSvc.hide();
				} else {
					this.showJointModal = false;
					this.checkBeneficiary();
				}
			});
		} else {
			this.checkBeneficiary();
		}


	}

	showOrHideBeneficiaryModel(event) {
		this.showBeneficiaryModal = event;
	}

	showOrHideConfirmationModal(event) {
		this.showConfirmationModal = event['delete'];
		this.indexToBeDeleted = event['index'];
	}

	// deleteJointDetailForm(event) {
	// 	if (event) {
	// 		this.pageLoaderSvc.show(true, false);
	// 		this.removeJoint(this.indexToBeDeleted);
	// 	}
	// 	this.showConfirmationModal = false;
	// }

	// removeJoint(index: number) {
	// 	let removeJointFromServer = false;
	// 	// const pid = this.jointDetailForm.getPid(index);
	// 	Object.keys(this.consumerData.jointdetails).forEach(key => {
	// 		if (this.consumerData.jointdetails[key].pid === this.pid) {
	// 			removeJointFromServer = true;
	// 		}
	// 	});
	// 	if (removeJointFromServer) {
	// 		this.jointDetailsService.processDelete(this.pid).subscribe((response) => {
	// 			if (response.message === 'success') {
	// 				// this.jointDetailsService.getConsumerData().subscribe((data: ApplicationDetails) => {
	// 				// 	this.consumerData = data;
	// 				// 	this.jointDetailForm.removeJointForm(index);
	// 				// 	this.nextState();
	// 				// });
	// 			}
	// 		}, () => {
	// 			this.pageLoaderSvc.hide();
	// 		});
	// 	} else {
	// 		// this.jointDetailForm.removeJointForm(index);
	// 		this.nextState();
	// 	}
	// }

	removeApplicant() {
		this.pageLoaderSvc.show(true, false);
		let removeJointFromServer = false;
		Object.keys(this.consumerData.jointdetails).forEach(key => {
			if (this.consumerData.jointdetails[key].pid === this.pid) {
				removeJointFromServer = true;
			}
		});
		if (removeJointFromServer) {
			this.jointDetailsService.processDelete(this.pid).subscribe((response) => {
				if (response.message === 'success') {
					this.jointDetailsService.getConsumerData().subscribe((data: ApplicationDetails) => {
						this.consumerData = data;
						this.jointDetailsService.getNextUIState().subscribe((res) => {
							if (res.nextuistate.indexOf('jointInfo') !== -1) {
								this.pid = Number(res.nextuistate.split('-')[1]) + 1;
								this.resetConsumerForm();
								const el = this.jointDetailForm.idscanCmp.idFront['nativeElement'];
								el.scrollIntoView({ behavior: 'smooth' });
							} else {
								this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[res.nextuistate]]);
								this.pageLoaderSvc.hide();
							}
						});
					});
				}
			}, () => {
				this.pageLoaderSvc.hide();
			});
		} else {
			const prevPid = this._getPrevPid();
			if (prevPid !== 0) {
				this.pid = prevPid;
				this.resetConsumerForm();
			} else {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE['personalInfo']]);
			}
			// if (this.isPrimaryMinor && this.consumerData.jointdetails.length === 0) {
			// } else {
			// 	this.nextState();
			// }
		}
	}

	nextState() {
		const nextPid = this._getNextPid();
		if (nextPid !== 0) {
			this.jointDetailsService.getNextUIState().subscribe((res) => {
				if (res.nextuistate.indexOf('jointInfo') !== -1) {
					this.pid = Number(res.nextuistate.split('-')[1]) + 1;
					this.resetConsumerForm();
					const el = this.jointDetailForm.idscanCmp.idFront['nativeElement'];
					el.scrollIntoView({ behavior: 'smooth' });
				} else {
					this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[res.nextuistate]]);
					this.pageLoaderSvc.hide();
				}
			});
		} else {
			if (this.consumerData.jointdetails.length < this.getAllowedJointCount()) {
				this.showJointModal = true;
				this.pageLoaderSvc.hide();
			} else {
				this.checkBeneficiary();
			}
		}
	}

	getAllowedJointCount() {
		return this.MAX_COUNT;
	}

	checkBeneficiary() {
		const beneficiaryCount = this.getBeneficiaryCount();
		if (beneficiaryCount !== 0) {
			this.jointDetailsService.setBeneficiaryCount({ count: beneficiaryCount }).subscribe(data => {
				this.router.navigate(['/consumer-deposit/' + BACKEND_STATE[data.nextuistate]]);
			});
		} else {
			this.pageLoaderSvc.hide();
			this.showBeneficiaryModal = true;
		}
	}

	_getPrevPid() {
		let res = 0;
		const current = this.pid;
		this.consumerData.jointdetails.forEach(item => {
			const x = item.pid;
			if (res !== 0 && x > res && x < current) {
				res = x;
			} else if (res === 0 && x < current) {
				res = x;
			}
		});
		return res;
	}

	_getNextPid() {
		let res = 0;
		const current = this.pid;
		this.consumerData.jointdetails.forEach(item => {
			const x = item.pid;
			if (res !== 0 && x < res && x > current) {
				res = x;
			} else if (res === 0 && x > current) {
				res = x;
			}
		});
		return res;
	}

	setFooterActions(event) {
		if (event) {
			this.showForm = true;
		}
	}
}
