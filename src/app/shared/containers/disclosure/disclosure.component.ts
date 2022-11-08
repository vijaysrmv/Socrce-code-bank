/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Shared
File Name              :        disclosure.component.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        01/11/2019
Description            :        Component for services and disclosures
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { DisclosureService } from "./disclosure.service";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { ApplicationError } from "../../../core/error-handler/error-handler.service";
import { DataService } from "../../../core/services/data.service";
import { slideUpDownAnimation, slideProductPopupAnimation } from "../../../shared/animations/slide.animation";

import { Disclosure } from "../../../core/models/disclosure.model";
import { BACKEND_STATE, BACKEND_ACCOUNT } from "../../../core/models/enums";
import { Services } from "../../../core/models/product.model";

@Component({
	selector: "app-disclosure",
	animations: [slideUpDownAnimation, slideProductPopupAnimation],
	templateUrl: "./disclosure.component.html",
	styleUrls: ["./disclosure.component.scss"],
	providers: [DisclosureService],
})
export class DisclosureComponent implements OnInit {
	@ViewChild("disclosureList", { static: false }) disclosureList: ElementRef;

	selectedProductList = [];
	showApplicantOption = false;
	selectUser = false;
	chooseOption = false;
	chooseODOption = false;
	subTerms = false;
	showBack = false;
	IsSingleApplicant = false;

	servicesOffered: any;
	accountType: string;

	acceptESign = false;
	eSignDisclosure: Disclosure;
	disclosures: Array<Disclosure> = [];
	// disabledDisclosures: Array<Disclosure> = [];
	disabledDisclosuresText: string;
	disableDownloadAllLink = false;
	checkCount = 0;
	serviceCount = 0;
	isSoleProprietorship = false;
	cardApplicant: string;
	isUSPerson: boolean = null;
	isFinancialInstWithGIIN = false;
	isFinancialInstWithoutGIIN = false;
	isActiveNFFE = false;
	isPassiveNFFE = false;

	constructor(
		private _disclosureService: DisclosureService,
		private location: Location,
		private router: Router,
		private dataService: DataService,
		private pageLoaderSvc: PageLoaderService
	) {}

	ngOnInit() {
		// if (this.accountType === 'consumerDeposit') {
		// 	this.dataService.changeStepper({ name: '/consumer-deposit/disclosure', index: 3, personalStepper: 'consumerDeposit' });
		// } else if (this.accountType === 'businessDeposit') {
		// 	this.dataService.changeStepper({ name: '/business-deposit/disclosure', index: 5, personalStepper: 'businessDeposit' });
		// }
		this.dataService.changeStepper({
			name: `/${BACKEND_ACCOUNT[this.accountType]}/disclosure`,
			index: 3,
			personalStepper: this.accountType,
		});
		this.dataService.currentStateCheck.subscribe((resp) => {
			this.accountType = resp.accountType;
		});
		if (this.accountType === "businessDeposit") {
			this.showBack = true;
		}
		this.getServices();
		this.getDisclosures();
	}

	getServices() {
		this.pageLoaderSvc.show(true, false);
		this._disclosureService.getConsumerData().subscribe((consumerDetails) => {
			this._isSoleProprietor(consumerDetails);
			if (
				consumerDetails.responsibledetails &&
				consumerDetails.responsibledetails[0]["documents"] &&
				consumerDetails.responsibledetails[0]["documents"].length > 0
			) {
				const docs = consumerDetails.responsibledetails[0]["documents"].filter(
					(item) => item.docpurpose === "OTHER"
				);
				if (docs.length > 0) {
					this.showBack = true;
				}
			}
			this._disclosureService.getServicesOffered().subscribe((servicesOffered: any) => {
				this.servicesOffered = servicesOffered;
				if (Object.keys(servicesOffered).length > 0) {
					// this._disclosureService.getConsumerData().subscribe(consumerDetails => {
					const consumerSelectedServices = consumerDetails.productservices;
					this.servicesOffered = {
						...servicesOffered,
						...consumerSelectedServices,
					};
					if (this.servicesOffered.debitcard.selected) {
						this.servicesOffered.debitcard.cardapplicant = this._cardApplicant(servicesOffered.debitcard);
					}
					if (
						this.servicesOffered.debitcard &&
						this.servicesOffered.debitcard.applicantlist &&
						this.servicesOffered.debitcard.applicantlist.length === 1 &&
						this.servicesOffered.debitcard.applicantlist[0]["pid"] === 1
					) {
						this.IsSingleApplicant = true;
					}
					/** Commented all applications debit card auto-selection */
					// if (this.servicesOffered.hasOwnProperty('debitcard')) {
					// 	this.servicesOffered.debitcard.selected = true;
					// }

					/** Commented consumer application debit card auto-selection */
					// if (this.accountType === 'consumerDeposit' && this.servicesOffered.hasOwnProperty('debitcard')) {
					// 	this.servicesOffered.debitcard.applicantlist.forEach(applicant => {
					// 		if (applicant.applicanttype && applicant.applicanttype === 'primary' && applicant.pid && applicant.pid === 1) {
					// 			this.servicesOffered.debitcard.selected = true;
					// 			applicant.selected = true;
					// 		}
					// 	});
					// }
					this.pageLoaderSvc.hide();
					// });
					if (!this.servicesOffered.hasOwnProperty("checkordering")) {
						this.serviceCount = Object.keys(servicesOffered).length;
					}
				} else {
					this.pageLoaderSvc.hide();
				}
			});
		});
	}

