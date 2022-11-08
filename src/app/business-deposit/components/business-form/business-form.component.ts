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
	OnInit,
	Input,
	EventEmitter,
	Output,
	ViewChild,
	AfterViewInit,
	ChangeDetectorRef,
} from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from "@angular/forms";
import { IMyDpOptions, IMyInputFieldChanged } from "mydatepicker";

import { AddressComponent } from "../../../shared/components/address/address.component";

import { MdmService } from "../../../core/apis/mdm.service";
import { UspsService } from "../../../core/apis/usps.service";
import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { ApplicationError } from "../../../core/error-handler/error-handler.service";
import { DataService } from "../../../core/services/data.service";
import { FormUtilityService } from "../../../core/services/form-utility.service";
import { CustomValidation } from "../../../core/utility/custom-validations";
import { SharedMdmService } from "../../../shared/services/shared-mdm.service";
import { NotificationService } from "./../../../core/services/notification.service";

import { BusinessDetails } from "../../../core/models/application.model";
import {
	BusinessSubType,
	BusinessType,
	BusinessCategory,
	OwnershipStructure,
	BusinessPhoneType,
} from "../../../core/models/fields-value.model";
import { ZipDetails } from "../../../core/models/usps-response.model";

@Component({
	selector: "business-form",
	templateUrl: "./business-form.component.html",
	styleUrls: ["./business-form.component.scss"],
	providers: [MdmService],
})
export class BusinessFormComponent {
	@ViewChild("physicalAddress", { static: false }) physicalAddress: AddressComponent;
	@ViewChild("mailingAddress", { static: false }) mailingAddress: AddressComponent;

	@Input() reviewPage = false;
	@Output() save = new EventEmitter();
	@Output() patchBusinessData = new EventEmitter();

	businessCategory: Array<BusinessCategory>;
	businessPhoneType: Array<BusinessPhoneType>;
	businessTypes: Array<BusinessType>;
	businessSubTypes: Array<BusinessSubType>;
	ownershipStructure: Array<OwnershipStructure>;
	// selectedSubType: string;
	ownershipStructureData: string;
	ownershippercentage: FormArray;
	sameMailingAddress = true;
	checkingProduct = false;
	// percentList: any[] = [];
	businessForm: FormGroup;
	businessData: any;
	// edit: any;
	interval: any;
	address: Array<any>;

	editableSection = "";
	editBusinessDetails: boolean;
	editPhysicalAddress: boolean;
	editMailingAddress: boolean;
	editOwnershipPercent: boolean;
	editContactInfo: boolean;
	validationError: boolean;

	// ownershipSum: any;
	businessSubCategoryText: string;
	viewComplete = false;

