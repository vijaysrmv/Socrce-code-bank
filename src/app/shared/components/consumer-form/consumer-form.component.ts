/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Shared
File Name              :        consumer-form.component.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        22/01/2019
Description            :        consumer form to carry user details
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import {
	Component,
	Input,
	Output,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef,
	EventEmitter,
	ChangeDetectorRef,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";

import { IMyDpOptions, IMyInputFieldChanged } from "mydatepicker";

import { AddressComponent } from "../address/address.component";
import { EmploymentComponent } from "../employment/employment.component";
import { IdScanComponent } from "../id-scan/id-scan.component";

import { MdmService } from "../../../core/apis/mdm.service";
import { UspsService } from "../../../core/apis/usps.service";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { ApplicationError } from "../../../core/error-handler/error-handler.service";
import { DataService } from "../../../core/services/data.service";
import { FormUtilityService } from "../../../core/services/form-utility.service";
import { ModalBoxService } from "../../../shared/services/modal-box.service";
import { SharedMdmService } from "../../../shared/services/shared-mdm.service";
import { UtilityService } from "../../../core/utility/utility.service/utility.service";
import { NotificationService } from "./../../../core/services/notification.service";

import { ApplicantDetails, Document } from "../../../core/models/application.model";
import { APPLICANT_TYPE } from "../../../core/models/enums";
import {
	IdType,
	Title,
	Suffix,
	EmploymentStatus,
	LearnAboutUs,
	States,
	OccupancyStatus,
	Country,
} from "../../../core/models/fields-value.model";
import { ZipDetails } from "../../../core/models/usps-response.model";
import { AppConstants } from "../../../core/utility/app.constants";
import { CustomValidation } from "../../../core/utility/custom-validations";

@Component({
	selector: "app-consumer-form",
	templateUrl: "./consumer-form.component.html",
	styleUrls: ["./consumer-form.component.scss"],
	providers: [MdmService],
})
export class ConsumerFormComponent implements OnInit, AfterViewInit {
	@ViewChild(EmploymentComponent, { static: false }) employmentDetails: EmploymentComponent;
	@ViewChild(IdScanComponent, { static: false }) idscanCmp: IdScanComponent;
	@ViewChild("dobPicker", { static: false }) dobPickerRef: ElementRef;
	@ViewChild("issueDatePicker", { static: false }) issueDatePickerRef: ElementRef;
	@ViewChild("expiryDatePicker", { static: false }) expiryDatePickerRef: ElementRef;
	@ViewChild("physicalAddress", { static: false }) physicalAddress: AddressComponent;
	@ViewChild("mailingAddress", { static: false }) mailingAddress: AddressComponent;
	@ViewChild("previousAddress", { static: false }) previousAddress: AddressComponent;
	@ViewChild("relationship", { static: false }) relationshipRef: ElementRef;

	@Input() showPhyAddressButtons = false;
	@Input() reviewPage = false;
	@Input() applicantType = APPLICANT_TYPE["consumerPrimary"];
	@Input() showRemoveButton = false;
	@Input() addressFor: string;
	@Input() pid: number;

	@Output() save = new EventEmitter();
	@Output() createApplication = new EventEmitter();
	@Output() patchConsumerData = new EventEmitter();
	@Output() checkSaveAndExitDisability = new EventEmitter();
	@Output() confirmationModal = new EventEmitter();
	@Output() removeApplicant = new EventEmitter();
	@Output() patchFromIdScan = new EventEmitter();
	@Output() showContinueAndSave = new EventEmitter();

	paramterArray: any = [];
	consumerForm: FormGroup;
	page: string;
	accountType: string;
	consumerData: any;
	formData: any;
	address: Array<any>;
	confirmPrimaryEmail: string;
	showPhysicalAddress = true;
	samePhysicalAsPrimary = true;
	// showIncomeSource = false;
	sameMailingAddress = true;
	applicantId = "primary";
	// showMailingAddress = true;
	// showPreviousAddress = false;

	title: Array<Title>;
	suffix: Array<Suffix>;
	employmentStatus: Array<EmploymentStatus>;
	learnAboutUs: Array<LearnAboutUs>;
	idTypes: Array<IdType>;
	allStates: Array<States>;
	allCountries: Array<Country>;
	nonUSCountries: Array<Country>;
	occupancyStatusList: Array<OccupancyStatus>;

	validationError: boolean;
	isUSCitizen = true;
	imgerrorpersonal = false;
	imgerrorjoint = false;
	showCalculator = false;

	dateMask = CustomValidation.dateMask;
	phoneMask = CustomValidation.phoneMask;
	ssnMask = CustomValidation.ssnMask;
	datePattern = CustomValidation.getPattern("datePattern");
	phonePattern = CustomValidation.getPattern("phoneNumberPattern");
	ssnPattern = CustomValidation.getPattern("ssnPattern");

	dobOptions: IMyDpOptions = CustomValidation.dobOptions;
	idIssueOptions: IMyDpOptions = CustomValidation.idIssueOptions;
	idExpiryOptions: IMyDpOptions = CustomValidation.idExpiryOptions;

	dobInvalid = false;
	dobError = false;
	issueDateInvalid = false;
	expiryDateInvalid = false;
	issueDateandDobValidity = false;

	editableSection = "";
	editPersonalDetails: boolean;
	editIdDetails: boolean;
	editContactInfo: boolean;
	editMailingAddress: boolean;
	editPreviousAddress: boolean;
	editEmpDetails: boolean;
	editRelationshipDetails: boolean;
	editAdditionalDetails: boolean;
	isPrimaryApplicant = false;

	savedConsumerData = {};
	isOLB: boolean;
	interval: any;
	tyfoneEditableFields: Array<string> = [];

	olbEnableMothersMaiden = false;
	olbEnableID = false;
	olbEnableIDType = false;
	olbEnablePhoneType = false;
	disableIdentification = false;
	ageRange = "adult";
	hideIssuingState = false;
	hideIssuingCountry = true;
	passportSelected: boolean;
	showLengthOfStay = false;
	disablePrefilledFields = false;
	showConfirmationModal: boolean;
	authorizerSelected = true;
	authorizedSignerError = false;
	beneficialOwnerError = false;
	significantControllerError = false;
	significantRequiredError = false;
	relationshipError = false;
	isSoleProprietorship = false;
	isStatusEmployed = true;
	isStatusSelfEmployed = true;
	isDisabledForEmploymentStatus = false;

	referredEmployeeId = AppConstants.referredEmployeeLearnAboutId;
	showReferredEmployee = false;
	isZipValid = false;
	showWork = false;
	showHome = false;
	isMinor = false;
	dobDisable = false;
	confirmEMailFocused = false;
	showForm = true;
	isDedupeClicked = false;
	titleOfApplicant = ["MR", "MRS"];
	country = [
		"UNITED ARAB EMIRATES",
		"AFGHANISTAN",
		"ALAND ISLANDS",
		"ALBANIA",
		"ALGERIA",
		"AMERICAN SAMOA",
		"ANDORRA",
		"ANGOLA",
		"ANGUILLA",
		"ANTARCTICA",
		"ANTIGUA AND BARBUDA",
		"ARGENTINA",
		"ARMENIA",
		"ARUBA",
		"AUSTRALIA",
		"AUSTRIA",
		"AZERBAIJAN",
		"BAHAMAS",
		"BAHRAIN",
		"BANGLADESH",
		"BARBADOS",
		"BELARUS",
		"BELGIUM",
		"BELIZE",
		"BENIN",
		"BERMUDA",
		"BHUTAN",
		"BOLIVIA PLURINATIONAL STATE OF",
		"BOSNIA AND HERZEGOVINA",
		"BOTSWANA",
		"BOUVET ISLAND",
		"BRAZIL",
		"BRITISH INDIAN OCEAN TERRITORY",
		"BRITISH VIRGIN ISLANDS",
		"BRUNEI DARUSSALAM",
		"BULGARIA",
		"BURKINA FASO",
		"BURUNDI",
		"CAMBODIA",
		"CAMEROON",
		"CANADA",
		"CAPE VERDE",
		"CAYMAN ISLANDS",
		"CENTRAL AFRICAN REPUBLIC",
		"CHAD",
		"CHILE",
		"CHINA",
		"CHRISTMAS ISLAND",
		"COCOS (KEELING) ISLANDS",
		"COLOMBIA",
		"COMOROS",
		"CONGO",
		"COOK ISLANDS",
		"COSTA RICA",
		"COTE D\\IVOIRE",
		"CROATIA",
		"CUBA",
		"CYPRUS",
		"CZECH REPUBLIC",
		"DEMOCRATIC PEOPLE\\S REPUBLIC OF KOREA",
		"DEMOCRATIC REPUBLIC OF THE CONGO",
		"DENMARK",
		"DJIBOUTI",
		"DOMINICA",
		"DOMINICAN REPUBLIC",
		"ECUADOR",
		"EGYPT",
		"EL SALVADOR",
		"EQUATORIAL GUINEA",
		"ERITREA",
		"ESTONIA",
		"ETHIOPIA",
		"FALKLAND ISLANDS (MALVINAS)",
		"FAROE ISLANDS",
		"FEDERATED STATES OF MICRONESIA",
		"FIJI",
		"FINLAND",
		"FRANCE",
		"FRENCH GUIANA",
		"FRENCH POLYNESIA",
		"FRENCH SOUTHERN TERRITORIES",
		"GABON",
		"GAMBIA",
		"GEORGIA",
		"GERMANY",
		"GHANA",
		"GIBRALTAR",
		"GREECE",
		"GREENLAND",
		"GRENADA",
		"GUADELOUPE",
		"GUAM",
		"GUATEMALA",
		"GUERNSEY",
		"GUINEA",
		"GUINEA-BISSAU",
		"GUYANA",
		"HAITI",
		"HEARD ISLAND AND MCDONALD ISLANDS",
	];
	residentStatus = ["Permanent", "Temporary"];
	legalEntityType = [
		"Asset management firms and fund administrators - listed on FAB Recognised Stock Exchange",
		"Asset mngmt firms and fund administrators-Listed on FAB non-Recognized Stock Exchange or Non listed",
		"Bond Issuer & Custodian",
		"Branch of Foreign Companies and Corporations",
		"Branch of Foreign Entity",
		"Brokerage funds",
		"Brokers/Dealers (i.e. Securities Dealing Companies only)",
		"Charities/Non-Profit Organizations/Non-Government Organizations / Religious organizations",
		"Development Finance Institutions/Development banks (excl. Supranational)",
		"Development finance institutions/Development banks (excl. Supranational)",
		"Finance Companies",
		"Foreign Portfolio Investors - Category I",
		"Foreign Portfolio Investors - Category II",
		"Foreign Portfolio Investors - Category III",
		"Free Zone - Offshore (Certification of Incorporation issued by Others except ADGM DIFC JAFZA DAFZA)",
		"Free Zone - Onshore (Trade Licence issued by ADGM DIFC JAFZA  DAFZA only)",
		"Free Zone - Onshore (Trade Licence issued by Others except ADGM  DIFC JAFZA  DAFZA)",
		"Hedge funds",
		"Holding Companies",
		"Holding Company",
		"Infrastructure Debt Fund",
		"Insurance brokers and agents only",
		"Insurance companies (Listed on a FAB recognized stock exchange)",
		"Insurance companies (Listed on FAB non-Recognized Stock Exchange or Non listed)",
		"Joint Venture (i.e. Incorporated)",
		"Joint Venture (i.e. Unincorporated)",
		"Leasing companies",
		"Leasing companies owned by banks",
		"Limited Liability Company (LLC)",
		"Microfinance",
		"Money Service Bureaus,Exchange Houses,Entities holding licenses,operating similar to exchange house",
		"Mutual Fund Companies",
		"Non Operative Financial Holding",
		"Non Regulated Delivery vs. payment (DVP) counterparties",
		"Offshore Company",
		"Operators of credit card systems",
		"Orphan SPVs",
		"Orphan SPVs",
		"Partnership",
		"Payment services companies  / Third Party Payment Processors",
		"Private Shareholding Company / Private Entity (Except LLC)",
		"Real Estate Investment Trusts (REITs)",
		"Regulated delivery vs. payment (DVP) counterparties",
		"Representative Office",
		"Sole Proprietorship",
		"Sole Proprietorship LLC",
		"Sovereign Wealth Fund",
		"Sovereign Wealth Fund",
		"Special Purpose Vehicle established by entities",
		"Special Purpose Vehicle established by Financial Institutions",
		"Sports Federation",
		"SPVs (SPV/SPE/SPC) - Established by NBFIs only",
		"SPVs (SPV/SPE/SPC) - Established by UAE GREs",
		"Supranational Entity",
		"Treasury Money market funds (Established by private companies)",
	];
	gender = ["Male", "Female", "Other"];
	maritalStatus = ["SINGLE", "Married"];
	designation = ["AE", "Software Engineer"];
	constructor(
		private formUtilityService: FormUtilityService,
		private dataService: DataService,
		private pageLoaderSvc: PageLoaderService,
		private usps: UspsService,
		private util: UtilityService,
		private modalBoxService: ModalBoxService,
		private cdr: ChangeDetectorRef,
		private sharedMdm: SharedMdmService,
		private notificationSvc: NotificationService
	) {}

	ngOnInit() {
		this.applicantId = this.pid ? this.applicantType + this.pid : this.applicantType;
		this.dataService.currentStateCheck.subscribe((resp) => {
			this.accountType = resp.accountType;
			this.page = resp.page;
			if (this.page === "personalInfo") {
				this.dobDisable = true;
				this.isPrimaryApplicant = true;
			} else {
				this.isMinor = false;
			}
			this.setBusinesstype();

			this._getInitialFieldData();
			this._createForm();
			if (
				(this.accountType === "businessDeposit" && this.pid !== 1) ||
				this.applicantType === APPLICANT_TYPE["consumerJoint"]
			) {
				this.formUtilityService.resetAndClearControlValidations(
					this.consumerForm.controls.preferredcontact,
					false
				);
			}
			this._initReview();
			this.dataService.editableSection.subscribe((section) => {
				this.editableSection = section;
			});

			this.dataService.zipValidityCheck.subscribe((isZipValid) => {
				if (isZipValid) {
					this.isZipValid = true;
				} else {
					this.isZipValid = false;
					if (this.interval) {
						clearInterval(this.interval);
						this.interval = "";
					}
				}
			});

			this.consumerForm.get("confirmEmail").disable();
			this.onEmailChange();
			this.onIdTypeChange();
			this.onIdIssueCountryChange();
			this.onHomePhoneNumberChange();
			const dob = sessionStorage.getItem("dob");
			if (dob && !sessionStorage.arn) {
				this.showForm = false;
				this.ageRange = this.formUtilityService.getAgeRange(sessionStorage.getItem("dob"));
				if (this.ageRange === "minor") {
					this.isMinor = true;
					this.consumerForm["controls"].identification["controls"].number.setValidators(
						CustomValidation.minoridentificationnumber
					);
					this.consumerForm["controls"].identification["controls"].number.updateValueAndValidity({
						onlySelf: true,
					});
				} else {
					this.addIdentificationValidation();
				}
			}
		});
		// this.onLearnAboutUsChange();
	}

	setBusinesstype() {
		const eligibility = JSON.parse(sessionStorage.getItem("eligibilityQuestions"));
		if (eligibility && eligibility.ownershipstructure === "1") {
			this.modalBoxService.ownerMax = 1;
			this.isSoleProprietorship = true;
		} else {
			this.modalBoxService.ownerMax = 4;
		}
	}

	getAllowedResponsibleIndividuals(): Number {
		if (this.isSoleProprietorship) {
			return 8;
		} else {
			return 11;
		}
	}

	addIdentificationValidation() {
		const idType = this.consumerForm.getRawValue().identification.type;
		if (idType && idType === "PS") {
			this.consumerForm["controls"].identification["controls"].number.setValidators(
				CustomValidation.passportnumber
			);
		} else {
			this.consumerForm["controls"].identification["controls"].number.setValidators(
				CustomValidation.identificationnumber
			);
		}
		this.consumerForm["controls"].identification["controls"].number.updateValueAndValidity({
			onlySelf: true,
		});
		this.consumerForm["controls"].identification["controls"].type.setValidators([Validators.required]);
		this.consumerForm["controls"].identification["controls"].issuestate.setValidators([Validators.required]);
		this.consumerForm["controls"].identification["controls"].issuecountry.setValidators([
			Validators.required,
		]);
		this.consumerForm["controls"].identification["controls"].issuedate.setValidators([Validators.required]);
		this.consumerForm["controls"].identification["controls"].expirydate.setValidators([Validators.required]);
		this.consumerForm["controls"].identification["controls"].type.updateValueAndValidity({ onlySelf: true });
		this.consumerForm["controls"].identification["controls"].expirydate.updateValueAndValidity({
			onlySelf: true,
		});
	}

	// onLearnAboutUsChange() {
	// 	this.consumerForm.get('learnaboutus').valueChanges.subscribe(() => {
	// 		this.changeLearnAboutUs();
	// 	});
	// }

	// changeLearnAboutUs() {
	// 	this.showReferredEmployee = (this.consumerForm.getRawValue().learnaboutus === this.referredEmployeeId) ? true : false;
	// }

	onEmailChange() {
		this.consumerForm.get("email").valueChanges.subscribe(() => {
			this.checkConfirmEmail();
		});
	}

	checkConfirmEmail() {
		if (this.consumerForm["controls"].email.valid && this.consumerForm.getRawValue().email !== "") {
			const control = this.consumerForm.get("confirmEmail");
			control.enable();
			if (this.confirmEMailFocused) {
				control["nativeElement"].focus();
				this.confirmEMailFocused = false;
			}
			// } else {
			// 	control.disable();
			// 	control.setValue('');
			// 	control.setErrors(null);
		}
	}

	checkEmail(event) {
		if (!event.shiftKey && event.key === "Tab") {
			this.confirmEMailFocused = true;
		}
	}

	ngAfterViewInit() {
		// for business applicants
		this.patchConsumerData.emit(this);
	}

	private _createForm() {
		this.consumerForm = new FormGroup(
			{
				keycitizen: new FormControl(false),
				nationality: new FormControl(""),
				gender: new FormControl(""),
				pid: new FormControl(this.pid),
				firstname: new FormControl("", {
					validators: CustomValidation.firstname,
					updateOn: "blur",
				}),
				middlename: new FormControl("", {
					validators: CustomValidation.middlename,
					updateOn: "blur",
				}),
				lastname: new FormControl("", {
					validators: CustomValidation.lastname,
					updateOn: "blur",
				}),
				title: new FormControl(""),
				suffix: new FormControl(""),
				dob: new FormControl("", {
					validators: [Validators.required],
					updateOn: "blur",
				}),
				dobPicker: new FormControl(null),
				ssn: new FormControl("", {
					validators: CustomValidation.ssn,
					updateOn: "blur",
				}),
				restrictedcustomer: new FormControl(false),
				homephonenumber: new FormControl("", {
					validators: CustomValidation.primaryphonenumber,
					updateOn: "blur",
				}),
				mobilephonenumber: new FormControl("", {
					validators: CustomValidation.mobilephonenumber,
					updateOn: "blur",
				}),
				email: new FormControl("", {
					validators: CustomValidation.email,
					updateOn: "blur",
				}),
				confirmEmail: new FormControl("", {
					validators: CustomValidation.email,
					updateOn: "blur",
				}),
				passphrase: new FormControl("", {
					validators: CustomValidation.mothermaiden,
					updateOn: "blur",
				}),
				// phonetype: new FormControl('mobile', [Validators.required]),
				uscitizen: new FormControl(true, {
					validators: [Validators.required],
					updateOn: "blur",
				}),
				country: new FormControl(""),
				identification: new FormGroup({
					type: new FormControl(""),
					number: new FormControl("", {
						validators: null,
						updateOn: "blur",
					}),
					issuestate: new FormControl(""),
					issuecountry: new FormControl(""),
					issuedate: new FormControl(""),
					issuedatePicker: new FormControl(null),
					expirydate: new FormControl(""),
					expirydatePicker: new FormControl(null),
				}),
				// learnaboutus: new FormControl(0),
				// referredemployeename: new FormControl('', {
				// 	validators: CustomValidation.referredEmployeeName,
				// 	updateOn: 'blur'
				// }),
				mailingsameasphysical: new FormControl(true, [Validators.required]),
				addresssameasprimary: new FormControl(true, [Validators.required]),
				idscantype: new FormControl(null),
				relationship: new FormGroup({
					isauthorized: new FormControl(this.authorizerSelected),
					isbeneficialowner: new FormControl(false),
					issignificantcontroller: new FormControl(false),
					isbeneficialcontroller: new FormControl(false),
					ispowercontroller: new FormControl(false),
				}),
				preferredcontact: new FormControl(""),
				// preferredcontact: new FormControl("", {
				// 	validators: [Validators.required],
				// }),
				promocode: new FormControl(""),
			},
			this._emailMatchValidator
		);
	}

	getConsumerFormDetails(action?: string, primaryDetails?: any) {
		// const validationError = this.checkValidations();
		// if (!validationError) {
		this.address = [];
		const consumerDetails: ApplicantDetails = this.consumerForm.getRawValue();
		if (consumerDetails.uscitizen) {
			consumerDetails.country = "US";
		}
		// Added idtype_description for backoffice
		if (consumerDetails.identification && consumerDetails.identification.type) {
			consumerDetails.identification.idtypedescription = this.idTypes.find(
				(idType) => idType.idtype === consumerDetails.identification.type
			)["description"];
		}
		// Added citizen_country_description for backoffice
		if (consumerDetails.country) {
			consumerDetails.countryname = this.allCountries.find(
				(countryData) => countryData.country_code === consumerDetails.country
			)["description"];
		}
		if (!consumerDetails.confirmEmail && (action === "save" || action === "back")) {
			consumerDetails.email = null;
		}
		consumerDetails.addresssameasprimary = this.samePhysicalAsPrimary;
		consumerDetails.mailingsameasphysical = this.sameMailingAddress;
		if (this.physicalAddress) {
			this.formatAddress(this.physicalAddress.addressForm.getRawValue(), "physicalAddress");
			if (this.sameMailingAddress) {
				this.formatAddress(this.physicalAddress.addressForm.getRawValue(), "mailingAddress");
			} else if (this.mailingAddress) {
				this.formatAddress(this.mailingAddress.addressForm.getRawValue(), "mailingAddress");
			}
		}
		if (primaryDetails && primaryDetails.address && !this.reviewPage) {
			if (this.samePhysicalAsPrimary) {
				const primaryAddress = primaryDetails.address.filter(
					(add) => add.addresstype === "physicalAddress"
				)[0];
				this.formatAddress(primaryAddress, "physicalAddress");
				if (this.sameMailingAddress) {
					this.formatAddress(primaryAddress, "mailingAddress");
				} else if (this.mailingAddress) {
					this.formatAddress(this.mailingAddress.addressForm.getRawValue(), "mailingAddress");
				}
			}
		}
		consumerDetails.address = this.address;
		if (!this.isMinor && this.employmentDetails) {
			consumerDetails.employment = this.employmentDetails.getEmploymentFormDetails();
		}
		// consumerDetails.primaryphonenumber = this.formUtilityService.resetPhoneNumber(consumerDetails.primaryphonenumber);
		// consumerDetails.employment.workphonenumber = this.formUtilityService.resetPhoneNumber(consumerDetails.employment.workphonenumber);
		// consumerDetails.samePhysicalAsPrimary = this.samePhysicalAsPrimary;
		return consumerDetails;
		// }
	}

	formatAddress(address, type) {
		const addressNew = {
			addresstype: type,
			applicanttype: this.applicantType,
			numberandstreet: address.numberandstreet,
			aptorsuite: address.aptorsuite,
			zipcode: address.zipcode,
			city: address.city,
			state: address.state,
		};
		this.address.push(addressNew);
		// address['addresstype'] = type;
		// if (address.pid) {
		// 	delete address.pid;
		// }
		// this.address.push(address);
	}

	dateValidation(date: IMyInputFieldChanged, fieldName: string) {
		if (!date.value && fieldName === "dob" && sessionStorage.getItem("dob")) {
			date.value = sessionStorage.getItem("dob");
		}
		let field;
		switch (fieldName) {
			case "dob":
				field = this.consumerForm["controls"].dob;
				break;
			case "issueDate":
				field = this.consumerForm["controls"].identification["controls"].issuedate;
				break;
			case "expiryDate":
				field = this.consumerForm["controls"].identification["controls"].expirydate;
				break;
		}
		if (field && field.value && date.value !== field.value) {
			field.setErrors({ invalid: true });
			// field.markAsTouched();
		}
	}

	onDateChanged(date: IMyInputFieldChanged | any, fieldName: string) {
		let field;
		let resetPicker: boolean;
		let isDateInvalid = false;
		if (date !== null && typeof date === "object") {
			date = date.formatted;
		}
		// const dateValue = date ? new Date(date) : new Date();
		const dateValue = new Date(date);
		const datePicker = {
			date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() },
		};
		const resetdatePicker = { date: { year: 0, month: 0, day: 0 } };

		if (fieldName === "dob") {
			if (
				date &&
				(!(dateValue instanceof Date) || isNaN(dateValue.getTime()) || dateValue.getFullYear() < 1901)
			) {
				this.dobError = true;
				isDateInvalid = false;
			} else {
				isDateInvalid = this.formUtilityService.checkDateOfBirthValidity(date, this.ageRange);
				this.dobError = false;
			}
		} else {
			// if (date) {
			isDateInvalid = this.formUtilityService.checkDateValidity(date, fieldName);
			// }
		}

		switch (fieldName) {
			case "dob":
				this.dobInvalid = isDateInvalid;
				field = this.consumerForm["controls"].dob;
				const issuedate = this.consumerForm["controls"].identification["controls"].issuedate;
				this.consumerForm.patchValue({ dob: date });
				if (this.dobError || (this.dobInvalid && field.value)) {
					field.setErrors({ incorrect: true });
				}
				if (!this.dobError && !this.dobInvalid && issuedate.value) {
					this.issueDateandDobValidity = false;
					this.issueDateandDobValidity = this.formUtilityService._issueDateandDobValidity(
						issuedate.value,
						field.value
					);
					if (this.issueDateandDobValidity) {
						issuedate.setErrors({ lessthandob: true });
						issuedate.markAsTouched();
					} else {
						issuedate.setErrors(null);
					}
				}
				resetPicker = this.dobInvalid || this.dobError || !date ? true : false;
				// if (this.dobPickerRef) {
				this.consumerForm.patchValue({ dobPicker: resetPicker ? resetdatePicker : datePicker });
				// }
				break;
			case "issueDate":
				this.issueDateInvalid = isDateInvalid;
				field = this.consumerForm["controls"].identification["controls"].issuedate;
				const dob = this.consumerForm["controls"].dob;
				this.consumerForm.patchValue({ identification: { issuedate: date } });
				if (this.issueDateInvalid && field.value) {
					field.setErrors({ incorrect: true });
				} else if (field.value === "") {
					field.setErrors({ required: true });
				} else {
					field.setErrors(null);
				}
				if (!this.issueDateInvalid && dob.value) {
					this.issueDateandDobValidity = this.formUtilityService._issueDateandDobValidity(
						field.value,
						dob.value
					);
					// this.issueDateandDobValidity ? field.setErrors({ 'lessthandob': true }) : field.setErrors(null);
					if (this.issueDateandDobValidity) {
						field.setErrors({ lessthandob: true });
						field.markAsTouched();
					} else {
						field.setErrors(null);
						this.consumerForm["controls"].dob.setErrors(null);
					}
				}
				resetPicker = this.issueDateInvalid || !date ? true : false;
				// if (this.issueDatePickerRef) {
				this.consumerForm.patchValue({
					identification: { issuedatePicker: resetPicker ? resetdatePicker : datePicker },
				});
				// }
				break;
			case "expiryDate":
				this.expiryDateInvalid = isDateInvalid;
				field = this.consumerForm["controls"].identification["controls"].expirydate;
				this.consumerForm.patchValue({ identification: { expirydate: date } });
				if (this.expiryDateInvalid && field.value) {
					field.setErrors({ incorrect: true });
				} else if (field.value === "") {
					field.setErrors({ required: true });
				} else {
					field.setErrors(null);
				}
				// this.expiryDateInvalid && field.value ? field.setErrors({ 'incorrect': true }) : field.setErrors(null);
				resetPicker = this.expiryDateInvalid || !date ? true : false;
				// if (this.expiryDatePickerRef) {
				this.consumerForm.patchValue({
					identification: { expirydatePicker: resetPicker ? resetdatePicker : datePicker },
				});
				// }
				break;
		}
	}

	private _emailMatchValidator(individualForm: FormGroup) {
		if (
			individualForm.get("email") &&
			individualForm.get("email").value &&
			individualForm.get("confirmEmail") &&
			individualForm.get("confirmEmail").value
		) {
			return individualForm.get("email").value.toLowerCase() ===
				individualForm.get("confirmEmail").value.toLowerCase()
				? null
				: { mismatch: true };
		}
		return null;
	}

	private _initReview() {
		let initialValue = true;
		if (this.reviewPage) {
			initialValue = false;
		}
		this.editPersonalDetails = initialValue;
		this.editIdDetails = initialValue;
		this.editContactInfo = initialValue;
		this.editMailingAddress = initialValue;
		this.editPreviousAddress = initialValue;
		this.editEmpDetails = initialValue;
		this.editRelationshipDetails = initialValue;
		this.editAdditionalDetails = initialValue;
	}

	refreshForm(section) {
		// this._initReview();
		this.dataService.changeSection("");
		this.savedConsumerData = {};
		this.toggleSection(section);
	}

	toggleSectionEdit(section: string) {
		switch (this.editableSection) {
			case "":
				this.toggleSection(section);
				this.savePreviousData(section);
				this.dataService.changeSection(section);
				break;
			case section:
				this.toggleSection(section);
				this.savePreviousData(section);
				this.consumerForm.markAsPristine();
				this.consumerForm.markAsUntouched();
				this.savedConsumerData = {};
				this.dataService.changeSection("");
				break;
			default:
				throw new ApplicationError("1001");
		}
	}

	toggleSection(section: string) {
		switch (section) {
			case "personal_details":
				this.editPersonalDetails = !this.editPersonalDetails;
				break;
			case "id_details":
				this.editIdDetails = !this.editIdDetails;
				break;
			case "physical_address":
				this.editContactInfo = !this.editContactInfo;
				break;
			case "mailing_address":
				this.editMailingAddress = !this.editMailingAddress;
				break;
			case "employment_details":
				this.editEmpDetails = !this.editEmpDetails;
				break;
			case "relationship_details":
				this.editRelationshipDetails = !this.editRelationshipDetails;
				this.resetRelationshipValidation();
				break;
			case "additional_details":
				this.editAdditionalDetails = !this.editAdditionalDetails;
				break;
			default:
				throw new ApplicationError("1001");
		}
	}

	savePreviousData(section) {
		switch (section) {
			case "personal_details":
				// this.editPersonalDetails = !this.editPersonalDetails;
				if (Object.keys(this.savedConsumerData).length > 0) {
					this.consumerForm.patchValue(this.savedConsumerData);
					// this.toggleUSCitizen(this.savedConsumerData['isUSCitizen']);
				} else {
					this.savedConsumerData = this.consumerForm.getRawValue();
					/**
					 ** Uncomment below code to disable dob when product is dob specific
					 **/
					// this.disableDob(this.consumerForm.getRawValue()['dob']);
				}
				break;
			case "id_details":
				// this.editIdDetails = !this.editIdDetails;
				if (Object.keys(this.savedConsumerData).length > 0) {
					this.consumerForm.patchValue(this.savedConsumerData);
					// this.toggleUSCitizen(this.savedConsumerData['isUSCitizen']);
				} else {
					this.savedConsumerData = this.consumerForm.getRawValue();
				}
				break;
			case "physical_address":
				// this.editContactInfo = !this.editContactInfo;
				if (Object.keys(this.savedConsumerData).length > 0) {
					this.physicalAddress.patchData(this.savedConsumerData["physicalAddress"]);
					// if (this.savedConsumerData['previousAddress']) {
					// 	this.showPreviousAddress = true;
					// 	const previousAddress = this.savedConsumerData['previousAddress'];
					// 	setTimeout(() => {
					// 		if (this.previousAddress && previousAddress) {
					// 			this.previousAddress.patchData(previousAddress);
					// 		}
					// 	}, 10);
					// }
				} else {
					this.savedConsumerData["physicalAddress"] = this.physicalAddress.addressForm.getRawValue();
					if (this.previousAddress) {
						this.savedConsumerData["previousAddress"] = this.previousAddress.addressForm.getRawValue();
					}
				}
				break;
			case "mailing_address":
				// this.editMailingAddress = !this.editMailingAddress;
				if (Object.keys(this.savedConsumerData).length > 0) {
					this.mailingAddress.patchData(this.savedConsumerData);
				} else {
					this.savedConsumerData = this.mailingAddress.addressForm.getRawValue();
				}
				break;
			case "employment_details":
				// this.editEmpDetails = !this.editEmpDetails;
				if (Object.keys(this.savedConsumerData).length > 0) {
					// this.savedConsumerData['workphonenumber'] = this.formUtilityService.resetPhoneNumber(this.savedConsumerData['workphonenumber']);
					this.employmentDetails.patchData(this.savedConsumerData);
				} else {
					this.savedConsumerData = this.employmentDetails.employment.getRawValue();
				}
				break;
			case "relationship_details":
				if (Object.keys(this.savedConsumerData).length > 0) {
					this.consumerForm.patchValue(this.savedConsumerData);
					// this.toggleUSCitizen(this.savedConsumerData['isUSCitizen']);
				} else {
					this.savedConsumerData = this.consumerForm.getRawValue();
				}
				break;
			case "additional_details":
				// this.editAdditionalDetails = !this.editAdditionalDetails;
				if (Object.keys(this.savedConsumerData).length > 0) {
					this.consumerForm.patchValue(this.savedConsumerData);
					// this.toggleUSCitizen(this.savedConsumerData['isUSCitizen']);
				} else {
					this.savedConsumerData = this.consumerForm.getRawValue();
				}
				break;
			default:
				// console.log('Please save or discard the already editing section.');
				throw new ApplicationError("1001");
		}
	}

	disableDob(dob: string) {
		// const productList = JSON.parse(sessionStorage.getItem('productIdList'));
		// if (productList) {
		// 	const result = productList.findIndex(product => {
		// 		return product.productid === 'youth_checking_30' || product.productid === 'youth_share_01';
		// 	});
		// 	if (result !== -1) {
		this.autoFillDob(dob);
		// 	}
		// }
	}

	getIdentificationTypeText(val: string) {
		let title: string = null;
		if (this.idTypes !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				this.idTypes.forEach((obj) => {
					if (obj.idtype === val) {
						title = obj.description;
					}
				});
			}
		}
		return title;
	}

	getLearnAboutUsText(val: string) {
		let title: string = null;
		if (this.learnAboutUs !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				this.learnAboutUs.forEach((obj) => {
					if (obj.id === val) {
						title = obj.value;
					}
				});
			}
		}
		return title;
	}

	getIssueStateText(val: string) {
		let title: string = null;
		if (this.allStates !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				this.allStates.forEach((obj) => {
					if (obj.statecode === val) {
						title = obj.statename;
					}
				});
			}
		}
		return title;
	}

	getCountryText(val: string) {
		let title: string = null;
		if (this.allCountries !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				this.allCountries.forEach((obj) => {
					if (obj.country_code === val) {
						title = obj.description;
					}
				});
			}
		}
		return title;
	}

	getTitle(val: string) {
		let title: string = null;
		if (this.title !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				const titleObj = this.title.find((obj) => {
					return obj.id === val;
				});
				if (titleObj && titleObj.description) {
					title = titleObj.description;
				}
			}
		}
		return title;
	}

	saveData(section) {
		if (section) {
			// if (this.page !== 'review' && sessionStorage.arn) {
			// 	this.save.emit(section);
			// } else {
			const dataObj = {
				accounttype: "personal",
				form: this,
				section: section,
			};
			if (
				section === "physical_address" ||
				section === "mailing_address" ||
				section === "employment_details"
			) {
				if (!this.interval) {
					this.interval = setInterval(() => {
						if (this.isZipValid) {
							clearInterval(this.interval);
							this.interval = "";
							this.save.emit(dataObj);
						}
					}, 1000);
				}
			} else {
				this.save.emit(dataObj);
			}
			// }
		}
	}

	toggleMailingAddress(sameAddress) {
		this.sameMailingAddress = sameAddress;
		if (this.mailingAddress) {
			this.mailingAddress.addressForm.reset();
		}
	}

	togglePhysicalAddress(samePhysicalAddress) {
		this.samePhysicalAsPrimary = samePhysicalAddress;
		this.showPhysicalAddress = !samePhysicalAddress;
		if (this.physicalAddress) {
			this.physicalAddress.addressForm.reset();
		}
	}

	onFocusSsn() {
		if (this.consumerForm.getRawValue().ssn) {
			this.consumerForm.patchValue({ ssn: "" });
			this.consumerForm.controls.ssn.setErrors(null);
		}
	}

	onFocusOutSsn() {
		if (!this.consumerForm.getRawValue().ssn) {
			this.consumerForm.controls.ssn.setErrors({ required: true });
		}
	}

	checkFields() {
		setTimeout(() => {
			// if (this.consumerForm.getRawValue().dob !== null && typeof this.consumerForm.getRawValue().dob === 'object') {
			// 	this.consumerForm.patchValue({ dob: this.consumerForm.getRawValue().dob.formatted });
			// }
			// const arn = sessionStorage.getItem('arn');
			// const mileStoneError = this.formUtilityService.checkMilestoneError(this.consumerForm);
			// if (!mileStoneError && (!arn)) {
			// 	this.checkApplication();
			// } else if (arn) {
			// 	this.checkSaveAndExitDisability.emit(mileStoneError);
			// }
			// }
			this.checkApplication(false);
		}, 1000);
	}

	checkApplication(callnextstep) {
		if (
			this.consumerForm.getRawValue().dob !== null &&
			typeof this.consumerForm.getRawValue().dob === "object"
		) {
			this.consumerForm.patchValue({ dob: this.consumerForm.getRawValue().dob.formatted });
		}
		const arn = sessionStorage.getItem("arn");
		const mileStoneError = this.formUtilityService.checkMilestoneError(this.consumerForm);
		if (!mileStoneError && !arn) {
			this._createApplication(callnextstep);
		} else if (arn) {
			this.checkSaveAndExitDisability.emit(mileStoneError);
		}
	}

	private _createApplication(callnextstep) {
		// const semanticError = this.formUtilityService.checkFormSemantics(this.consumerForm, false);
		// if (!semanticError) {
		const personaldetails = {
			pid: 1,
			lastname: this.consumerForm.getRawValue().lastname,
			dob:
				this.consumerForm.getRawValue().dob !== null &&
				typeof this.consumerForm.getRawValue().dob === "object"
					? this.consumerForm.getRawValue().dob.formatted
					: this.consumerForm.getRawValue().dob,
			ssn: this.consumerForm.getRawValue().ssn,
			email: this.consumerForm.getRawValue().email,
			callnextstep: callnextstep,
		};
		this.createApplication.emit(personaldetails);
		// }
	}

	private _getInitialFieldData() {
		if (this.sharedMdm.titles && this.sharedMdm.titles.length > 0) {
			this.title = this.sharedMdm.titles;
		} else {
			this.sharedMdm.getTitles().subscribe((data: Array<Title>) => {
				this.title = data;
			});
		}
		if (this.sharedMdm.suffixes && this.sharedMdm.suffixes.length > 0) {
			this.suffix = this.sharedMdm.suffixes;
		} else {
			this.sharedMdm.getSuffixes().subscribe((data: Array<Suffix>) => {
				this.suffix = data;
			});
		}
		if (this.sharedMdm.allStates && this.sharedMdm.allStates.length > 0) {
			this.allStates = this.sharedMdm.allStates;
		} else {
			this.sharedMdm.getStates().subscribe((data: Array<States>) => {
				this.allStates = data;
			});
		}
		if (this.sharedMdm.idTypes && this.sharedMdm.idTypes.length > 0) {
			this.idTypes = this.sharedMdm.idTypes;
		} else {
			this.sharedMdm.getIdentification().subscribe((data: Array<IdType>) => {
				this.idTypes = data;
			});
		}
		if (this.sharedMdm.learnAboutUs && this.sharedMdm.learnAboutUs.length > 0) {
			this.learnAboutUs = this.sharedMdm.learnAboutUs;
		} else {
			this.sharedMdm.getAboutUs().subscribe((data: Array<LearnAboutUs>) => {
				this.learnAboutUs = data;
			});
		}
		if (this.sharedMdm.allCountries && this.sharedMdm.allCountries.length > 0) {
			this.allCountries = this.sharedMdm.allCountries;
			this.nonUSCountries = this.sharedMdm.nonUSCountries;
		} else {
			this.sharedMdm.getCountry().subscribe((data: any) => {
				this.allCountries = data.allCountries;
				this.nonUSCountries = data.nonUSCountries;
			});
		}
	}

	updateDataFromIdScan(data: { id: number; data: ApplicantDetails | null }) {
		if (data) {
			// this.showForm = true;
			if (!data.data) {
				const dummyData: ApplicantDetails = {
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

			if (data.data.country) {
				switch (data.data.country) {
					case "USA":
						data.data.country = "US";
						this.consumerForm.controls.uscitizen.setValue(true);
						this.toggleUSCitizen(true);
						break;
					case "US":
						this.consumerForm.controls.uscitizen.setValue(true);
						this.toggleUSCitizen(true);
						break;
					default:
						this.consumerForm.controls.uscitizen.setValue(false);
						this.toggleUSCitizen(false);
				}
			}
			setTimeout(() => {
				if (data.data.physicaladdress) {
					if (this.accountType === "businessDeposit") {
						this.patchFromIdScan.emit(data);
					} else if (this.physicalAddress) {
						this.physicalAddress.addressForm.patchValue({
							aptorsuite: data.data.physicaladdress.aptorsuite,
							numberandstreet: data.data.physicaladdress.numberandstreet,
						});
					}
					// delete data.data.physicaladdress;
				}
			}, 100);
			if (this.accountType === "consumerDeposit" && this.applicantType !== "JOINT") {
				if (data.data.dob && this.consumerForm.getRawValue().dob !== data.data.dob) {
					delete data.data.dob;
				}
			} else {
				this.onDateChanged(data.data.dob, "dob");
			}
			this.consumerForm.patchValue(data.data);
			this.showForm = true;
			this.showContinueAndSave.emit(this.isDedupeClicked);
			if (data.data.identification) {
				this.onDateChanged(data.data.identification.issuedate, "issueDate");
				this.onDateChanged(data.data.identification.expirydate, "expiryDate");
			}
		}
		setTimeout(function () {
			this.pageLoaderSvc.hide();
		}, 2000);
	}

	checkValidations() {
		// if (this.accountType === 'consumerDeposit') {
		// 	this.validateIdentificationfields();
		// }
		this.validationError = false;
		if (!this.reviewPage) {
			this.validationError = this.idscanCmp.displayValidations(this.validationError);
		}
		this.validationError = this.formUtilityService.displayValidations(
			this.consumerForm,
			this.validationError
		);
		if (!this.isMinor) {
			this.validationError = this.formUtilityService.displayValidations(
				this.employmentDetails.employment,
				this.validationError
			);
		}
		if (this.showPhysicalAddress) {
			this.validationError = this.formUtilityService.displayValidations(
				this.physicalAddress.addressForm,
				this.validationError
			);
		}
		if (this.mailingAddress) {
			this.validationError = this.formUtilityService.displayValidations(
				this.mailingAddress.addressForm,
				this.validationError
			);
		}
		// if (this.showPreviousAddress) {
		// 	this.validationError = this.formUtilityService.displayValidations(this.previousAddress.addressForm, this.validationError);
		// }
		return this.validationError;
	}

	checkValidationsOnBack() {
		this.validationError = false;
		this.validationError = this.formUtilityService.displayValidationsonBack(
			this.consumerForm,
			this.validationError
		);
		if (!this.isMinor && this.employmentDetails) {
			this.validationError = this.formUtilityService.displayValidationsonBack(
				this.employmentDetails.employment,
				this.validationError
			);
		}
		if (this.showPhysicalAddress) {
			this.validationError = this.formUtilityService.displayValidationsonBack(
				this.physicalAddress.addressForm,
				this.validationError
			);
		}
		if (this.mailingAddress) {
			this.validationError = this.formUtilityService.displayValidationsonBack(
				this.mailingAddress.addressForm,
				this.validationError
			);
		}
		return this.validationError;
	}

	checkRelationship(authorizer, owner, controller, controllerRequiredError = false) {
		this.authorizedSignerError = false;
		this.beneficialOwnerError = false;
		this.significantControllerError = false;
		this.significantRequiredError = false;
		this.relationshipError = false;
		const group = this.consumerForm["controls"].relationship["controls"];
		if (group.isauthorized.value && authorizer + 1 > this.modalBoxService.authorizerMax) {
			this.authorizedSignerError = true;
			this.getFocusOnControls(group, "isauthorized");
		}
		if (group.isbeneficialowner.value && owner + 1 > this.modalBoxService.ownerMax) {
			this.beneficialOwnerError = true;
			this.getFocusOnControls(group, "isbeneficialowner");
		}
		if (group.issignificantcontroller.value && controller + 1 > this.modalBoxService.controllerMax) {
			this.significantControllerError = true;
			this.getFocusOnControls(group, "issignificantcontroller");
		}
		if (
			(!group.issignificantcontroller.value &&
				authorizer === this.modalBoxService.authorizerMax &&
				owner === this.modalBoxService.ownerMax &&
				controller === 0) ||
			controllerRequiredError
		) {
			this.significantRequiredError = true;
			this.getFocusOnControls(group, "issignificantcontroller");
		}
		if (!group.isauthorized.value && !group.isbeneficialowner.value && !group.issignificantcontroller.value) {
			this.relationshipError = true;
		}
		return (
			this.authorizedSignerError ||
			this.beneficialOwnerError ||
			this.significantControllerError ||
			this.significantRequiredError ||
			this.relationshipError
		);
	}

	validateIdentificationfields() {
		let isDataExist = false;
		let emptyFieldFound = false;
		const fields = ["type", "number", "issuestate", "issuecountry", "issuedate", "expirydate"];
		fields.forEach((key) => {
			const field = this.consumerForm["controls"].identification["controls"][key];
			if (field && field.value) {
				isDataExist = true;
			}
		});
		if (isDataExist) {
			fields.forEach((key) => {
				const field = this.consumerForm["controls"].identification["controls"][key];
				if (field && !field.value) {
					emptyFieldFound = true;
				}
			});
			if (emptyFieldFound) {
				throw new ApplicationError("1015");
			}
		}
	}

	resetRelationshipValidation() {
		this.authorizedSignerError = false;
		this.beneficialOwnerError = false;
		this.significantControllerError = false;
		this.significantRequiredError = false;
		this.relationshipError = false;
	}

	getFocusOnControls(group, field) {
		const control = group[field];
		if (control["nativeElement"]) {
			control["nativeElement"].focus();
		}
	}

	standardizeAddress(holderType: string, addressType: string) {
		this.dataService.standardizeCheck.subscribe((data) => {
			if (
				!data ||
				!data.hasOwnProperty(holderType + addressType) ||
				data[holderType + addressType] === true
			) {
				if (this.consumerForm["controls"][addressType]["controls"].numberandstreet.valid) {
					const add = this.consumerForm["controls"][addressType]["controls"].numberandstreet.value;
					let zip = "";
					if (
						this.consumerForm.getRawValue() !== null &&
						this.consumerForm.getRawValue()[addressType] !== null
					) {
						zip = this.consumerForm.getRawValue()[addressType].zipcode;
					}
					if (
						add !== null &&
						add !== undefined &&
						add !== "" &&
						zip !== null &&
						zip !== undefined &&
						zip !== ""
					) {
						this.usps.standardizeAddress(add, zip).subscribe((address) => {
							if (address !== null && address !== undefined && address !== "") {
								this.dataService.updateStandarizeAddressStatus(holderType, addressType);
								const patchObj = {};
								patchObj[addressType] = { numberandstreet: address };
								this.consumerForm.patchValue(patchObj);
							}
						});
					}
				}
			}
		});
	}

	zipLookUp(el, holderType: string, addressType: string) {
		const zipControl = this.consumerForm["controls"][holderType]["controls"][addressType]["controls"].zipcode;
		if (!zipControl.invalid) {
			this.usps.zipLookup(zipControl.value).subscribe((data: ZipDetails) => {
				if (!data["error"]) {
					if (data.state) {
						const patchObj = {
							state: data.state,
							city: data.city,
						};
						this.consumerForm.controls[holderType]["controls"][addressType].patchValue(patchObj);
						this.standardizeAddress(holderType, addressType);
					} else {
						zipControl.setErrors({ incorrect: true });
					}
				} else {
					zipControl.setErrors({ incorrect: true });
				}
			});
		}
	}

	patchData(data: ApplicantDetails, jointExists = false) {
		this.pid = data.pid;
		if (this.reviewPage && data.pid !== 1) {
			this.showPhysicalAddress = true;
		} else if (data.pid !== 1) {
			this.togglePhysicalAddress(data.addresssameasprimary);
			this.toggleMailingAddress(data.mailingsameasphysical);
		}
		if (data.pid === 1 && data.relationship) {
			data.relationship.isauthorized = true;
		}
		this.consumerForm.patchValue(data);
		if (this.consumerForm.get("confirmEmail")["nativeElement"]) {
			this.consumerForm.get("confirmEmail")["nativeElement"].blur();
		}
		this.consumerForm.patchValue({ confirmEmail: data["email"] });
		this.patchAddress(data);
		this.ageRange = this.formUtilityService.getAgeRange(this.consumerForm.getRawValue()["dob"]);
		if (
			this.accountType === "consumerDeposit" &&
			this.ageRange === "minor" &&
			this.applicantType !== APPLICANT_TYPE["consumerJoint"]
		) {
			this.isMinor = true;
			const idType = this.consumerForm.getRawValue().identification.type;
			if (idType && idType === "PS") {
				this.consumerForm["controls"].identification["controls"].number.setValidators(
					CustomValidation.minorpassportnumber
				);
			} else {
				this.consumerForm["controls"].identification["controls"].number.setValidators(
					CustomValidation.minoridentificationnumber
				);
			}
			this.consumerForm["controls"].identification["controls"].number.updateValueAndValidity({
				onlySelf: true,
			});
		} else {
			this.addIdentificationValidation();
		}
		setTimeout(() => {
			if (data.employment && !this.isMinor && this.employmentDetails) {
				this.employmentDetails.patchData(data.employment);
				this.changeInEmploymentStatus(data.employment.employmentstatus);
			}
			if (
				!this.isSoleProprietorship &&
				this.pid === 1 &&
				this.accountType === "businessDeposit" &&
				this.employmentDetails
			) {
				this.employmentDetails.employment.controls["employmentstatus"].setValue("EMPLOYED");
				this.changeInEmploymentStatus("Employed");
			}
		}, 100);
		this.setCalenderDate();
		if (data.identification) {
			this.onDateChanged(data.identification.issuedate, "issueDate");
		}
		this.cdr.detectChanges();
	}

	patchAddress(data: ApplicantDetails) {
		const physicalAddress = this.getAddress(data.address, "physicaladdress");
		const mailingAddress = this.getAddress(data.address, "mailingaddress");
		setTimeout(() => {
			// Physical Address
			if (physicalAddress) {
				if (physicalAddress.length > 0 && this.showPhysicalAddress) {
					this.physicalAddress.patchData(physicalAddress[0]);
					if (
						this.accountType === "consumerDeposit" &&
						this.page === "personalInfo" &&
						this.physicalAddress.addressType === "physical"
					) {
						const zipData = JSON.parse(sessionStorage.getItem("zipcode"));
						if (zipData !== null && zipData !== undefined) {
							this.physicalAddress.addressForm.patchValue({
								zipcode: zipData["zip5"],
								city: zipData["city"],
								state: zipData["state"],
							});
							setTimeout(() => {
								this.physicalAddress.disableAddressFields = true;
							}, 0);
						}
					}
				}
			}
		}, 10);
		// Mailing Address
		setTimeout(() => {
			if (!data["mailingsameasphysical"] || this.reviewPage) {
				this.toggleMailingAddress(false);
				if (mailingAddress) {
					if (mailingAddress.length > 0) {
						// if (mailingAddress.length > 0 && this.showMailingAddress) {
						setTimeout(() => {
							this.mailingAddress.patchData(mailingAddress[0]);
						}, 1);
					}
				}
			} else {
				this.toggleMailingAddress(true);
			}
		}, 10);
	}

	validateDobAfterPatch(dob: string) {
		this.onDateChanged(dob, "dob");
	}

	// patchPreviousAddress(data: ApplicantDetails) {
	// 	if (this.showPreviousAddress) {
	// 		const previousAddress = this.getAddress(data.address, 'previousaddress');
	// 		setTimeout(() => {
	// 			this.previousAddress.patchData(previousAddress[0]);
	// 		}, 10);
	// 	}
	// }

	getAddress(address, addresstype) {
		if (address) {
			return address
				.filter((data) => {
					if (data.addresstype) {
						return data.addresstype.toLowerCase() === addresstype.toLowerCase();
					} else {
						return false;
					}
				})
				.map((data) => {
					// delete data['addresstype'];
					return data;
				});
		}
	}

	resetSSN(ssnNumber: string) {
		if (ssnNumber) {
			ssnNumber = [ssnNumber.slice(0, 3), "-", ssnNumber.slice(3, 5), "-", ssnNumber.slice(5, 9)].join("");
			this.consumerForm.patchValue({ ssn: ssnNumber });
		}
	}

	formatPhone(personalPhone: any) {
		if (personalPhone) {
			const formattedPhoneNumber = this.formUtilityService.formatPhoneNumber(personalPhone);
			this.consumerForm.patchValue({ homephonenumber: formattedPhoneNumber });
		}
	}

	// olbLoginCheck() {
	// 	if (this.isOLB) {
	// 		this.consumerForm.disable();
	// 		this.consumerForm.get('idscantype').enable();
	// 		if (this.consumerForm.getRawValue()['mothermaiden'] === '' || this.consumerForm.getRawValue()['mothermaiden'].length < 2 || this.consumerForm.getRawValue()['mothermaiden'].length > 35) {
	// 			this.consumerForm.get('mothermaiden').enable();
	// 			this.olbEnableMothersMaiden = true;
	// 			this.addOLBConsumerEditableField('mothermaiden');
	// 		}
	// 		this.consumerForm.get('email').enable();
	// 		this.consumerForm.get('confirmEmail').enable();
	// 		// this.consumerForm.get('preferredcontact').enable();
	// 		this.consumerForm.get('learnaboutus').enable();
	// 		this.olbIdentificationCheck();
	// 		this.olbOtherFieldsCheck();
	// 	}
	// }

	olbIdentificationCheck() {
		const idForm = this.consumerForm.get("identification");
		/* Comment this to test identificaion enabling on q2 login */
		// idForm.disable();
		this.olbEnableID = false;
		this.olbEnableIDType = false;
		this.disableIdentification = true;
		/* Comment this to test identificaion enabling on q2 login end here */

		/* Uncomment this to test identificaion enabling on q2 login */
		// idForm.enable();
		// this.olbEnableID = true;
		// this.disableIdentification = false;
		// this.addOLBConsumerEditableField('identification');
		/* Uncomment this to test identificaion enabling on q2 login end here */

		const idIncomplete =
			!idForm.get("type").value ||
			!idForm.get("number").value ||
			!idForm.get("issuestate").value ||
			!idForm.get("issuedate").value ||
			!idForm.get("expirydate").value;
		if (
			!this.util.isValidExpiryDate(idForm.get("expirydate").value) ||
			(idForm.get("type").value && idForm.get("type").value.toUpperCase() === "PK") ||
			idIncomplete
		) {
			idForm.enable();
			this.olbEnableID = true;
			this.disableIdentification = false;

			this.onDateChanged(idForm.get("issuedate").value, "issueDate");
			this.onDateChanged(idForm.get("expirydate").value, "expiryDate");

			this.addOLBConsumerEditableField("identification");
			if (
				!idForm.get("type").value ||
				(idForm.get("type").value && idForm.get("type").value.toUpperCase() === "PK")
			) {
				this.olbEnableIDType = true;
				idForm.patchValue({ type: "", issuestate: "" });
				idForm.reset();
				this.addOLBConsumerEditableField("identificationtype");
			} else {
				idForm.get("type").disable();
			}
		}
		if (!idForm.get("type").value) {
			idForm.patchValue({ type: "" });
		}
		if (!idForm.get("issuestate").value) {
			idForm.patchValue({ issuestate: "" });
		}
		this.checkOLBEnabledFields();
	}

	// olbOtherFieldsCheck() {
	// 	const phoneType = this.consumerForm.getRawValue()['phonetype'];
	// 	if (!phoneType) {
	// 		this.consumerForm.get('phonetype').enable();
	// 		this.consumerForm.patchValue({ phonetype: '' });
	// 		this.olbEnablePhoneType = true;
	// 		this.addOLBConsumerEditableField('phonetype');
	// 	}
	// 	if (!this.consumerForm.get('phonetype').value) {
	// 		this.consumerForm.patchValue({ phonetype: '' });
	// 	}
	// }

	addOLBConsumerEditableField(fieldName: string) {
		if (this.tyfoneEditableFields && this.tyfoneEditableFields.length) {
			if (!this.tyfoneEditableFields.includes(fieldName)) {
				this.tyfoneEditableFields.push(fieldName);
			}
		} else {
			this.tyfoneEditableFields = [];
			this.tyfoneEditableFields.push(fieldName);
		}
	}

	checkOLBEnabledFields() {
		if (this.tyfoneEditableFields) {
			this.tyfoneEditableFields.forEach((field) => {
				switch (field) {
					case "mothermaiden":
						this.consumerForm.get("mothermaiden").enable();
						this.olbEnableMothersMaiden = true;
						break;
					case "identification":
						this.consumerForm.get("identification").enable();
						this.olbEnableID = true;
						this.disableIdentification = false;

						this.onDateChanged(this.consumerForm.get("identification.issuedate").value, "issueDate");
						this.onDateChanged(this.consumerForm.get("identification.expirydate").value, "expiryDate");

						this.consumerForm.get("identification.type").disable();
						break;
					case "identificationtype":
						this.consumerForm.get("identification.type").enable();
						this.olbEnableIDType = true;
						break;
					// case 'phonetype':
					// 	this.consumerForm.get('phonetype').enable();
					// 	this.olbEnablePhoneType = true;
					// 	break;
				}
			});
		}
	}

	trim(control1: string, control2: string = null) {
		let trimValue;
		const patchObj = {};
		if (control2) {
			trimValue = this.consumerForm["controls"][control1]["controls"][control2].value
				? this.consumerForm["controls"][control1]["controls"][control2].value.trim()
				: null;
			patchObj[control2] = trimValue;
			this.consumerForm["controls"][control1].patchValue(patchObj);
		} else {
			trimValue = this.consumerForm["controls"][control1].value
				? this.consumerForm["controls"][control1].value.trim()
				: null;
			patchObj[control1] = trimValue;
			this.consumerForm.patchValue(patchObj);
		}
	}

	setCalenderDate() {
		const personalForm = this.consumerForm["controls"];
		if (personalForm.dob.valid && personalForm.dob.value) {
			const dateValue = new Date(personalForm.dob.value);
			const datePicker = {
				date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() },
			};
			this.consumerForm.patchValue({ dobPicker: datePicker });
		}
		if (
			personalForm.identification["controls"].issuedate.valid &&
			personalForm.identification["controls"].issuedate.value
		) {
			const dateValue = new Date(personalForm.identification["controls"].issuedate.value);
			const datePicker = {
				date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() },
			};
			this.consumerForm.patchValue({ identification: { issuedatePicker: datePicker } });
		}
		if (
			personalForm.identification["controls"].expirydate.valid &&
			personalForm.identification["controls"].expirydate.value
		) {
			const dateValue = new Date(personalForm.identification["controls"].expirydate.value);
			const datePicker = {
				date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() },
			};
			this.consumerForm.patchValue({ identification: { expirydatePicker: datePicker } });
		}
	}

	onIdTypeChange() {
		this.consumerForm.get(["identification", "type"]).valueChanges.subscribe(() => {
			const idType = this.consumerForm.getRawValue().identification.type;
			if (!idType) {
				this.consumerForm.patchValue({ identification: { issuestate: "", issuecountry: "" } });
			}
			if (this.idTypes && this.idTypes.length) {
				const selectedIdType = this.idTypes.filter((id) => id.idtype === idType);
				let issuedBy;
				if (selectedIdType && selectedIdType.length) {
					issuedBy = selectedIdType[0].IssuedBy;
					this.updateIdentificationFields(issuedBy);
				}
			}
			const el = this.consumerForm.get(["identification", "number"]);
			if (idType === "PS") {
				el.setValidators(
					this.ageRange === "minor" ? CustomValidation.minorpassportnumber : CustomValidation.passportnumber
				);
				this.passportSelected = true;
			} else {
				el.setValidators(
					this.ageRange === "minor"
						? CustomValidation.minoridentificationnumber
						: CustomValidation.identificationnumber
				);
				this.passportSelected = false;
			}
			el.updateValueAndValidity({ onlySelf: true });
		});
	}

	updateIdentificationFields(issuedBy: string) {
		const issueState = this.consumerForm.getRawValue().identification.issuestate;
		const issueCountry = this.consumerForm.getRawValue().identification.issuecountry;
		switch (issuedBy) {
			case "COUNTRY":
				this.hideIssuingState = true;
				this.hideIssuingCountry = false;
				this.consumerForm.patchValue({
					identification: { issuestate: issueState, issuecountry: issueCountry },
				});
				break;
			case "STATE":
				this.hideIssuingState = false;
				this.hideIssuingCountry = true;
				this.consumerForm.patchValue({ identification: { issuestate: issueState, issuecountry: "US" } });
				break;
			case "NONE":
				this.hideIssuingState = true;
				this.hideIssuingCountry = true;
				this.consumerForm.patchValue({ identification: { issuestate: "US", issuecountry: "US" } });
				break;
			default:
				this.hideIssuingState = true;
				this.hideIssuingCountry = true;
				this.consumerForm.patchValue({ identification: { issuestate: issuedBy, issuecountry: issuedBy } });
		}
		if (issueState) {
			this.consumerForm.get("identification.issuestate").markAsTouched();
		}
		if (issueCountry) {
			this.consumerForm.get("identification.issuecountry").markAsTouched();
		}
	}

	restrictIdentificationState(restrict: boolean, passportSelected = false) {
		if (restrict) {
			if (passportSelected) {
				this.consumerForm.patchValue({ identification: { issuestate: "", issuecountry: "" } });
			} else {
				this.consumerForm.patchValue({ identification: { issuestate: "US", issuecountry: "US" } });
			}
			this.passportSelected = passportSelected;
		} else {
			const issueState = this.consumerForm.getRawValue().identification.issuestate;
			const issueCountry = this.consumerForm.getRawValue().identification.issuecountry;
			if (issueState && issueState !== "" && issueState !== undefined) {
				this.consumerForm.patchValue({ identification: { issuestate: "", issuecountry: "US" } });
			}
			if (issueState) {
				this.consumerForm.get("identification.issuestate").markAsTouched();
			}
			if (issueCountry) {
				this.consumerForm.get("identification.issuecountry").markAsTouched();
			}
		}
		this.hideIssuingState = restrict;
	}

	onIdIssueCountryChange() {
		this.consumerForm.get(["identification", "issuecountry"]).valueChanges.subscribe(() => {
			const idType = this.consumerForm.getRawValue().identification.type;
			const issueCountry = this.consumerForm.getRawValue().identification.issuecountry;
			if (idType === "PS" && issueCountry !== "") {
				this.consumerForm.patchValue({ identification: { issuestate: issueCountry } });
			}
		});
	}

	// togglePhoneType(phoneType: string) {
	// 	this.consumerForm.patchValue({ phonetype: phoneType });
	// 	this.consumerForm.controls.phonetype.clearValidators();
	// 	this.consumerForm.controls.phonetype.setErrors(null);
	// }

	toggleUSCitizen(uscitizen: boolean) {
		if (uscitizen === false) {
			this.isUSCitizen = false;
			this.consumerForm.controls.country.setValidators(CustomValidation.setControlValidations("country"));
		} else {
			this.isUSCitizen = true;
			this.consumerForm["controls"].country.setValue("");
			this.consumerForm.controls.country.clearValidators();
			this.consumerForm.controls.country.setErrors(null);
			this.consumerForm.controls.country.markAsUntouched();
			this.consumerForm.controls.country.markAsPristine();
		}
		this.consumerForm.controls.uscitizen.clearValidators();
		this.consumerForm.controls.uscitizen.setErrors(null);
		this.consumerForm.updateValueAndValidity();
		this.cdr.detectChanges();
	}

	// showOrHidePreviousAddress(event) {
	// 	this.showPreviousAddress = event;
	// 	if (!event && this.previousAddress) {
	// 		this.previousAddress.addressForm.reset();
	// 	}
	// }

	getIdscanImages() {
		return {
			ids: this.idscanCmp ? this.idscanCmp.ids : "",
			idtype: this.idscanCmp ? this.idscanCmp.idscantype : "",
			holder: this.idscanCmp ? this.idscanCmp.holderType : "",
			pid: this.idscanCmp ? this.idscanCmp.pid : "",
		};
	}

	resetIdscanImages() {
		this.idscanCmp.ids["FRONT"]["id"] = "";
		this.idscanCmp.ids["FRONT"]["img"] = "";
		this.idscanCmp.ids["BACK"]["id"] = "";
		this.idscanCmp.ids["BACK"]["img"] = "";
		this.idscanCmp.idscantype = "";
	}

	updateIdScanType(value: string) {
		this.idscanCmp.idscantype = value;
	}

	updateIdScanImg(imgObj: Document) {
		const { docid, data } = imgObj;
		this.idscanCmp.ids[imgObj.pagetype]["id"] = docid;
		this.idscanCmp.ids[imgObj.pagetype]["img"] = "data:image/jpeg;base64," + data;
	}

	autoFillDob(dob: any) {
		this.consumerForm.controls["dob"].setValue(dob);

		this.consumerForm.controls["dobPicker"].disable();
		this.cdr.detectChanges();
	}

	getPID() {
		return this.consumerForm.getRawValue()["pid"];
	}

	resetForm() {
		this.consumerForm.reset();
	}

	toggleAuthorizedSigner(value) {
		this.authorizedSignerError = false;
		if (value) {
			this.relationshipError = false;
			if (this.modalBoxService.authorizeSigner + 1 > this.modalBoxService.authorizerMax) {
				this.authorizedSignerError = true;
			}
		} else {
			if (this.modalBoxService.authorizeSigner <= this.modalBoxService.authorizerMax) {
				this.authorizedSignerError = false;
			}
		}
	}

	toggleBeneficialOwner(value) {
		this.beneficialOwnerError = false;
		if (value) {
			this.relationshipError = false;
			if (this.modalBoxService.beneficialOwner + 1 > this.modalBoxService.ownerMax) {
				this.beneficialOwnerError = true;
			}
		} else {
			if (this.modalBoxService.beneficialOwner <= this.modalBoxService.ownerMax) {
				this.beneficialOwnerError = false;
			}
		}
	}

	toggleOwnerController(value) {
		console.log(this.consumerForm.value);
		if (value) {
			this.relationshipError = false;
			if (this.modalBoxService.beneficialOwner + 1 > this.modalBoxService.ownerMax) {
				this.beneficialOwnerError = true;
			}
		} else {
			if (this.modalBoxService.beneficialOwner <= this.modalBoxService.ownerMax) {
				this.beneficialOwnerError = false;
			}
		}
	}

	togglePowerController(value) {
		if (value) {
			this.relationshipError = false;
		} else {
			console.log("here");
		}
	}

	togglekeycitizen(value) {
		if (value) {
			this.relationshipError = false;
		} else {
			console.log("here");
		}
	}

	toggleSignificantController(value) {
		this.significantControllerError = false;
		if (value) {
			this.relationshipError = false;
			if (this.modalBoxService.significantController + 1 > this.modalBoxService.controllerMax) {
				this.significantControllerError = true;
			}
			if (this.significantRequiredError) {
				this.significantRequiredError = false;
			}
		} else {
			if (this.modalBoxService.significantController <= this.modalBoxService.controllerMax) {
				this.significantControllerError = false;
			}
		}
	}

	changeInEmploymentStatus(value) {
		if (this.pid !== 1) {
			if (this.isSoleProprietorship) {
				if (value.toLowerCase() === "employed" || value.toLowerCase() === "self employed") {
					this.isDisabledForEmploymentStatus = false;
				} else {
					this.isDisabledForEmploymentStatus = true;
					this._resetRelationship();
				}
			} else {
				if (value.toLowerCase() === "employed") {
					this.isDisabledForEmploymentStatus = false;
				} else {
					this.isDisabledForEmploymentStatus = true;
					this._resetRelationship();
				}
			}
		}
	}

	_resetRelationship() {
		this.significantControllerError = false;
		this.authorizedSignerError = false;
		this.consumerForm["controls"].relationship["controls"].issignificantcontroller.setValue("");
		this.consumerForm["controls"].relationship["controls"].isauthorized.setValue("");
	}

	deleteApplicant() {
		this.showConfirmationModal = true;
	}

	removeForm(event) {
		this.showConfirmationModal = false;
		if (event) {
			this.removeApplicant.emit(event);
		}
	}

	updatePreferredContact() {
		let workPhoneValid = false;
		let homePhoneValid = false;
		if (this.employmentDetails) {
			workPhoneValid =
				this.employmentDetails.employment.controls.workphonenumber.value &&
				!this.employmentDetails.employment.controls.workphonenumber.errors;
			if (workPhoneValid) {
				this.showWork = true;
			} else {
				this.showWork = false;
			}
		}
		if (this.consumerForm) {
			homePhoneValid =
				this.consumerForm.controls.homephonenumber.value &&
				!this.consumerForm.controls.homephonenumber.errors;
			if (homePhoneValid) {
				this.showHome = true;
			} else {
				this.showHome = false;
			}
		}
		if (!this.showWork && this.consumerForm.value.preferredcontact === "work") {
			this.consumerForm.controls.preferredcontact.reset();
		}
		if (!this.showHome && this.consumerForm.value.preferredcontact === "home") {
			this.consumerForm.controls.preferredcontact.reset();
		}
	}

	removeWorkPhoneNumber(event) {
		const contactType = this.consumerForm.getRawValue()["preferredcontact"];
		if (event) {
			this.showWork = false;
			this.consumerForm.controls.preferredcontact.reset();
		}
		this.consumerForm.patchValue({ preferredcontact: contactType });
	}

	togglePreferredContact(value: string) {
		this.consumerForm.patchValue({ preferredcontact: value });
	}

	onHomePhoneNumberChange() {
		this.consumerForm.get("homephonenumber").valueChanges.subscribe(() => {
			this.updatePreferredContact();
		});
	}

	onDedupeClick() {
		this.notificationSvc.displayToast(
			"success",
			"Document uploaded",
			"You may proceed further with the application.",
			5000
		);
		this.isDedupeClicked = true;
		this.showContinueAndSave.emit(this.isDedupeClicked);
	}

	AddRelationShipData() {
		let consumerData1 = this.consumerForm.value;
		let rowDat = {
			fullName: consumerData1.firstname + " " + consumerData1.lastname,
			nationalityNumber: consumerData1.nationality,
			owner: consumerData1.relationship.isbeneficialowner ? "Yes" : "No",
			boardofdirector: consumerData1.relationship.issignificantcontroller ? "Yes" : "No",
			ubo: consumerData1.relationship.isbeneficialcontroller ? "Yes" : "No",
			authroizedSignatory: consumerData1.relationship.isauthorized ? "Yes" : "No",
			PoA: consumerData1.relationship.ispowercontroller ? "Yes" : "No",
			keycitizen: consumerData1.keycitizen ? "Yes" : "No",
		};
		this.paramterArray.push(rowDat);
	}
}
