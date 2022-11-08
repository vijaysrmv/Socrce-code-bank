/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		business deposit
File Name              :		upload-documents.component.ts
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		11/10/2019
Description            :		Upload document page in business deposit
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormArray } from "@angular/forms";
import { Router } from "@angular/router";

import { UploadDocumentService } from "./upload-documents.service";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { UtilityService } from "../../../core/utility/utility.service/utility.service";

import { ApplicationDetails, DocResponse, Document } from "../../../core/models/application.model";
import { BACKEND_STATE, APPLICANT_TYPE } from "../../../core/models/enums";
import { DataService } from "../../../core/services/data.service";
import { NotificationService } from "./../../../core/services/notification.service";

@Component({
	selector: "app-upload-documents",
	templateUrl: "./upload-documents.component.html",
	styleUrls: ["./upload-documents.component.scss"],
	providers: [UploadDocumentService],
})
export class UploadDocumentsComponent implements OnInit {
	uploadDocumentForm: FormGroup;
	// uploadDocumentArray: Array<number> = [0];
	// numberOfDocument = 1;
	// selectedImages: Array<any> = [];
	// deleteDocIds = [];
	uploadDocumentArray = [
		"Article Of Incorporation",
		"Resolution Document",
		"Beneficiary OwnerShip Form",
		"Fictitious Buisness Name Statemenr",
		"Certificate Of Qualification",
		"Bylaws",
	];
	documentType: any;
	documents: Array<any>;
	imgerror = false;
	validationError = false;
	showBack = false;

	constructor(
		private router: Router,
		private pageLoaderSvc: PageLoaderService,
		private util: UtilityService,
		private uploadDocSvc: UploadDocumentService,
		private dataService: DataService,
		private notificationSvc: NotificationService
	) {}

	ngOnInit() {
		this.pageLoaderSvc.hide();
		this.dataService.changeStepper({
			name: "/business-deposit/upload-documents",
			index: 3,
			personalStepper: "businessDeposit",
		});
		this.createForm();
		//this._getDocumentTypes();
		// this.getConsumerData();
	}

	createForm() {
		this.uploadDocumentForm = new FormGroup({
			documents: new FormArray([]),
		});
	}

	// getConsumerData() {
	// 	this.uploadDocSvc.getConsumerData().subscribe((data) => {
	// 		this.documents = data.responsibledetails[0].documents;
	// 	});
	// }

	private _getDocumentTypes() {
		let docs = [];
		this.uploadDocSvc.getBusinessdocTypeList().subscribe((data) => {
			this.documentType = data;
			this.uploadDocSvc.getConsumerData().subscribe((consumer: ApplicationDetails) => {
				this.documents = consumer.responsibledetails[0].documents;
				if (this.documentType && this.documentType.length > 0) {
					this.documentType.forEach((obj) => {
						// if (obj.mandatory) {
						this.addDocument(obj.documentname);
						// }
					});
				}
				if (this.documents) {
					docs = this.documents.filter((item) => item.docpurpose === "MANDATORY_DOCS");
				}
				if (docs.length > 0) {
					this._setDocuments();
				} else {
					this.pageLoaderSvc.hide();
				}
			});
		});
	}

	addDocument(docType) {
		this.createDocumentsForm(docType);
		// ++this.numberOfDocument;
	}

	private _setDocuments() {
		this.pageLoaderSvc.show(true, false);
		const formArray = this.uploadDocumentForm.get("documents") as FormArray;
		this.uploadDocSvc.fetchDocs(APPLICANT_TYPE["businessApplicant"], 1).subscribe((data: DocResponse) => {
			for (let i = 0; i < formArray.length; i++) {
				this._setImage(i, formArray, data.applicationdocuments);
			}
			this.pageLoaderSvc.hide();
		});
	}

	_setImage(index, formArray, ImageDocs) {
		const image = ImageDocs.filter((document: Document) => {
			return formArray.controls[index].get("doctype").value === document.doctype;
		});
		if (image.length > 0) {
			if (image[0].fileextension === "PDF") {
				formArray.controls[index]["controls"].isPdf.setValue(true);
				formArray.controls[index]["controls"].image.setValue("data:image/pdf;base64," + image[0].data);
			} else {
				formArray.controls[index]["controls"].image.setValue("data:image/jpeg;base64," + image[0].data);
			}
		}
	}

	createDocumentsForm(docType) {
		const formArray = this.uploadDocumentForm.get("documents") as FormArray;
		const formGroup = new FormGroup({
			image: new FormControl(""),
			doctype: new FormControl(docType),
			isPdf: new FormControl(false),
		});
		formArray.push(formGroup);
	}

