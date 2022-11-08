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

import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";

import { ConsumerFormComponent } from "../../../shared/components/consumer-form/consumer-form.component";

import { ResponsibleDetailsService } from "./responsible-details.service";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { ApplicationError } from "../../../core/error-handler/error-handler.service";
import { DataService } from "../../../core/services/data.service";
import { FormUtilityService } from "../../../core/services/form-utility.service";
import { ModalBoxService } from "../../../shared/services/modal-box.service";

import { ApplicationDetails, DocResponse, Document } from "../../../core/models/application.model";
import { BACKEND_STATE, BACKEND_ID_TYPES, APPLICANT_TYPE } from "../../../core/models/enums";
import { ModalBoxInfo } from "../../../core/models/modalBoxInfo.model";

@Component({
	selector: "business-personal-details",
	templateUrl: "./responsible-details.component.html",
	styleUrls: ["./responsible-details.component.scss"],
	providers: [ResponsibleDetailsService],
})
export class ResponsibleDetailsComponent implements OnInit {
	@ViewChild(ConsumerFormComponent, { static: true }) consumer: ConsumerFormComponent;

	consumerData: ApplicationDetails;
	applicantType = APPLICANT_TYPE["businessApplicant"];
	pid: number;

	showPhyAddressButtons = false;
	saveExitDisability = true;
	isAPICalled = false;
	// isOLB: boolean;

	addResponsibleUser = false;
	responsibleUserData: ModalBoxInfo;
	showForm = true;
	// addAuthorizeSigner = false;
	// authorizesignerData: ModalBoxInfo;

	constructor(
		private dataService: DataService,
		private formUtilityService: FormUtilityService,
		private modalBoxService: ModalBoxService,
		private pageLoaderSvc: PageLoaderService,
		private responsibleDetailsSvc: ResponsibleDetailsService,
		private router: Router
	) {}

	ngOnInit() {
		this.dataService.changeStepper({
			name: "/business-deposit/responsible-details",
			index: 3,
			personalStepper: "businessDeposit",
		});
		this.responsibleUserData = this.modalBoxService.getModalBoxData("responsible individual");
		if (sessionStorage.getItem("pid")) {
			this.pid = Number(sessionStorage.getItem("pid"));
			sessionStorage.removeItem("pid");
		}
		if (!this.pid) {
			this.pid = 1;
			this.consumer.authorizerSelected = true;
		}
		if (sessionStorage.getItem("arn")) {
			this.getData();
			this.saveExitDisability = false;
		} else {
			this.consumer.setBusinesstype();
			this.showForm = false;
			this.consumer.showForm = false;
			this.pageLoaderSvc.hide();
		}
	}

	getData() {
		this.responsibleDetailsSvc.getConsumerData().subscribe(
			(data: ApplicationDetails) => {
				this.consumerData = data;
				this.consumer.setBusinesstype();
				if (data.responsibledetails) {
					this.resetConsumerForm();
					if (this.pid === 1) {
						this.consumer.authorizerSelected = true;
					} else {
						this.consumer.authorizerSelected = false;
					}
				}
			},
			() => {
				this.pageLoaderSvc.hide();
			}
		);
	}

	resetConsumerForm() {
		this._refreshforms();
		this.responsibleDetailsSvc._setValidationOnEmailSsn(this.pid, this.consumer, this.consumerData);
		this.responsibleDetailsSvc._setRelationshipCount(this.pid, this.consumerData);
		if (this.pid !== 1) {
			this.showPhyAddressButtons = true;
			this.consumer.showPhysicalAddress = false;
			this.formUtilityService.resetAndClearControlValidations(
				this.consumer.consumerForm.controls.preferredcontact,
				false
			);
			// this.consumer.showMailingAddress = true;
		} else {
			this.showPhyAddressButtons = false;
			this.consumer.showPhysicalAddress = true;
			// this.consumer.showMailingAddress = true;
		}
		this.saveExitDisability = false;
		this._patchData();
	}

	_refreshforms() {
		this.consumer.resetIdscanImages();
		this.consumer.resetRelationshipValidation();
		this.consumer.isDisabledForEmploymentStatus = false;
		if (this.consumer.physicalAddress) {
			this.consumer.physicalAddress.addressForm.reset();
		}
		if (this.consumer.mailingAddress) {
			this.consumer.mailingAddress.addressForm.reset();
		}
		this.consumer.consumerForm.reset();
		this.consumer.consumerForm.get("confirmEmail").disable();
		this.consumer.consumerForm.patchValue({
			title: "",
			suffix: "",
			mailingsameasphysical: true,
			addresssameasprimary: true,
			identification: { type: "", issuestate: "", issuecountry: "" },
		});
		if (this.consumer.employmentDetails) {
			this.consumer.employmentDetails.employment.reset();
			this.consumer.employmentDetails.employment.patchValue({ employmentstatus: "", state: "" });
		}
	}

