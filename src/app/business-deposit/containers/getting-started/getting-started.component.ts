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

import { Component, OnInit, TemplateRef } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";

import { GettingStartedService } from "./getting-started.service";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { slideDownUpAnimation } from "../../../shared/animations/slide.animation";
import { SharedMdmService } from "../../../shared/services/shared-mdm.service";

import { ApplicationDetails } from "../../../core/models/application.model";
import { OwnershipStructure, HighRiskBusiness } from "../../../core/models/fields-value.model";
import { CustomValidation } from "../../../core/utility/custom-validations";
import { ApplicationError } from "../../../core/error-handler/error-handler.service";

@Component({
	selector: "business-getting-started",
	animations: [slideDownUpAnimation],
	templateUrl: "./getting-started.component.html",
	styleUrls: ["./getting-started.component.scss"],
	providers: [GettingStartedService],
})
export class GettingStartedComponent implements OnInit {
	modalRef: BsModalRef;

	// becomeMember = false;
	ownershipStructure: Array<OwnershipStructure>;
	highRiskBusiness: Array<HighRiskBusiness>;

	questionState = 1;
	eligibilityFail = false;

	initialForm: FormGroup;
	contactForm: FormGroup;
	// consumerData: ApplicationDetails;
	validationError: boolean;

	zipcodeMask = CustomValidation.zipcodeMask;
	zipCodePattern = CustomValidation.getPattern("numberPattern");

	phoneMask = CustomValidation.phoneMask;
	phonePattern = CustomValidation.getPattern("phoneNumberPattern");

	openCategories = false;

	constructor(
		private gettingStartedSvc: GettingStartedService,
		private modalService: BsModalService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private sharedMdm: SharedMdmService,
		private businessService: GettingStartedService
	) {}

	ngOnInit() {
		sessionStorage.clear();

		this.createForm();
		this.getOwnershipData();

		const arn = sessionStorage.getItem("arn");
		if (arn) {
			this.getData();
		} else {
			this.initializeForm();
		}
	}

	createForm() {
		this.initialForm = new FormGroup({
			ownershipstructure: new FormControl("", [Validators.required]),
			restrictedcategories: new FormControl(null, [Validators.required]),
			zipcode: new FormControl("", [Validators.required]),
		});

		this.contactForm = new FormGroup({
			businessname: new FormControl(null, {
				validators: CustomValidation.businessname,
				updateOn: "blur",
			}),
			firstname: new FormControl(null, {
				validators: CustomValidation.firstname,
				updateOn: "blur",
			}),
			lastname: new FormControl(null, {
				validators: CustomValidation.lastname,
				updateOn: "blur",
			}),
			email: new FormControl(null, {
				validators: CustomValidation.email,
				updateOn: "blur",
			}),
			phone: new FormControl(null, {
				validators: CustomValidation.primaryphonenumber,
				updateOn: "blur",
			}),
		});
	}

	getOwnershipData() {
		if (this.sharedMdm.ownershipStructure && this.sharedMdm.ownershipStructure.length > 0) {
			this.ownershipStructure = this.sharedMdm.ownershipStructure;
		} else {
			this.sharedMdm.getOwnershipStructure().subscribe((data: Array<OwnershipStructure>) => {
				this.ownershipStructure = data;
			});
		}

		if (this.sharedMdm.highRiskBusiness && this.sharedMdm.highRiskBusiness.length > 0) {
			this.highRiskBusiness = this.sharedMdm.highRiskBusiness;
		} else {
			this.sharedMdm.getHighRiskBusiness().subscribe((data: Array<HighRiskBusiness>) => {
				this.highRiskBusiness = data;
			});
		}
		this.pageLoaderSvc.hide();
	}

	getData() {
		this.gettingStartedSvc.getConsumerData().subscribe((data: ApplicationDetails) => {
			// this.consumerData = data;
			if (data.businessQualifications && !sessionStorage.getItem("eligibilityQuestions")) {
				sessionStorage.setItem("eligibilityQuestions", JSON.stringify(data.businessQualifications));
			}
			this.initializeForm();
		});
	}

	initializeForm() {
		const questions = sessionStorage.getItem("eligibilityQuestions");
		if (questions) {
			this.setAnswers(JSON.parse(questions));
		}
	}

	setAnswers(questions): void {
		if (!questions) {
			return;
		}
		Object.keys(this.initialForm.controls).forEach((field) => {
			this.initialForm.patchValue(questions);
			this.onChangeofQuestion(field);
		});
	}

	onChangeofQuestion(questionName: string) {
		// this.becomeMember = false;
		const val = this.initialForm["controls"][questionName].value;
		switch (questionName) {
			case "ownershipstructure":
				const stuctureType = this.getOwnershipStructureText(val);
				this.initialForm.patchValue({ restrictedcategories: null });
				if (stuctureType === "" || stuctureType === "Others") {
					if (stuctureType === "Others") {
						this.eligibilityFail = true;
						this.questionState = 1;
					} else {
						this.eligibilityFail = false;
						this.questionState = 1;
					}
				} else {
					this.questionState = 2;
					this.eligibilityFail = false;
				}
				break;
			case "restrictedcategories":
				if (val === null || val === true) {
					if (val === true) {
						this.eligibilityFail = true;
						this.questionState = 2;
						this.contactForm.reset();
					} else {
						this.eligibilityFail = false;
						this.questionState = 2;
					}
				} else {
					this.questionState = 3;
					this.eligibilityFail = false;
				}
				break;
		}
	}

