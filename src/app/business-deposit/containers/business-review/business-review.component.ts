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

import {
	Component,
	Input,
	OnInit,
	ViewChild,
	ViewChildren,
	QueryList,
	ChangeDetectorRef,
	ElementRef,
} from "@angular/core";
// import { FormGroup } from '@angular/forms';
import { Router } from "@angular/router";
import { BsModalRef } from "ngx-bootstrap/modal";

import { BusinessFormComponent } from "../../components/business-form/business-form.component";
import { ConsumerFormComponent } from "../../../shared/components/consumer-form/consumer-form.component";
import { IdentityComponent } from "../../../shared/components/identity/identity.component";

import { BusinessReviewService } from "./business-review.service";
import { ResponsibleDetailsService } from "../responsible-details/responsible-details.service";
import { MdmService } from "../../../core/apis/mdm.service";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { ApplicationError } from "../../../core/error-handler/error-handler.service";
import { DataService } from "../../../core/services/data.service";
import { ModalBoxService } from "../../../shared/services/modal-box.service";

import { ApplicationDetails } from "../../../core/models/application.model";
// import { BusinessDisclosure } from '../../../core/models/disclosure.model';
import { BACKEND_STATE } from "../../../core/models/enums";
import { windowWhen } from "rxjs/operators";

@Component({
	selector: "app-business-review",
	templateUrl: "./business-review.component.html",
	styleUrls: ["./business-review.component.scss"],
	providers: [ResponsibleDetailsService, BusinessReviewService],
})
export class BusinessReviewComponent implements OnInit {
	@ViewChildren(ConsumerFormComponent) responsibleList: QueryList<ConsumerFormComponent>;
	@ViewChild(IdentityComponent, { static: false }) identity: IdentityComponent;
	@ViewChild("businessDetails", { static: false }) business: BusinessFormComponent;
	@ViewChild("relationshipTableRef", { static: false }) relationshipTableRef: ElementRef;

	@Input() selectedSingleAccount = true;

	modalRef: BsModalRef;

	// additionalResponsibleUser: boolean;
	// authorizeSigner: boolean;
	consumerData: any;
	editableSection: string;
	// questionnaireForm: FormGroup;
	// reviewPage = true;
	// showMailingAddress = true;
	significantRequiredError = false;
	// checkCount = 0;
	selectedProducts = [];
	// disclosures: BusinessDisclosure[];
	currentUIState: string;
	isDataLoaded: boolean;

	constructor(
		private cdr: ChangeDetectorRef,
		private businessReviewSvc: BusinessReviewService,
		private dataService: DataService,
		private mdmService: MdmService,
		private modalBoxService: ModalBoxService,
		private pageLoaderSvc: PageLoaderService,
		private responsibleDetailsSvc: ResponsibleDetailsService,
		private router: Router
	) {}

	ngOnInit() {
		this.dataService.changeStepper({
			name: "/business-deposit/review",
			index: 4,
			personalStepper: "businessDeposit",
		});
		if (sessionStorage.getItem("arn")) {
			this.getData();
		} else {
			this.pageLoaderSvc.hide();
		}
		this.dataService.editableSection.subscribe((sectionName) => {
			this.editableSection = sectionName;
		});
		// const uistate = sessionStorage.getItem('uistate');
	}

	setSelectedProducts() {
		this.mdmService.getProducts("businessShare").subscribe((data) => {
			const activeProducts = data.filter((product) => product.status);
			const productList = activeProducts.reduce((mappedProduct, product) => {
				const obj = mappedProduct;
				obj[product.productid] = product.productname;
				return obj;
			}, {});
			this.selectedProducts = this.consumerData.products.map((product) => productList[product.productid]);
		});
	}

	patchAddResponsible(component) {
		const res = this.consumerData.responsibledetails.filter((data) => data.pid === component.pid)[0];
		component.patchData(res);
	}