	getDisclosures() {
		this._disclosureService.getDisclosures().subscribe((data: Array<Disclosure>) => {
			if (data) {
				const eSign = data.filter((disclosure) => disclosure.disclosurestype.toUpperCase() === "ES");
				if (eSign && eSign.length) {
					this.eSignDisclosure = eSign[0];
					this.eSignDisclosure.url =
						"./../../../../ccf-oao-assets/data/pdf/OnlineAccessAgreementAndDisclosureStatement.pdf";
				}
				this.disclosures = data.filter(
					(disclosure) => disclosure.disclosurestype.toUpperCase() !== "ES" && disclosure.status
				);
				const disabledDisclosures = data.filter(
					(disclosure) =>
						disclosure.disclosurestype.toUpperCase() !== "ES" &&
						disclosure.disclosurestype.toUpperCase() !== "TC" &&
						!disclosure.status
				);
				if (disabledDisclosures && disabledDisclosures.length) {
					this.disabledDisclosuresText = "";
					for (let i = 0; i < disabledDisclosures.length; i++) {
						if (i <= disabledDisclosures.length - 1) {
							if (i <= disabledDisclosures.length - 3) {
								this.disabledDisclosuresText =
									this.disabledDisclosuresText + disabledDisclosures[i].disclosuresdescription + ", ";
							} else if (i <= disabledDisclosures.length - 2) {
								this.disabledDisclosuresText =
									this.disabledDisclosuresText + disabledDisclosures[i].disclosuresdescription + " and ";
							} else {
								this.disabledDisclosuresText =
									this.disabledDisclosuresText + disabledDisclosures[i].disclosuresdescription;
							}
						}
					}
				}
				this.disclosures.forEach((item) => {
					if (item.disclosurestype === "SF")
						item.url = "./../../../../ccf-oao-assets/data/pdf/ViewRatesDocument.pdf";
					if (item.disclosurestype === "PP" || item.disclosurestype === "TC")
						item.url =
							"./../../../../ccf-oao-assets/data/pdf/OnlineAccessAgreementAndDisclosureStatement.pdf";
				});
			}
		});
	}

	subDiclosureChange(event) {
		if (event.target.checked) {
			this.checkCount++;
		} else {
			this.checkCount--;
		}
	}

	disclosureChange(event) {
		const checkboxes = this.disclosureList.nativeElement.querySelectorAll("input[type=checkbox]");
		for (let i = 0; i < checkboxes.length; i++) {
			checkboxes[i].checked = event.target.checked;
		}
		if (event.target.checked) {
			this.checkCount = checkboxes.length;
		} else {
			this.checkCount = 0;
		}
	}

	closePopUp(id: string, service: Services) {
		switch (id) {
			case "debitCard":
				this.showApplicantOption = false;
				this.chooseOption = false;
				if (!this.IsSingleApplicant) {
					this.selectUser = true;
				}
				if (service) {
					service.deliverymethod = "";
					this.resetCardApplicant(service);
				}
				break;
			case "overDraft":
				this.chooseODOption = false;
				if (service.selected) {
					service.selected = false;
					service.overdraft = undefined;
				}
				break;
		}
	}