	getOwnershipStructureText(val) {
		let value;
		if (this.ownershipStructure) {
			value = this.ownershipStructure.find((obj) => {
				return +obj["ownership_id"] === +val;
			});
		}
		if (value) {
			return value["ownership"];
		}
		return "";
	}

	trim(formName: string, fieldName: string) {
		if (formName === "contactForm") {
			const patchObj = {};
			const trimValue = this.contactForm["controls"][fieldName].value
				? this.contactForm["controls"][fieldName].value.trim()
				: null;
			patchObj[fieldName] = trimValue;
			this.contactForm.patchValue(patchObj);
		}
	}

	checkValidations() {
		this.validationError = false;
		if (this.eligibilityFail) {
			this.displayValidations(this.contactForm);
		} else {
			this.displayValidations(this.initialForm);
		}
		return this.validationError;
	}

	displayValidations(group: any) {
		Object.keys(group.controls).forEach((field) => {
			if (group.controls[field]["controls"]) {
				this.displayValidations(group.controls[field]);
			} else {
				const control = group.get(field);
				control.markAsTouched(true);
				if (control.errors !== null && this.validationError === false) {
					this.validationError = true;
					control["nativeElement"].focus();
				}
			}
		});
	}

	// goToPersonalDeposit() {
	// 	this.pageLoaderSvc.show(true, false);
	// 	this.router.navigate(['/consumer-deposit/getting-started']);
	// }

	nextStep() {
		this.pageLoaderSvc.show(true, false);
		if (this.checkValidations()) {
			this.pageLoaderSvc.hide();
			return;
		}
		sessionStorage.setItem(
			"businessType",
			this.getOwnershipStructureText(this.initialForm.getRawValue().ownershipstructure)
		);
		sessionStorage.setItem("eligibilityQuestions", JSON.stringify(this.initialForm.getRawValue()));
		const zipcode = this.initialForm["controls"].zipcode.value;
		sessionStorage.setItem("zipcode", JSON.stringify(zipcode));
		this.router.navigate(["/business-deposit/select-product"]);
		// this.businessService.getZipData(zipcode).subscribe((response) => {
		// 	if (response && response['zipcode']) {
		// 		sessionStorage.setItem('zipcode', JSON.stringify(response['zipcode']));
		// 		this.router.navigate(['/business-deposit/select-product']);
		// 	}
		// }, (error) => {
		// 	sessionStorage.removeItem('zipcode');
		// 	if (error && error.code) {
		// 		switch (error.code) {
		// 			case 2174:
		// 				this.initialForm['controls'].zipcode.setErrors({ 'incorrect': true});
		// 				this.pageLoaderSvc.hide();
		// 				break;
		// 			case 2173:
		// 			case 2175:
		// 				this.initialForm['controls'].zipcode.setErrors({ 'incorrect': true});
		// 				this.router.navigate(['/business-deposit/finish/unserved-state']);
		// 				break;
		// 			default:
		// 				this.initialForm['controls'].zipcode.setErrors({ 'incorrect': true});
		// 				throw new ApplicationError('1000');
		// 		}
		// 	} else {
		// 		throw new ApplicationError('1000');
		// 	}
		// });
	}

	openModal(template: TemplateRef<any>) {
		// this.modalRef = this.modalService.show(template, { ignoreBackdropClick: true, keyboard: false });
		this.openCategories = true;
	}

	// disableControls(formName: FormGroup) {
	// 	Object.keys(formName.controls).forEach(control => {
	// 		formName['controls'][control].disable();
	// 	});
	// }

	// enableControls(formName: FormGroup) {
	// 	Object.keys(formName.controls).forEach(control => {
	// 		formName['controls'][control].enable();
	// 	});
	// }

	submitContactForm() {
		this.pageLoaderSvc.show(true, false);
		if (!this.checkValidations()) {
			sessionStorage.setItem("username", this.contactForm["controls"].firstname.value);
			this.gettingStartedSvc.submitContactForm(this.contactForm.getRawValue()).subscribe((data) => {
				if (data.message === "success") {
					this.router.navigate(["/business-deposit/finish/unserved-state"]);
					this.pageLoaderSvc.hide();
				} else {
					this.pageLoaderSvc.hide();
				}
			});
		} else {
			this.pageLoaderSvc.hide();
		}
	}

	disclosureClick(e) {
		e.preventDefault();
		window.open(
			"./../../../ccf-oao-assets/data/pdf/OnlineAccessAgreementAndDisclosureStatement.pdf",
			"_blank",
			"toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600"
		);
	}

	onLoginClick() {
		this.router.navigate(["login"]);
	}
}