	_patchData() {
		const res = this.consumerData.responsibledetails.filter((data) => data.pid === this.pid)[0];
		if (res) {
			if (!res.lastname && !res.dob) {
				this.showForm = false;
				this.consumer.showForm = false;
			} else {
				this.showForm = true;
				this.consumer.showForm = true;
			}
			this.consumer.patchData(res);
			if (res["documents"] && res["documents"].length > 0) {
				this._setDocuments(res["documents"], res.pid);
			} else {
				this.pageLoaderSvc.hide();
			}
		} else {
			this.consumer.showForm = false;
			this.showForm = false;
			this.consumer.changeInEmploymentStatus("");
			if (this.consumer.consumerForm.get("phonetype") && !this.consumer.consumerForm.get("phonetype").value) {
				this.consumer.consumerForm.patchValue({ phonetype: "mobile" });
			}
			this.consumer.samePhysicalAsPrimary = true;
			this.consumer.sameMailingAddress = true;
			this.pageLoaderSvc.hide();
		}
	}

	private _setDocuments(documents: Document[], pid) {
		// this.pageLoaderSvc.show(true, false);
		let doctype;
		documents.forEach((doc) => {
			if (doc.docpurpose === "IDSCAN" && doc.pagetype === "FRONT") {
				doctype = BACKEND_ID_TYPES[doc.doctype];
			}
		});
		this.consumer.updateIdScanType(doctype);
		this.responsibleDetailsSvc.fetchDocs(this.applicantType, pid).subscribe(
			(data: DocResponse) => {
				const idScandocument = data.applicationdocuments.filter((document: Document) => {
					return (
						document.applicanttype === this.applicantType &&
						document.pid === pid &&
						document.docpurpose === "IDSCAN"
					);
				});
				idScandocument.forEach((doc) => {
					this.consumer.updateIdScanImg(doc);
				});
				this.pageLoaderSvc.hide();
			},
			(error) => {
				this.pageLoaderSvc.hide();
			}
		);
	}

	createApplication(consumerData) {
		if (!this.isAPICalled) {
			this.isAPICalled = true;
			const callNextStep = consumerData["callnextstep"];
			delete consumerData["callnextstep"];
			this.consumerData = this.responsibleDetailsSvc.updateConsumerData(
				this.pid,
				consumerData,
				this.consumerData
			);
			this.responsibleDetailsSvc.createApplication(this.consumerData.responsibledetails, this.pid).subscribe(
				(result) => {
					if (result === "success") {
						this.isAPICalled = false;
						if (callNextStep) {
							this.continueNextStep();
						}
						this.saveExitDisability = false;
					}
					this.pageLoaderSvc.hide();
				},
				(error) => {
					this.pageLoaderSvc.hide();
					this.isAPICalled = false;
					if (error.error && error.error.code && error.error.code === 2017) {
						this.dataService.showResumePopup();
					} else {
						throw new ApplicationError(error.code);
					}
				}
			);
		}
	}