	toggleProduct(id: string): void {
		if (this.selectedProductList.includes(id)) {
			this.selectedProductList.splice(this.selectedProductList.indexOf(id), 1);
		} else {
			this.selectedProductList.push(id);
		}
	}

	resetCardApplicant(service: Services) {
		service.applicantlist.forEach((applicant) => {
			applicant.selected = false;
		});
	}

	toggleService(id: string, service: Services) {
		switch (id) {
			case "debitCard":
				if (service.selected) {
					service.selected = false;
					service.deliverymethod = "";
					this.resetCardApplicant(service);
				} else {
					this.showApplicantOption = true;
					if (this.IsSingleApplicant) {
						service.applicantlist[0]["selected"] = true;
						this.chooseOption = true;
					} else {
						this.selectUser = true;
					}
					// if (this.accountType === 'consumerDeposit') {
					// 	service.applicantlist.forEach(applicant => {
					// 		if (applicant.applicanttype && applicant.applicanttype === 'primary' && applicant.pid && applicant.pid === 1) {
					// 			service.selected = true;
					// 			applicant.selected = true;
					// 		}
					// 	});
					// } else if (this.accountType === 'businessDeposit') {
					// 	this.showApplicantOption = true;
					// 	this.selectUser = true;
					// }
				}
				break;
			// case 'courtesyPayOption':
			// 	if (service.selected) {
			// 		service.overdraft = null;
			// 	} else {
			// 		this.chooseOption = true;
			// 	}
			// 	service.selected = !service.selected;
			// 	break;
			case "overDraft":
				if (service.selected) {
					service.overdraft = undefined;
				} else {
					this.chooseODOption = true;
				}
				service.selected = !service.selected;
				break;
		}
	}

	selectCard(id: string, service: Services) {
		// this.toggleProduct(id);
		if (id === "debitCard") {
			if (service.selected) {
				// service.cardapplicant = null;
				service.selected = false;
				// this.servicesOffered.debitcard.selected = false;
			} else {
				this.showApplicantOption = true;
				this.selectUser = true;
			}
		}

		if (id === "overDraft") {
			if (service.selected) {
				service.overdraft = undefined;
			} else {
				this.chooseODOption = true;
			}
			service.selected = !service.selected;
		}
		// if (id === 'courtesyPayOption') {
		// 	if (service.selected) {
		// 		service.overdraft = null;
		// 	} else {
		// 		this.chooseOption = true;
		// 	}
		// 	service.selected = !service.selected;
		// }
	}

	_cardApplicant(service) {
		let count = 0;
		let isPrimary = false;
		for (let i = 0; i < service.applicantlist.length; i++) {
			if (service.applicantlist[i].selected) {
				if (service.applicantlist[i].pid === 1) {
					isPrimary = true;
				}
				count++;
			}
		}
		if (count === 1 && isPrimary) {
			return "Primary Applicant";
		} else if (count === 1 && !isPrimary) {
			return "Single Applicant";
		} else if (count > 1) {
			return `${count} Applicants`;
		}
	}

	// selectATMService() {
	// 	this.servicesOffered.debitcard.selected = true;
	// 	this.showApplicantOption = false;
	// 	this.selectUser = false;
	// }

	checkDebitDisability() {
		let disability = true;
		if (
			this.servicesOffered &&
			this.servicesOffered.debitcard &&
			this.servicesOffered.debitcard.applicantlist &&
			this.servicesOffered.debitcard.applicantlist.length
		) {
			for (let i = 0; i < this.servicesOffered.debitcard.applicantlist.length; i++) {
				if (this.servicesOffered.debitcard.applicantlist[i].selected) {
					disability = false;
				}
			}
		}
		return disability;
	}

	selectChoseWay(id: string, service: Services) {
		switch (id) {
			case "debitCard":
				this.chooseOption = false;
				this.showApplicantOption = false;
				service.selected = true;
				service.cardapplicant = this._cardApplicant(service);
				break;
			case "overDraft":
				this.chooseODOption = false;
				service.overdraft = true;
				service.selected = true;
				break;
		}
	}

	showDeliveryPopup() {
		this.selectUser = false;
		this.chooseOption = true;
	}