	dateMask = CustomValidation.dateMask;
	phoneMask = CustomValidation.phoneMask;
	taxIDMask = CustomValidation.ssnMask;
	percentMask = CustomValidation.percentageMask;
	datePattern = CustomValidation.getPattern("datePattern");
	phonePattern = CustomValidation.getPattern("phoneNumberPattern");
	taxIDPattern = CustomValidation.getPattern("ssnPattern");
	hideBusinessTaxIdType: boolean;
	// minOwnership = 20;
	businessFormationOptions: IMyDpOptions = CustomValidation.businessFormationOptions;
	dateInvalid = false;
	isZipValid = false;
	countries = [
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
	primaryIndustry = [
		"ACCOUNTING, AUDITING, TAX AND LEGAL ACTIVITIES",
		"ACCOUNTING, BOOK -KEEPING AND AUDITING ; TAX CONSULTANCY",
		"ACTIVITIES AUXILIARY TO FINANCIAL INTERMEDIATION",
		"ACTIVITIES AUXILIARY TO INSURANCE AND PENSION FUNDING",
		"ACTIVITIES OF BUSINESS AND EMPLOYERS ORGANISATIONS",
		"ACTIVITIES OF MORTGAGE FINANCE COMPANIES",
		"ACTIVITIES OF OTHER MEMBERSHIP ORGANISATIONS NOT ELSEWHERE CLASSIFIED",
		"ACTIVITIES OF RELIGIOUS ORGANISATIONS",
		"ADMINISTRATION OF BUILDINGS AND OTHER REAL ESTATE",
		"ADMINISTRATION OF FINANCIAL MARKETS",
		"ADULT AND OTHER EDUCATION NOT ELSEWHERE CLASSIFIED",
		"ADVERTISING",
		"ADVERTISING REQUISITES TRADING",
		"AEROSPACE TRAINING SERVICE PROVIDERS (NON-MILITARY RELATED)",
		"AEROSPACE TRAINING SERVICE PROVIDERS MILITARY RELATED UAE GHQ ONLY",
		"AGRICULTURAL COMMODITIES MANUFACTURER AND DEALERS",
		"AGRICULTURE",
		"ALL OTHER",
		"AMUSEMENT EQUIPMENT & SUPPLIES TRADING",
		"ANCILLARY SERVICES FOR ENERGY INDUSTRY",
		"ANIMAL BY -PRODUCT PROCESSING",
		"ARCHITECTURAL ,ENGINEERING AND TECHNICAL CONSULTANCY",
		"AUCTION HOUSES",
		"BANK",
		"BASIC METAL PRODUCTS & ALUMINIUM MANUFACTURE",
		"BOOKBINDING AND FINISHING",
		"BOTANICAL AND ZOOLOGICAL GARDENS",
		"BRIDGE FINANCE- HOUSE PURCHASE",
		"BRIDGES TUNNELS CONSTRUCTION",
		"BUILDING AND REPAIRING OF SHIPS AND BOATS",
		"BUILDING SOCIETIES",
		"BUSINESS AND MANAGEMENT CONSULTANCY ACTIVITIES",
		"BUTTER AND CHEESE PRODUCTION",
		"BUYING AND SELLING OF OWN REAL ESTATE",
		"CAMPING SITES",
		"CANTEENS AND CATERING",
		"CARGO HANDLING",
		"CASTING OF IRON",
		"CASTING OF METALS",
		"CENTRAL BANK",
		"CHARITABLE & NON PROFIT MAKING ORGANISATIONS",
		"CHEMICAL EXCLUDING PETROL MANUFACTURE",
		"CIVIL ENGINEERING",
		"CLEANING OF BUILDING",
		"CLEARING & FORWARDING",
		"COLLECTION AGENCIES",
		"COLLECTION, PURIFICATION AND DISTRIBUTION OF WATER",
		"COMMERCIAL CONTRACTORS NON BLDG",
		"COMPOSITION AND PLATE- MAKING",
		"COMPUTER HARDWARE CONSULTANCY",
		"COMPUTER RELATED ACTIVITIES OTHER",
		"COMPUTER SOFTWARE CONSULTANCY AND SUPPLY",
		"CONSTRUCTION MATERIALS  BRICK ,TILE ,ETC",
		"CONSTRUCTION OF BUILDING",
		"CONSTRUCTION OF HIGHWAYS, ROADS ,AIRFIELDS AND SPORT FACILITIES",
		"CONSTRUCTION OF WATER PROJECTS",
		"CONSTRUCTION OF WORKS OF ART",
		"COURIER ACTIVITIES OTHER THAN NATIONAL POST ACTIVITIES",
		"CRAFT AND HANDICRAFTS RELATED ACTIVITIES",
		"CRYPTOCURRENCIES",
		"CUSTOMER SERVICE PROVIDERS (SALES ,TELESALES ETC)",
		"DATA BASE ACTIVITIES",
		"DATA PROCESSING",
		"DEALERS IN LUXURY GOODS",
		"DEALERS IN PRECIOUS METALS AND STONES",
		"DEALERS OF PRECIOUS METALS ,STONES AND DIAMONDS JEWELLERY",
		"DEMOLITION AND WRECKING OF BUILDINGS ;EARTH MOVING",
		"DENTAL PRACTICE",
		"DEVELOPMENT AND SELLING OF REAL ESTATE",
		"DEVELOPMENT OF COMMERCIAL REALTY",
		"DEVELOPMENT OF PERSONAL VILLAS ,BUNGALOWS ,AND APARTMENTS",
		"DRIVING SCHOOL ACTIVITIES",
		"DRONES MANUFACTURING",
		"DRONES TRADING",
		"EDUCATION AND SCIENTIFIC RESEARCH INSTITUTES",
		"EDUCATIONAL SERVICES",
		"ELECTRICITY GENERATION",
		"ELECTRICITY TRANSMISSION, DISTRIBUTION AND SUPPLY",
		"EMBASSIES AND CONSULATES SERVICES -DOMESTIC",
		"EMBASSIES AND CONSULATES SERVICES -FOREIGN",
		"EMIRATE GOVERNMENT",
		"ENTERTAINMENT/AMUSEMENT COMPANIES PERFORMING ARTS PROFESSIONALS",
		"ERECTION OF ROOF COVERING AND FRAMES",
		"EVENT MANAGEMENT",
		"EXTRACTION OF CRUDE PETROLEUM AND NATURAL GAS",
		"EYE CARE & OPTICAL TRADING",
		"FABRICATED METAL PRODUCTS MANUFACTURE",
		"FACTORING",
		"FAIRS AND AMUSEMENT PARKS",
		"FARMING ANIMALS OTHERS",
		"FARMING OF CATTLE ,DAIRY FARMING",
		"FARMING OF POULTRY",
		"FARMING OF SHEEP ,GOATS ,HORSES, ASSES, MULES AND HINNIES",
		"FAST MOVING CONSUMER GOODS FMCG & APPARELS",
		"FEDERAL GOVERNMENT",
		"FEDERAL INVESTMENT INSTITUTIONS",
		"FINANCIAL INSTITUTIONS OTHER THAN BANKS",
		"FINANCIAL INTERMEDIATION OTHER",
		"FINANCIAL LEASING",
	];
	sectorOfCustomer = [
		"BANK BRANCHES",
		"BANKS",
		"BOARD OF DIRECTORS",
		"BROKERS & FINAN ADVISERS",
		"BUILDING SOCIETY",
		"CENTRAL BANK",
		"CENTRAL MONETARY INSTITUTIONS",
		"CENTRAL/FEDERAL GOVERNMENT",
		"COMMERCIAL - FEDERAL",
		"COMMERCIAL - STATE/EMIRATE",
		"COMMERCIAL BANK",
		"COMMERCIAL BANKS - CLEARING HOUSE",
		"CORRESPONDENT BANKS",
		"CREDIT CARD SECURITY CHEQUE",
		"DIPLOMAT",
		"EMPLOYEE BANKING ELITE",
		"EMPLOYEE BANKING PERSONAL",
		"EMPLOYEE BANKING PREMIUM",
		"EMPLOYEE BANKING STANDARD",
		"EX-STAFF",
		"FGB - STAFF",
		"FGS STAFF",
		"FINANCE COMPANY",
		"FINANCIAL CORPORATIONS",
		"FINANCIAL INTERMEIATION",
		"FINANCIAL QUASI-CORPORATIONS",
		"GOVERNMENT BANK",
		"INSURANCE COMPANIES",
		"INSURANCE COMPANY",
		"INTERCOMPANY ACCOUNTS",
		"INTERNATIONAL ORGANISATION",
		"INVESTMENT COMPANY",
		"INVESTMENT IN SUBSIDIARIES",
		"LEASING AND HIRE PURCHASE",
		"LOCAL/MUNICIPAL GOVERNMENT",
		"MONETARY FINANCIAL INSTITUTIONS",
		"NO COMMERCIAL - STATE/EMIRATE",
		"NON EMPLOYEE BANKING SAL TRF",
		"NON PROFIT ORGANISATION",
		"NON RESIDENT OFFICES",
		"NON RESIDENT PRIVATE INDIVIDUALS",
		"NON RESIDENTS",
		"OFF SHORE BANKING UNIT",
		"OTHER FINANCIAL",
		"OTHER FINANCIAL INSTITUTIONS",
		"OTHER NON RES BANKS",
		"PARTNERSHIP",
		"PERSONAL/INDIVIDUAL",
		"POSTAL OFFICE",
		"PRIVATE LOCAL COMPANY",
		"PRIVATE MULTIONATIONAL COMPNAY",
		"PRIVATE NATIONAL COMPANY",
		"PUBLIC CORPORATIONS",
		"PUBLIC LOCAL COMPANIES",
		"PUBLIC MULTINATIONAL COMPANY",
		"PUBLIC NATIONAL COMPANIES",
		"PUBLIC SECTOR COMPANIES",
		"PUBLIC/CORPORATIONS",
		"RESERVED",
		"RESERVED",
		"SOLE PROPRETORSHIP",
		"STAFF-ASSOCIATES",
		"STAFF-MARKETING OUTSOURCE CO.S",
		"STAFF-RELATED PARTIES & AFFILIATES",
		"STAFF-SUBSIDIARIES",
		"STATE/PROVINCIAL GOVERNMENT",
		"SUBSIDIARIES",
		"SUBSIDIARIES - BANKING INSTUTIONS",
		"SUBSIDIARIES-OTHERS",
		"SUNDRY",
		"T24 UPDATES",
		"THIRD PARTY CORRESPONDENTS",
	];
	identificationType: any[] = [
		"CERTIFICATE OF INCORPORATION",
		"CERTIFICATE OF INCUMBENCY",
		"COMMERCIAL REGISTRATION NUMBER",
		"DRIVING LICENSE",
		"EMIRATES ID",
		"GOOD STANDING CERTIFICATE",
		"KHULASAT - AL - QAID",
		"LABOUR CARD",
		"NATIONAL ID",
		"PASSPORT",
		"TRADE LICENSE",
		"VAT",
		"VISA",
	];

	accountClassification = ["Standard", "Sub-Standard", "Doubtful", "Loss"];
	inputElementArray: any[] = [
		{
			name: "Facility Type",
			id: "facilityType",
			type: "select",
			arrayName: "identificationType",
		},
		{
			name: "Loan No.",
			id: "loanNumber",
			type: "text",
		},
		{
			name: "Existing Limit Amount",
			id: "limitAmount",
			type: "text",
		},
		{
			name: "Limit Outstanding",
			id: "limitOutStanding",
			type: "text",
		},
		{
			name: "Tenor (Months)",
			id: "TenureInMonth",
			type: "text",
		},
		{
			name: "Bank / Financial Institution Name",
			id: "bankFinancial",
			type: "text",
		},
		{
			name: "Maturity Date",
			id: "maturityData",
			type: "date",
		},
	];

	constructor(
		private dataService: DataService,
		private formUtilityService: FormUtilityService,
		private mdmService: MdmService,
		private businessFormBuilder: FormBuilder,
		private pageLoaderSvc: PageLoaderService,
		private sharedMdm: SharedMdmService,
		private usps: UspsService,
		private cdr: ChangeDetectorRef,
		private notificationSvc: NotificationService
	) {}

	paramterArray: any[] = [];
	paramterArray1: any[] = [];

	buisnessArrayFormCopy: FormGroup;

	addDataToOtherBank() {
		this.paramterArray1.push(this.businessForm.value);
		console.log(this.paramterArray1);
		this.businessForm.reset();
	}

	addDataToTable() {
		console.log(this.paramterArray);
		console.log(this.buisnessArrayFormCopy);
		this.paramterArray.push(this.businessForm.value);
		console.log(this.paramterArray);
		this.businessForm.reset();
	}

	ngOnInit() {
		this._createForm();
		this._getInitialFieldData();
		this._initReview();

		this.businessForm = new FormGroup({
			bank_name: new FormControl(""),
			since_date: new FormControl(""),
			deal_type: new FormControl(""),
			satisfied_type: new FormControl(""),
			remark_Bank_Statement: new FormControl(""),
		});

		this.dataService.editableSection.subscribe((section) => {
			this.editableSection = section;
		});

		this.businessForm.get("taxtype").valueChanges.subscribe((value) => {
			if (value === "EIN") {
				this.taxIDMask = CustomValidation.tinMask;
				let ein = this.businessForm["controls"].taxid.value;
				this.businessForm["controls"].taxid.reset();
				this.businessForm["controls"].taxid.setValidators(CustomValidation.ein);
				if (ein && ein.length > 0) {
					ein = ein.replace(/-/g, "");
					ein = [ein.slice(0, 2), "-", ein.slice(2, 9)].join("");
					this.businessForm["controls"].taxid.patchValue(ein);
				}
			}
			if (value === "SSN") {
				this.taxIDMask = CustomValidation.ssnMask;
				let ssn = this.businessForm["controls"].taxid.value;
				this.businessForm["controls"].taxid.reset();
				this.businessForm["controls"].taxid.setValidators(CustomValidation.ssn);
				if (ssn && ssn.length > 0) {
					ssn = ssn.replace(/-/g, "");
					ssn = [ssn.slice(0, 3), "-", ssn.slice(3, 5), "-", ssn.slice(5, 9)].join("");
					this.businessForm["controls"].taxid.patchValue(ssn);
				}
			}
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
	}

	ngAfterViewInit() {
		this.viewComplete = true;
		// setTimeout(() => {
		// 	this.patchBusinessData.emit(this);
		// }, 1000);
	}

	private _createForm() {
		this.businessForm = new FormGroup({
			facilityType: new FormControl(""),
			loanNumber: new FormControl(""),
			limitAmount: new FormControl(""),
			limitOutStanding: new FormControl(""),
			TenureInMonth: new FormControl(""),
			bankFinancial: new FormControl(""),
			maturityData: new FormControl(""),
			addressType: new FormControl(""),
			buildingNumber: new FormControl(""),
			buildingName: new FormControl(""),
			streetName: new FormControl("Om Sai Nagar"),
			nearestLandmark: new FormControl(""),
			locationArea: new FormControl(""),
			townCity: new FormControl(""),
			zipcode: new FormControl(""),
			pobox: new FormControl(""),
			pmNumber: new FormControl(""),
			smNumber: new FormControl(""),
			emailId: new FormControl(""),
			accountClassification: new FormControl(""),
		});
	}

	hideTaxType(ownershipselected: string) {
		if (ownershipselected === "4") {
			this.hideBusinessTaxIdType = false;
		} else if (ownershipselected === "2") {
			this.hideBusinessTaxIdType = true;
			this.toggleTaxIdType("SSN");
		} else {
			this.hideBusinessTaxIdType = true;
			this.toggleTaxIdType("EIN");
		}
	}

	createOwnershipPercentageForm(responsibleDetails: any) {
		const ownerPercentFormArray = this.businessForm.get("ownershippercentage") as FormArray;
		responsibleDetails.forEach((individual) => {
			if (individual.relationship.isbeneficialowner) {
				ownerPercentFormArray.push(this.pushFormControl(individual));
			}
		});
		this.setMinOwnership();
	}

	pushFormControl(individual) {
		return this.businessFormBuilder.group({
			pid: new FormControl(individual.pid),
			name: new FormControl(`${individual.firstname} ${individual.lastname}`),
			applicanttype: new FormControl(individual.applicanttype),
			percentage: new FormControl("", {
				validators: [Validators.required],
				updateOn: "blur",
			}),
		});
	}

	setMinOwnership() {
		const formArray = this.businessForm.get("ownershippercentage") as FormArray;
		// console.log(formArray);
		formArray.getRawValue().forEach((data, index) => {
			const percentControl = formArray.get("" + index)["controls"].percentage;
			percentControl.setValidators(this.minOwnershipValidator);
		});
	}

	private _ownershipPercentageValidator(businessForm: FormGroup) {
		const formArray = businessForm.get("ownershippercentage") as FormArray;
		let individualError = false;
		for (let i = 0; i < formArray.length; i++) {
			const ownerPercent = formArray.get(i + "." + "percentage");
			if (ownerPercent.hasError("minownership")) {
				individualError = true;
				return;
			}
		}
		const sum = businessForm
			.get("ownershippercentage")
			.value.reduce((a, b) => a + parseFloat(b.percentage), 0);
		if (sum === 0) {
			return { invalidtotal: true };
		}
		if (sum) {
			if (sum > 100) {
				for (let i = 0; i < formArray.length; i++) {
					const ownerPercent = formArray.get(i + "." + "percentage");
					if (!ownerPercent.hasError("minownership")) {
						ownerPercent.setErrors({ invalidtotal: true });
					}
				}
				return { invalidtotal: true };
			} else {
				for (let i = 0; i < formArray.length; i++) {
					formArray["controls"][i]["controls"].percentage.setErrors(null);
				}
				return null;
			}
		}
	}

	minOwnershipValidator(percentControl: FormControl) {
		if (!percentControl.value) {
			return { required: true };
		}
		return parseInt(percentControl.value, 10) < 25 ? { minownership: true } : null;
	}

	private _initReview() {
		if (this.reviewPage) {
			this.editBusinessDetails = false;
			this.editPhysicalAddress = false;
			this.editMailingAddress = false;
			this.editOwnershipPercent = false;
			this.editContactInfo = false;
		} else {
			this.editBusinessDetails = true;
			this.editPhysicalAddress = true;
			this.editMailingAddress = true;
			this.editOwnershipPercent = true;
			this.editContactInfo = true;
		}
	}

	dateValidation(date: IMyInputFieldChanged) {
		const field = this.businessForm["controls"]["businessformationdate"];
		if (field && field.value && date.value !== field.value) {
			field.setErrors({ invalid: true });
		}
	}

	onDateChanged(date: IMyInputFieldChanged | any) {
		if (date !== null && typeof date === "object") {
			date = date.formatted;
		}
		const dateValue = new Date(date);
		const datePicker = {
			date: { year: dateValue.getFullYear(), month: dateValue.getMonth() + 1, day: dateValue.getDate() },
		};
		const resetdatePicker = { date: { year: 0, month: 0, day: 0 } };
		let resetPicker: boolean;
		const field = this.businessForm["controls"]["businessformationdate"];
		this.dateInvalid = this._getDateInvalidity(date);
		if (
			(date &&
				(!(dateValue instanceof Date) || isNaN(dateValue.getTime()) || dateValue.getFullYear() < 1901)) ||
			this._getDateInvalidity(date)
		) {
			this.dateInvalid = true;
		} else {
			this.dateInvalid = false;
		}
		this.dateInvalid && field.value ? field.setErrors({ invalid: true }) : field.setErrors(null);
		this.businessForm.patchValue({ businessformationdate: date });
		resetPicker = this.dateInvalid || !date ? true : false;
		this.businessForm.patchValue({ businessformationdatePicker: resetPicker ? resetdatePicker : datePicker });
	}

	private _getDateInvalidity(date: any): boolean {
		if (date && date.length !== 10) {
			return true;
		}
		const currentDate = new Date().setHours(0, 0, 0, 0);
		const startDate = new Date(date).getTime();
		if (currentDate - startDate >= 0) {
			return false;
		}
		return true;
	}

	resetPhoneNumber() {
		if (this.businessForm.value["businessphonenumber"]) {
			let businessPhone = this.businessForm.value["businessphonenumber"];
			businessPhone = [
				businessPhone.slice(0, 0),
				"(",
				businessPhone.slice(0, 3),
				") ",
				businessPhone.slice(3, 6),
				"-",
				businessPhone.slice(6, 10),
			].join("");
			this.businessForm.patchValue({ businessphonenumber: businessPhone });
		}
	}

	saveData(section) {
		if (section) {
			const dataObj = {
				accounttype: "business",
				form: this,
				section: section,
			};
			if (section === "PhysicalAddress" || section === "MailingAddress") {
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
		}
	}

	refreshForm(section) {
		this.toggleSection(section);
		this.dataService.changeSection("");
		this.businessData = null;
	}

	toggleSectionEdit(section: string) {
		switch (this.editableSection) {
			case "":
				this.getOrUpdateBusinessData(section);
				this.toggleSection(section);
				this.dataService.changeSection(section);
				break;
			case section:
				this.getOrUpdateBusinessData(section);
				this.businessForm.markAsPristine();
				this.businessForm.markAsUntouched();
				this.businessData = null;
				this.toggleSection(section);
				this.dataService.changeSection("");
				break;
			default:
				throw new ApplicationError("1001");
		}
		this.cdr.detectChanges();
	}

	toggleSection(section) {
		this["edit" + section] = !this["edit" + section];
	}

	getOrUpdateBusinessData(section) {
		switch (section) {
			case "PhysicalAddress":
				if (this.businessData) {
					this.physicalAddress.patchData(this.businessData);
				} else {
					this.businessData = this.physicalAddress.addressForm.getRawValue();
				}
				break;
			case "MailingAddress":
				if (this.businessData) {
					this.mailingAddress.patchData(this.businessData);
				} else {
					this.businessData = this.mailingAddress.addressForm.getRawValue();
				}
				break;
			default:
				if (this.businessData) {
					this.businessForm.patchValue(this.businessData);
				} else {
					this.businessData = this.businessForm.getRawValue();
				}
		}
	}

	getBusinessTypeText(val: string) {
		let title: string = null;
		if (this.businessTypes !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				this.businessTypes.forEach((obj) => {
					if (obj.code === val) {
						title = obj.title;
					}
				});
			}
		}
		return title;
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

	private _getInitialFieldData() {
		this.mdmService.getBusinessCategory().subscribe((data: Array<BusinessCategory>) => {
			this.businessCategory = data.sort((a, b) => a.title.localeCompare(b.title));
		});
		this.mdmService.getBusinessPhoneType().subscribe((data: Array<BusinessPhoneType>) => {
			this.businessPhoneType = data;
		});
	}

	setBusinessType(ownershipselected: string) {
		if (this.sharedMdm.ownershipStructure && this.sharedMdm.ownershipStructure.length > 0) {
			this.ownershipStructure = this.sharedMdm.ownershipStructure;
			this.ownershipStructureData = this.getOwnershipStructureText(ownershipselected);
			// this.businessForm.controls['ownershipstructure'].setValue(ownershipstructure);
		} else {
			this.sharedMdm.getOwnershipStructure().subscribe((data: Array<OwnershipStructure>) => {
				this.ownershipStructure = data;
				this.ownershipStructureData = this.getOwnershipStructureText(ownershipselected);
				// this.businessForm.controls['ownershipstructure'].setValue(ownershipstructure);
			});
		}
	}

	onFocusSsn() {
		if (this.businessForm.getRawValue().taxid) {
			this.businessForm.patchValue({ taxid: "" });
			this.businessForm.controls.taxid.setErrors(null);
		}
	}

	onFocusOutSsn() {
		if (!this.businessForm.getRawValue().taxid) {
			this.businessForm.controls.taxid.setErrors({ required: true });
		}
	}

	// togglePhoneType(phoneType: string) {
	// 	if (phoneType) {
	// 		this.businessForm.patchValue({ phonetype: phoneType });
	// 	}
	// }

	toggleTaxIdType(taxType: string) {
		if (taxType) {
			this.businessForm.patchValue({ taxtype: taxType });
		}
	}

	toggleMailingAddress(sameAddress, resetMailingAddress) {
		this.sameMailingAddress = sameAddress;
		if (resetMailingAddress && this.mailingAddress) {
			this.mailingAddress.addressForm.reset();
		}
	}

	checkValidations() {
		this.validationError = false;
		this.validationError = this.formUtilityService.displayValidations(this.businessForm);
		this.validationError = this.formUtilityService.displayValidations(
			this.physicalAddress.addressForm,
			this.validationError
		);
		if (this.mailingAddress) {
			this.validationError = this.formUtilityService.displayValidations(
				this.mailingAddress.addressForm,
				this.validationError
			);
		}
		return this.validationError;
	}

	patchData(data: BusinessDetails) {
		if (data) {
			this.toggleTaxIdType(data.taxtype);
			if (data.businesscategory) {
				this.setBusinessSubCategory(data.businesscategory, data.subbusinesscategory, true);
			}
			this.businessForm.patchValue(data);
			// this.resetPhoneNumber();
			const physicalAddress = this.getPhysicalAddress(data.businessaddress, "physicaladdress");
			const mailingAddress = this.getPhysicalAddress(data.businessaddress, "mailingaddress");
			if (physicalAddress) {
				this.physicalAddress.patchData(physicalAddress[0]);
			}
			if (mailingAddress && (!data["mailingsameasphysical"] || this.reviewPage)) {
				this.toggleMailingAddress(false, false);
				setTimeout(() => {
					this.mailingAddress.patchData(mailingAddress[0]);
				}, 10);
			} else {
				this.toggleMailingAddress(true, false);
			}
		}
		if (!this.reviewPage) {
			this.pageLoaderSvc.hide();
		}
	}

	getPhysicalAddress(address, addresstype) {
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
					delete data["addresstype"];
					return data;
				});
		}
	}

	trim(parentControl, childControl = null) {
		let trimValue;
		const patchObj = {};
		if (childControl) {
			trimValue = this.businessForm.controls[parentControl]["controls"][childControl].value
				? this.businessForm.controls[parentControl]["controls"][childControl].value.trim()
				: null;
			patchObj[childControl] = trimValue;
			this.businessForm.controls[parentControl].patchValue(patchObj);
		} else {
			trimValue = this.businessForm.controls[parentControl].value
				? this.businessForm.controls[parentControl].value.trim()
				: null;
			patchObj[parentControl] = trimValue;
			this.businessForm.patchValue(patchObj);
		}
	}

	standardizeAddress(addressType: string) {
		this.dataService.standardizeCheck.subscribe((data) => {
			if (
				!data ||
				!data.hasOwnProperty("businessdetails" + addressType) ||
				data[addressType + addressType] === true
			) {
				if (this.businessForm["controls"][addressType]["controls"].numberandstreet.valid) {
					const add = this.businessForm["controls"][addressType]["controls"].numberandstreet.value;
					const zip = this.businessForm.controls[addressType]["controls"].zipcode.value;
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
								this.dataService.updateStandarizeAddressStatus("businessdetails", addressType);
								const patchObj = {};
								patchObj[addressType] = { numberandstreet: address };
								this.businessForm.patchValue(patchObj);
							}
						});
					}
				}
			}
		});
	}

	zipLookUp(el, addressType: string) {
		const zipControl = this.businessForm.controls[addressType]["controls"].zipcode;
		if (!zipControl.invalid) {
			this.usps.zipLookup(el.target.value).subscribe((data: ZipDetails) => {
				if (!data["error"]) {
					if (data.state) {
						const patchObj = {
							state: data.state,
							city: data.city,
						};
						this.businessForm.controls[addressType].patchValue(patchObj);
						this.standardizeAddress(addressType);
					} else {
						zipControl.setErrors({ incorrect: true });
					}
				} else {
					zipControl.setErrors({ incorrect: true });
				}
			});
		}
	}

	getbusinessFormDetails() {
		const businessDetails: BusinessDetails = this.businessForm.getRawValue();
		this.address = [];
		if (this.physicalAddress) {
			this.formatAddress(this.physicalAddress.addressForm.getRawValue(), "physicalAddress");
			if (this.sameMailingAddress) {
				this.formatAddress(this.physicalAddress.addressForm.getRawValue(), "mailingAddress");
			} else {
				this.formatAddress(this.mailingAddress.addressForm.getRawValue(), "mailingAddress");
			}
		}
		// businessDetails.ownershipstructure = this.getOwnershipStructureValue(businessDetails.ownershipstructure);
		businessDetails.businessaddress = this.address;
		// businessDetails.businessphonenumber = this.formUtilityService.resetPhoneNumber(businessDetails.businessphonenumber);
		return businessDetails;
	}

	formatAddress(address, type) {
		address["addresstype"] = type;
		this.address.push(address);
	}

	setBusinessSubCategory(id: string, subCategoryId?: string, callBusinessType = false) {
		this.pageLoaderSvc.show(true, false);
		this.businessForm.controls["description"].reset();
		this.businessForm.controls["subbusinesscategory"].reset();
		this.mdmService.getBusinessSubCategory(id).subscribe((data: Array<BusinessType>) => {
			this.businessSubTypes = data.sort((a, b) => a.title.localeCompare(b.title));
			if (callBusinessType) {
				this.setDescription(subCategoryId);
			}
			this.pageLoaderSvc.hide();
		});
	}

	setDescription(id: string) {
		const type = this.businessSubTypes.filter((data) => data.subtypecode === id);
		if (type && type.length > 0) {
			this.businessForm.controls["description"].setValue(type[0].description);
		}
	}

	getBusinessSubCategoryText(val: string) {
		if (this.businessSubTypes !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				this.businessSubTypes.forEach((obj) => {
					if (obj.subtypecode === val) {
						this.businessSubCategoryText = obj.title;
					}
				});
			}
		}
		return this.businessSubCategoryText;
	}

	getBusinessCategoryText(val: string) {
		let title: string = null;
		if (this.businessCategory !== undefined) {
			if (val !== "" && val !== null && val !== undefined) {
				this.businessCategory.forEach((obj) => {
					if (obj.code === val) {
						title = obj.title;
					}
				});
			}
		}
		return title;
	}

	formatNumber(index, value) {
		if (value && !Number.isNaN(value)) {
			this.businessForm.controls["ownershippercentage"]["controls"][index].patchValue({
				percentage: parseFloat(value),
			});
		}
	}

	checkValidationsOnBack() {
		this.validationError = false;
		this.validationError = this.formUtilityService.displayValidations(this.businessForm);
		this.validationError = this.formUtilityService.displayValidations(
			this.physicalAddress.addressForm,
			this.validationError
		);
		if (this.mailingAddress) {
			this.validationError = this.formUtilityService.displayValidations(
				this.mailingAddress.addressForm,
				this.validationError
			);
		}
		return this.validationError;
	}
}