	removeApplicant() {
		this.pageLoaderSvc.show(true, false);
		let removeResponsibleFromServer = false;
		Object.keys(this.consumerData.responsibledetails).forEach((key) => {
			if (this.consumerData.responsibledetails[key].pid === this.pid) {
				removeResponsibleFromServer = true;
			}
		});
		if (removeResponsibleFromServer) {
			this.responsibleDetailsSvc.processDelete(this.pid).subscribe(
				(response) => {
					if (response.message === "success") {
						this.responsibleDetailsSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
							this.consumerData = data;
							this.responsibleDetailsSvc.getNextState().subscribe((res) => {
								if (res.nextuistate.indexOf("responsibleInfo") !== -1) {
									this.pid = Number(res.nextuistate.split("-")[1]);
									this.resetConsumerForm();
								} else {
									this.pageLoaderSvc.hide();
								}
							});
						});
					}
				},
				() => {
					this.pageLoaderSvc.hide();
				}
			);
		} else {
			const prevPid = this._getPrevPid();
			if (prevPid !== 0) {
				this.pid = prevPid;
				this.resetConsumerForm();
			}
		}
	}

	patchFromIdScan(data) {
		if (this.pid === 1) {
			setTimeout(() => {
				this.consumer.physicalAddress.addressForm.patchValue(data.data.physicaladdress);
			}, 1);
		} else {
			const res = this.consumerData.responsibledetails
				.filter((x) => x.pid === 1)[0]
				.address.filter((y) => y.addresstype.toLowerCase() === "physicaladdress")[0];
			if (res.zipcode !== data.data.physicaladdress.zipcode) {
				this.consumer.togglePhysicalAddress(false);
				this.consumer.showPhysicalAddress = true;
				setTimeout(() => {
					this.consumer.physicalAddress.addressForm.patchValue(data.data.physicaladdress);
				}, 10);
			}
		}
	}

	saveAddressData(section) {
		const validationError = this.formUtilityService.displayValidations(
			this.consumer.physicalAddress.addressForm
		);
		if (!validationError) {
			this.saveAndExit(false, section);
		}
	}

	private checkForDeletedDocs() {
		const deleteDocIds = [];
		if (this.consumer.idscanCmp.ids.FRONT.img === "" && this.consumer.idscanCmp.ids.FRONT.id !== "") {
			deleteDocIds.push(this.consumer.idscanCmp.ids.FRONT.id);
		}
		if (this.consumer.idscanCmp.ids.BACK.img === "" && this.consumer.idscanCmp.ids.BACK.id !== "") {
			deleteDocIds.push(this.consumer.idscanCmp.ids.BACK.id);
		}

		if (deleteDocIds.length > 0) {
			this.responsibleDetailsSvc.deleteConsumerDoc(deleteDocIds).subscribe();
		}
		return;
	}

	_getPrevPid() {
		let res = 0;
		const current = this.pid;
		this.consumerData.responsibledetails.forEach((item) => {
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
		this.consumerData.responsibledetails.forEach((item) => {
			const x = item.pid;
			if (res !== 0 && x < res && x > current) {
				res = x;
			} else if (res === 0 && x > current) {
				res = x;
			}
		});
		return res;
	}

	_responsibleIndividualsCount(): Number {
		let count = 0;
		this.consumerData.responsibledetails.forEach((item) => {
			if (item.relationship.isauthorized) {
				count++;
			}
			if (item.relationship.isbeneficialowner) {
				count++;
			}
			if (item.relationship.issignificantcontroller) {
				count++;
			}
		});
		return count;
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		if (sessionStorage.arn) {
			if (this.consumer.checkValidationsOnBack()) {
				this.pageLoaderSvc.hide();
				throw Error("1014");
			}
			const idObj = this.consumer.getIdscanImages();
			let primaryData = {};
			if (this.pid !== 1) {
				primaryData = this.consumerData.responsibledetails.filter((data) => data.pid === 1)[0];
			}
			const consumerDetails = this.consumer.getConsumerFormDetails("back", primaryData);
			this.consumerData = this.responsibleDetailsSvc.updateConsumerData(
				this.pid,
				consumerDetails,
				this.consumerData
			);
			this.checkForDeletedDocs();
			this.responsibleDetailsSvc.saveDocs(idObj).subscribe((data) => {
				this.responsibleDetailsSvc
					.processBack(this.consumerData.responsibledetails, this.pid)
					.subscribe((result) => {
						if (result === "success") {
							if (this.pid === 1) {
								this.router.navigate(["/business-deposit/select-product"]);
							} else {
								const prevPid = this._getPrevPid();
								if (prevPid !== 0) {
									this.pid = prevPid;
									this.resetConsumerForm();
								}
							}
						} else {
							this.pageLoaderSvc.hide();
						}
					});
			});
		} else {
			this.router.navigate(["/business-deposit/select-product"]);
		}
	}

	saveAndExit(exit = true, section?: string) {
		const mileStoneError = this.formUtilityService.checkMilestoneError(this.consumer.consumerForm);
		if (this.pid !== 1 || !mileStoneError) {
			this.pageLoaderSvc.show(true, false);
			const idObj = this.consumer.getIdscanImages();
			let primaryData = {};
			if (this.pid !== 1) {
				primaryData = this.consumerData.responsibledetails.filter((data) => data.pid === 1)[0];
			}
			const consumerDetails = this.consumer.getConsumerFormDetails("save", primaryData);
			this.consumerData = this.responsibleDetailsSvc.updateConsumerData(
				this.pid,
				consumerDetails,
				this.consumerData
			);
			if (this.consumer.tyfoneEditableFields && this.consumer.tyfoneEditableFields.length) {
				consumerDetails["manualtyfonefields"] = this.consumer.tyfoneEditableFields;
			}

			this.checkForDeletedDocs();
			this.responsibleDetailsSvc.saveDocs(idObj).subscribe((data) => {
				this.responsibleDetailsSvc
					.processSaveAndExit(this.consumerData.responsibledetails, this.pid)
					.subscribe((result) => {
						if (result === "success") {
							if (exit) {
								this.router.navigate(["/business-deposit/" + BACKEND_STATE["saveAndExit"]]);
							} else {
								this.consumer.refreshForm(section);
							}
						}
						this.pageLoaderSvc.hide();
					});
			});
		} else {
			const el = this.consumer.consumerForm.controls.lastname["nativeElement"];
			el.scrollIntoView({ behavior: "smooth" });
		}
	}

	nextStep() {
		//this.pageLoaderSvc.show(true, false);

		this.continueNextStep();

		/*const relationshipError = this.consumer.checkRelationship(
			this.modalBoxService.authorizeSigner,
			this.modalBoxService.beneficialOwner,
			this.modalBoxService.significantController
		);
		const validationError = this.consumer.checkValidations();
		if (relationshipError || validationError) {
			this.pageLoaderSvc.hide();
			return;
		}
		if (!sessionStorage.arn) {
			this.consumer.checkApplication(true);
		} else {
			this.continueNextStep();
		}*/
	}

	continueNextStep() {
		this.router.navigate(["/business-deposit/review"]);

		/*const idObj = this.consumer.getIdscanImages();
		let primaryData = {};
		if (this.pid !== 1) {
			primaryData = this.consumerData.responsibledetails.filter((data) => data.pid === 1)[0];
		}
		const consumerDetails = this.consumer.getConsumerFormDetails("next", primaryData);
		/*this.consumerData = this.responsibleDetailsSvc.updateConsumerData(
			this.pid,
			consumerDetails,
			this.consumerData
		);*/
		//this.checkForDeletedDocs();

		/*	this.responsibleDetailsSvc.saveDocs(idObj).subscribe((data) => {
			this.responsibleDetailsSvc
				.processNextStepNavigation(this.consumerData.responsibledetails, this.pid)
				.subscribe((result) => {
					if (result === "success") {
						this.consumer.authorizerSelected = false;
						this.responsibleDetailsSvc.getConsumerData().subscribe((appDetails: ApplicationDetails) => {
							this.consumerData = appDetails;
							const nextPid = this._getNextPid();
							if (nextPid !== 0) {
								this.responsibleDetailsSvc.getNextState().subscribe((res) => {
									if (res.nextuistate.indexOf("responsibleInfo") !== -1) {
										this.pid = Number(res.nextuistate.split("-")[1]);
										this.resetConsumerForm();
										const el = this.consumer.idscanCmp.idFront["nativeElement"];
										el.scrollIntoView({ behavior: "smooth" });
									} else {
										this.pageLoaderSvc.hide();
									}
								});
							} else {
								const responsiblecount = this._responsibleIndividualsCount();
								if (responsiblecount < this.consumer.getAllowedResponsibleIndividuals()) {
									this.addResponsibleUser = true;
								} else {
									this.responsibleDetailsSvc
										.setAdditionalResponsibleCount({ count: 0 }, this.pid)
										.subscribe((r) => {
											this.responsibleDetailsSvc.getNextState().subscribe((res) => {
												this.router.navigate(["/business-deposit/" + BACKEND_STATE[res.nextuistate]]);
											});
										});
								}
								this.pageLoaderSvc.hide();
							}
						});
					}
				});
		});*/
	}

	onAddAccount(event: boolean) {
		this.pageLoaderSvc.show(true, false);
		const consumer = this.consumer.consumerForm.getRawValue();
		if (event) {
			this.responsibleDetailsSvc.setAdditionalResponsibleCount({ count: 1 }, this.pid).subscribe((data) => {
				if (data.nextuistate.indexOf("responsibleInfo") !== -1) {
					this.pid = Number(data.nextuistate.split("-")[1]);
					if (consumer.relationship.isauthorized) {
						this.modalBoxService.authorizeSigner++;
					}
					if (consumer.relationship.isbeneficialowner) {
						this.modalBoxService.beneficialOwner++;
					}
					if (consumer.relationship.issignificantcontroller) {
						this.modalBoxService.significantController++;
					}
					this.resetConsumerForm();
					this.addResponsibleUser = false;
					const el = this.consumer.idscanCmp.idFront["nativeElement"];
					el.scrollIntoView({ behavior: "smooth" });
					this.pageLoaderSvc.hide();
				}
			});
		} else {
			if (
				!consumer.relationship.issignificantcontroller &&
				this.modalBoxService.significantController === 0
			) {
				this.consumer.checkRelationship(
					this.modalBoxService.authorizeSigner,
					this.modalBoxService.beneficialOwner,
					this.modalBoxService.significantController,
					true
				);
				this.addResponsibleUser = false;
				this.pageLoaderSvc.hide();
			} else {
				this.responsibleDetailsSvc.setAdditionalResponsibleCount({ count: 0 }, this.pid).subscribe((data) => {
					this.router.navigate(["/business-deposit/" + BACKEND_STATE[data.nextuistate]]);
				});
			}
		}
	}

	setFooterActions(event) {
		if (event) {
			this.showForm = true;
		}
	}
}