	nextStep() {
		if (this.validateBeforeContinue()) {
			this.pageLoaderSvc.show(true, false);

			this._disclosureService.processNextStepNavigation(this.servicesOffered).subscribe((data) => {
				if (data === "success") {
					this._disclosureService.getUIState().subscribe((response) => {
						if (response.nextuistate === "docusign") {
							this.redirectToDocuSign();
						} else {
							const account = BACKEND_ACCOUNT[this.accountType];
							this.router.navigate(["/" + account + "/" + BACKEND_STATE[response.nextuistate]]);
						}
					});
				}
			});
		}
	}

	saveData() {
		this.pageLoaderSvc.show(true, false);
		this._disclosureService.processSaveAndExit(this.servicesOffered).subscribe((data: any) => {
			if (data === "success") {
				const account = BACKEND_ACCOUNT[this.accountType];
				this.router.navigate(["/" + account + "/" + BACKEND_STATE["saveAndExit"]]);
			}
		});
	}

	prevStep() {
		this.pageLoaderSvc.show(true, false);
		this._disclosureService.processBack(this.servicesOffered).subscribe((data: any) => {
			if (data === "success") {
				const account = BACKEND_ACCOUNT[this.accountType];
				let page = BACKEND_STATE["consumerDueDiligence"];
				if (this.accountType === "businessDeposit" && !this.isSoleProprietorship) {
					page = BACKEND_STATE["documentUpload"];
				}
				this.router.navigate(["/" + account + "/" + page]);
			}
		});
	}

	redirectToDocuSign() {
		this._disclosureService.getDocusignUrl().subscribe((data) => {
			if (data.viewurl && data.viewurl !== "") {
				window.location.href = data.viewurl;
			} else if (data.message && data.message !== "") {
				const account = BACKEND_ACCOUNT[this.accountType];
				this.router.navigate(["/" + account + "/" + BACKEND_STATE[data.message]]);
			}
		});
	}

	redirectToAccountFunding() {
		const accountType = this.location.path().split("/")[1];
		this.router.navigate(["/" + accountType + "/account-funding"]);
	}

	disclosureClick(event, disclosure) {
		event.preventDefault();
		window.open(disclosure.url, "_blank", "scrollbars=1,resizable=1,top=40,left=200,height=600,width=700");
		// this.pageLoaderSvc.show(true, false);
		// this._disclosureService.downloadDisclosure(disclosure.parentfolderindex).subscribe(data => {
		// 	const byteCharacters = atob(data);
		// 	const byteNumbers = new Array(byteCharacters.length);
		// 	for (let i = 0; i < byteCharacters.length; i++) {
		// 		byteNumbers[i] = byteCharacters.charCodeAt(i);
		// 	}
		// 	const byteArray = new Uint8Array(byteNumbers);
		// 	const blob = new Blob([byteArray], {
		// 		type: 'application/pdf'
		// 	});
		// 	// If Browser is Edge
		// 	if (window.navigator && window.navigator.msSaveOrOpenBlob) {
		// 		window.navigator.msSaveOrOpenBlob(blob, `${disclosure.disclosuresdescription}.pdf`);
		// 		this.pageLoaderSvc.hide();
		// 		return;
		// 	}
		// 	// For other Browsers
		// 	const pdfWindow = window.open('', '_blank');
		// 	const linkObj = pdfWindow.document.createElement('a');
		// 	const url = linkObj.href = window.URL.createObjectURL(blob);
		// 	linkObj.click();
		// 	// linkObj.download = disclosure.disclosuresdescription;
		// 	this.pageLoaderSvc.hide();
		// 	setTimeout(() => {
		// 		window.URL.revokeObjectURL(url);
		// 	}, 6000);
		// const fileName = `${disclosure.disclosuresdescription}.pdf`;
		// const pdfWindow = window.open('', fileName);
		// pdfWindow.document.write('<html><head><title>' + fileName + '</title><style>body{margin: 0px;}iframe{border-width: 0px;}</style></head>');
		// pdfWindow.document.write('<body><iframe width='100%' height='100%' src='data:application/pdf;base64, ' + encodeURI(data) + ''></iframe></body></html>');
		// }, error => {
		// 	throw new ApplicationError('1000');
		// });
		// const link = `http://192.168.93.94:8080/api/application/disclosures/${disclosure.parentfolderindex}`;
		// window.open(link, '_blank', 'scrollbars=1,resizable=1,top=40,left=200,height=600,width=700');
	}