	removeApplicant(pid) {
		this.pageLoaderSvc.show(true, false);
		if (this.editableSection) {
			const arr = this.responsibleList.toArray();
			const res = arr.filter((data) => data.pid === pid)[0];
			res.toggleSectionEdit(this.editableSection);
		}
		this.responsibleDetailsSvc.processDelete(pid).subscribe(
			(response) => {
				if (response.message === "success") {
					this.getData();
				}
			},
			() => {
				this.pageLoaderSvc.hide();
			}
		);
	}

	patchBusinessData(component) {
		if (this.consumerData && this.consumerData.businessdetails) {
			component.createOwnershipPercentageForm(this.consumerData.responsibledetails);
			component.patchData(this.consumerData.businessdetails);
			component.setBusinessType(this.consumerData.businessdetails.ownershipstructure);
			component.hideTaxType(this.consumerData.businessdetails.ownershipstructure);
			this.cdr.detectChanges();
			const uistate = sessionStorage.getItem("uistate");
			if (uistate !== "reviewInProgress") {
				this.pageLoaderSvc.hide();
			}
		}
	}

	getData() {
		this.businessReviewSvc.getConsumerData().subscribe(
			(data: ApplicationDetails) => {
				this.currentUIState = data.uistate;
				this.consumerData = data;
				this.isDataLoaded = true;
				//this.business.emitPatchBusinessData();

				if (data.products) {
					this.setSelectedProducts();
				}
				this._validateSignificantControllerCount();
				if (this.currentUIState === "reviewInProgress") {
					this.nextStep();
				}
				const uistate = sessionStorage.getItem("uistate");
				if (uistate !== "reviewInProgress") {
					this.pageLoaderSvc.hide();
				}
			},
			(error) => {
				this.pageLoaderSvc.hide();
			}
		);
	}

	checkSectionEditable() {
		if (this.editableSection === "") {
			return false;
		} else {
			// console.log('Please save or discard the already editing section.');
			return true;
		}
	}

	editResponsibleList(pid: number) {
		const arr = this.responsibleList.toArray();
		const res = arr.filter((data) => data.pid === pid)[0];
		res.toggleSectionEdit("relationship_details");
		const el = res.relationshipRef.nativeElement;
		el.scrollIntoView({ behavior: "smooth" });
		// res.employmentDetails.employment.controls.employername['nativeElement'].focus();
	}

	prevStep() {
		if (this.checkSectionEditable()) {
			throw new ApplicationError("1001");
		}
		this.pageLoaderSvc.show(true, false);
		this.router.navigate(["/business-deposit/business-details"]);
	}

	saveAndExit() {
		if (this.checkSectionEditable()) {
			throw new ApplicationError("1001");
		}
		const businessDetails: ApplicationDetails = {};
		this.pageLoaderSvc.show(true, false);

		businessDetails["responsibledetails"] = this.consumerData.responsibledetails;
		if (this.business) {
			businessDetails["business"] = this.business.getbusinessFormDetails();
		}
		this.businessReviewSvc.processSaveAndExit(businessDetails, this.currentUIState).subscribe((result) => {
			if (result === "success") {
				this.router.navigate(["/business-deposit/" + BACKEND_STATE["saveAndExit"]]);
			}
		});
	}

	nextStep() {
		console.log("I am here");
		this.pageLoaderSvc.show(true, false);
		// setTimeout(function(){
		// 	window.location.href="http://localhost:4200/business-deposit/finish/success";
		// },2000)
		this.router.navigate(["/business-deposit/upload-documents"]);

		/*if (this.checkSectionEditable()) {
			throw new ApplicationError("1001");
		}*/

		/* this.pageLoaderSvc.show(true, false);
			if (!this._validateSignificantControllerCount()) {
			this.businessReviewSvc.reviewContinue().subscribe(
				(data) => {
					if (data.message === "IDA") {
						this.businessReviewSvc.idaQuestion().subscribe(
							(response) => {
								if (response.nextrequeststate === "IdentificationQuestion") {
									if (response.authenticationquestions && response.authenticationquestions.length > 0) {
										this.identity.showTransunionQues(response);
									} else {
										//this.router.navigate(["/errors/technical-error"]);
										
									}
								} else {
									//this.router.navigate(["/business-deposit/" + BACKEND_STATE[response.nextrequeststate]]);
									
								}
								this.pageLoaderSvc.hide();
							},
							(error) => {
								// Unhandled error here
							}
						);
					} else {
						//this.router.navigate(["/business-deposit/" + BACKEND_STATE[data.message]]);
						
					}
				},
				(error) => {
					//this.router.navigate(["/errors/technical-error"]);
					this.router.navigate(["/business-deposit/finish/success"]);
				}
			);
		} else {
			this.pageLoaderSvc.hide();
		//	const el = this.relationshipTableRef.nativeElement;
		//	el.scrollIntoView({ behavior: "smooth" });
			this.router.navigate(["/business-deposit/finish/success"]);
		}*/
	}