	onUploadImage(event, index) {
		const target = event.target;
		const targetValue = target.value;
		const img = target.files[0];
		if (targetValue === "") {
			this.removeImage(index);
			return;
		} else if (img) {
			if (
				!(img.type.includes("jpeg") || img.type.includes("png") || img.type.includes("pdf")) ||
				img.size > 5 * 1024 * 1024
			) {
				this.imgerror = true;
				return;
			}
			this.imgerror = false;
			this.util.readUploadedFileAsUrl(img).subscribe((dataUrl) => {
				if (img.type.includes("pdf")) {
					this.uploadDocumentForm.controls.documents["controls"][index]["controls"].isPdf.setValue(true);
				} else {
					this.uploadDocumentForm.controls.documents["controls"][index]["controls"].isPdf.setValue(false);
				}
				this.uploadDocumentForm.controls.documents["controls"][index]["controls"].image.setValue(dataUrl);
				// if (this.validationError) {
				// 	// this._validate(this.uploadDocumentForm.getRawValue());
				// } else {
				this.notificationSvc.displayToast(
					"success",
					"Document uploaded",
					"Document uploaded successfully.",
					5000
				);
				// }
				// if (this.validationError) {
				// 	this._validate(this.uploadDocumentForm.getRawValue());
				// }
			});
		}
	}

	removeImage(index) {
		const formArray = this.uploadDocumentForm.get("documents") as FormArray;
		formArray.controls[index]["controls"].image.setValue("");
	}

	_validate(documentsDetails) {
		this.validationError = false;
		documentsDetails.documents.forEach((obj) => {
			if (obj.image === "") {
				this.validationError = true;
			}
		});
		return this.validationError;
	}

	private checkForDeletedDocs() {
		const deleteDocIds = [];
		if (this.documents) {
			this.documents.forEach((obj) => {
				if (obj.docid && obj.docpurpose === "MANDATORY_DOCS") {
					deleteDocIds.push(obj.docid);
				}
			});
		}
		if (deleteDocIds.length > 0) {
			this.uploadDocSvc.deleteConsumerDoc(deleteDocIds).subscribe();
		}
		return;
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		const documentsDetails = this.uploadDocumentForm.getRawValue();
		this.checkForDeletedDocs();
		this.uploadDocSvc.saveDocs(documentsDetails).subscribe(() => {
			this.uploadDocSvc.processBack().subscribe((result) => {
				if (result === "success") {
					this.router.navigate(["/business-deposit/due-diligence-questionnaire"]);
				}
			});
		});
	}

	saveAndExit() {
		this.pageLoaderSvc.show(true, false);
		const documentsDetails = this.uploadDocumentForm.getRawValue();
		this.checkForDeletedDocs();
		this.uploadDocSvc.saveDocs(documentsDetails).subscribe(() => {
			this.uploadDocSvc.processSaveAndExit().subscribe((result) => {
				if (result === "success") {
					this.router.navigate(["/business-deposit/" + BACKEND_STATE["saveAndExit"]]);
				}
				this.pageLoaderSvc.hide();
			});
		});
	}

	nextStep() {
		this.pageLoaderSvc.show(true, false);
		setTimeout(function () {
			this.pageLoaderSvc.hide();
			this.router.navigate(["/business-deposit/finish/success"]);
		}, 2000);

		// const documentsDetails = this.uploadDocumentForm.getRawValue();
		// // this._validate(documentsDetails);
		// // if (!this.validationError) {
		// this.checkForDeletedDocs();
		// this.uploadDocSvc.saveDocs(documentsDetails).subscribe(() => {
		// 	this.uploadDocSvc.continueDetails().subscribe((data) => {
		// 		if (data.statusCode === 200) {
		// 			this.uploadDocSvc.getNextState().subscribe((response) => {
		// 				// if (response.nextuistate === 'docusign') {
		// 				// 	this.redirectToDocuSign();
		// 				// } else {
		// 				this.router.navigate(["/business-deposit/" + BACKEND_STATE[response.nextuistate]]);
		// 				// }
		// 			});
		// 		}
		// 	});
		// });
		// } else {
		// 	this.pageLoaderSvc.hide();
		// }
	}

	// redirectToDocuSign() {
	// 	this.uploadDocSvc.getDocusignUrl().subscribe(data => {
	// 		if (data.viewurl && data.viewurl !== '') {
	// 			window.location.href = data.viewurl;
	// 		} else if (data.message && data.message !== '') {
	// 			this.router.navigate(['/business-deposit/' + BACKEND_STATE[data.message]]);
	// 		}
	// 	});
	// }

	skipStep() {
		this.pageLoaderSvc.show(true, false);
		const documentsDetails = this.uploadDocumentForm.getRawValue();
		// this._validate(documentsDetails);
		// if (!this.validationError) {
		// this.checkForDeletedDocs();
		this.uploadDocSvc.saveDocs(documentsDetails).subscribe(() => {
			this.uploadDocSvc.skipDetails().subscribe((data) => {
				if (data.statusCode === 200) {
					this.uploadDocSvc.getNextState().subscribe((response) => {
						// if (response.nextuistate === 'docusign') {
						// 	this.redirectToDocuSign();
						// } else {
						this.router.navigate(["/business-deposit/" + BACKEND_STATE[response.nextuistate]]);
						// }
					});
				}
			});
		});
	}
}