	downloadDisclosures(event) {
		event.preventDefault();
		if (!this.disableDownloadAllLink) {
			this.disableDownloadAllLink = true;
			this.pageLoaderSvc.show(true, false);
			this._disclosureService.downloadAllDisclosures().subscribe(
				(data) => {
					// const downloadLink = document.createElement('a');
					// downloadLink.href = 'data:text/plain;base64,' + data;
					// downloadLink.download = 'disclosures.zip';
					// document.body.appendChild(downloadLink);
					// downloadLink.click();
					const contentType = "text/plain";
					const zipdata = "data:text/plain;base64," + data;
					const file = "disclosures.zip";
					const blob = this._base64toBlob(data, contentType);
					const anchor = document.createElement("a");
					if (window.navigator && window.navigator.msSaveBlob) {
						// IE
						window.navigator.msSaveOrOpenBlob(blob, file);
					} else if (navigator.userAgent.toLowerCase().indexOf("safari") !== -1) {
						// Safari
						document.body.appendChild(anchor);
						anchor.href = encodeURI(zipdata);
						anchor.download = file;
						anchor.click();
						document.body.removeChild(anchor);
					} else if (navigator.userAgent.search("Firefox") !== -1) {
						// Firefox
						anchor.setAttribute("download", file);
						anchor.setAttribute("href", URL.createObjectURL(blob));
						anchor.setAttribute("target", "_blank");
						document.body.appendChild(anchor);
						anchor.click();
						document.body.removeChild(anchor);
					} else {
						// Chrome
						anchor.setAttribute("download", file);
						anchor.setAttribute("href", URL.createObjectURL(blob));
						anchor.setAttribute("target", "_blank");
						anchor.click();
						anchor.remove();
					}
					this.disableDownloadAllLink = false;
					this.pageLoaderSvc.hide();
				},
				(error) => {
					this.disableDownloadAllLink = false;
					throw new ApplicationError("1000");
				}
			);
		}
	}

	_base64toBlob(base64Data, contentType) {
		contentType = contentType || "";
		const sliceSize = 1024;
		const byteCharacters = atob(base64Data);
		const bytesLength = byteCharacters.length;
		const slicesCount = Math.ceil(bytesLength / sliceSize);
		const byteArrays = new Array(slicesCount);

		for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
			const begin = sliceIndex * sliceSize;
			const end = Math.min(begin + sliceSize, bytesLength);

			const bytes = new Array(end - begin);
			for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
				bytes[i] = byteCharacters[offset].charCodeAt(0);
			}
			byteArrays[sliceIndex] = new Uint8Array(bytes);
		}
		return new Blob(byteArrays, { type: contentType });
	}

	validateBeforeContinue() {
		if (this.disclosures.length === 0 || this.checkCount !== this.disclosures.length) {
			throw new ApplicationError("1005");
		} else if (
			this.servicesOffered.overdraft &&
			this.servicesOffered.overdraft.selected &&
			this.servicesOffered.overdraft.overdraft === undefined
		) {
			throw new ApplicationError("1010");
		}
		return true;
	}

	_isSoleProprietor(consumerData) {
		if (this.accountType === "businessDeposit" && consumerData.businessdetails) {
			if (consumerData.businessdetails.ownershipstructure === "1") {
				this.isSoleProprietorship = true;
			}
		}
	}

	eSignChange() {
		this.acceptESign = !this.acceptESign;
		this.checkCount = 0;
	}

	toggleUSPerson(uSPerson: boolean) {
		this.isUSPerson = uSPerson;
	}

	toggleFinancialInstWithGIIN() {
		this.isFinancialInstWithGIIN = !this.isFinancialInstWithGIIN;
		this.isFinancialInstWithoutGIIN = false;
	}

	toggleFinancialInstWithoutGIIN() {
		this.isFinancialInstWithoutGIIN = !this.isFinancialInstWithoutGIIN;
		this.isFinancialInstWithGIIN = false;
	}

	toggleActiveNFFE() {
		this.isActiveNFFE = !this.isActiveNFFE;
		this.isPassiveNFFE = false;
	}

	togglePassiveNFFE() {
		this.isPassiveNFFE = !this.isPassiveNFFE;
		this.isActiveNFFE = false;
	}
}