	_validateSignificantControllerCount() {
		this.modalBoxService.significantController = 0;
		this.consumerData.responsibledetails.forEach((item) => {
			if (item.relationship && item.relationship.issignificantcontroller) {
				this.modalBoxService.significantController++;
			}
		});

		if (this.modalBoxService.significantController === 0) {
			this.significantRequiredError = true;
		} else {
			this.significantRequiredError = false;
		}
		return this.significantRequiredError;
	}

	submitQuestionnaireForm($event) {
		$event.ref.closeModal();
		this.pageLoaderSvc.show(true, true);
		this.businessReviewSvc.idaAnswerView($event.request_QA).subscribe(
			(response) => {
				if (response.nextrequeststate === "Challenge") {
					this.pageLoaderSvc.hide();
					this.identity.showTransunionQues(response);
				} else {
					this.router.navigate(["/business-deposit/" + BACKEND_STATE[response.nextrequeststate]]);
				}
			},
			(error) => {
				this.pageLoaderSvc.hide();
				this.router.navigate(["/errors/technical-error"]);
			}
		);
	}

	saveData(event: any, page: string) {
		let relationshipError = false;
		if (event["accounttype"] === "personal") {
			relationshipError = this._setAndValidateResponsible(event);
		}
		const validationError = event["form"].checkValidations();
		if (!validationError && !relationshipError) {
			this.pageLoaderSvc.show(true, false);
			const businessDetails = this._getBusinessDetails(event);
			this.businessReviewSvc.saveDetails(businessDetails).subscribe((result) => {
				event["form"].refreshForm(event["section"]);
				this.cdr.detectChanges();
				this.getData();
			});
		}
	}

	_setAndValidateResponsible(data) {
		const pid = data.form.consumerForm.getRawValue().pid;
		this.responsibleDetailsSvc._setValidationOnEmailSsn(pid, data["form"], this.consumerData);
		this.responsibleDetailsSvc._setRelationshipCount(pid, this.consumerData);
		const relationshipError = data["form"].checkRelationship(
			this.modalBoxService.authorizeSigner,
			this.modalBoxService.beneficialOwner,
			this.modalBoxService.significantController
		);
		return relationshipError;
	}

	_getBusinessDetails(data): Object {
		const accountType = data["accounttype"];
		const businessDetails = {};

		if (accountType === "personal") {
			const pid = data.form.consumerForm.getRawValue().pid;
			this._getResponsibleData(pid, data);
			businessDetails["responsibledetails"] = this.consumerData.responsibledetails;
			businessDetails["pid"] = pid;
		} else if (accountType === "business") {
			businessDetails["business"] = this.business.getbusinessFormDetails();
		}
		return businessDetails;
	}

	_getResponsibleData(pid, data) {
		let primaryData = {};
		if (pid !== 1) {
			primaryData = this.consumerData.responsibledetails.filter((item) => item.pid === 1)[0];
		}
		const consumerDetails = data["form"].getConsumerFormDetails("next", primaryData);
		this.consumerData = this.responsibleDetailsSvc.updateConsumerData(
			pid,
			consumerDetails,
			this.consumerData
		);
	}
}
