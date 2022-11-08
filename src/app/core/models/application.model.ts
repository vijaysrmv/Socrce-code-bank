/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen OAO
Application            : 		Newgen OAO
Module                 :		Consumer OAO
File Name              : 	    personal-details.model.ts
Author                 : 		Amir Masood
Date (DD/MM/YYYY)      : 		31/01/2019
Description            : 		models
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import { Product } from './product.model';
import { DueDiligenceQuestionnaire } from './due-diligence-questionnaire.model';

export interface ApplicationDetails {
	arn?: string;
	applicationtype?: string;
	isolb?: boolean;
	accountnumber?: string;
	jointcount?: number;
	personaldetails?: ApplicantDetails;
	jointdetails?: Array<ApplicantDetails>;
	beneficiarydetails?: Array<BeneficiaryDetails>;
	businessdetails?: BusinessDetails;
	additionalresponsibledetails?: ApplicantDetails;
	responsibledetails?: Array<ApplicantDetails>;
	authorizedsigner?: ApplicantDetails;
	additionalbusinessdetails?: AdditionalBusinessDetails;
	uistate?: string;
	updateuistate?: boolean;
	products?: Array<Product>;
	productservices?: any;
	qualifications?: Qualifications;
	businessQualifications?: BusinessQualifications;
	hashcode?: string;
	counterOfferDetails?: CounterOfferDetails;
	existing?: boolean;
	workitem?: string;
	additionaldetails?: Array<DueDiligenceQuestionnaire>;
	consumerDueDiligence?: any;
}

export interface ApplicantDetails {
	pid?: number;
	firstname?: string;
	middlename?: string;
	lastname?: string;
	title?: string;
	suffix?: string;
	dob?: any;
	ssn?: string;
	restrictedcustomer?: boolean;
	gender?: string;
	primaryphonenumber?: any;
	phonetype?: string;
	email?: string;
	confirmEmail?: string;
	mothermaiden?: string;
	uscitizen?: boolean;
	country?: string;
	countryname?: string;
	identification?: Identification;
	physicaladdress?: Address;
	previousaddress?: Address;
	mailingaddress?: Address;
	address?: Array<Address>;
	employment?: Employment;
	preferredcontact?: string;
	learnaboutus?: string;
	referredemployeename?: string;
	mailingsameasphysical?: boolean;
	idscantype?: string;
	significantresponsibility?: boolean;
	addresssameasprimary?: boolean;
	applicanttype?: string;
	holdingcreditcard?: boolean;
	documents?: Document[];
	relationship?: Relationship;
}

export interface Relationship {
	isauthorized?: boolean;
	isbeneficialowner?: boolean;
	issignificantcontroller?: boolean;
}

export interface Qualifications {
	qualificationtype: string;
	zipcode?: string;
	collegetype?: string;
	memberDetails?: MemberDetails;
	otherselection?: string;
}

export interface BusinessQualifications {
	businessorignation: string;
	ownershipstructure: string;
	restrictedcategories: boolean;
	intermediary: boolean;
	existingbusinessmember: boolean;
}

export interface MemberDetails {
	firstname: string;
	middlename?: string;
	lastname: string;
	relation: string;
}

export interface BeneficiaryDetails {
	pid: number;
	firstname: string;
	middlename: string;
	lastname: string;
	dob?: any;
	ssn?: string;
	primaryphonenumber: number;
	numberandstreet?: string;
	aptorsuite?: string;
	zipcode?: string;
	city?: string;
	state?: string;
	relationship: string;
	memberrelationvalue?: string;
}

export interface BusinessDetails {
	applicanttype?: string;
	pid?: number;
	businessname?: string;
	taxid?: string;
	taxtype?: string; // extra
	phonetype?: string;
	businessformationdate?: string;
	businessphonenumber?: number;
	extension?: number;
	emailaddress?: string;
	businesswebsite?: string;
	businesscategory?: string;
	subbusinesscategory?: string;
	businesstype?: string;
	businessaddress?: Array<Address>;
	businessOwnerList?: Array<Ownership>;
	ownershipstructure?: string;
	restrictedcategories?: boolean;
}

export interface Ownership {
	name: string;
	percent: number;
}

export interface Identification {
	type: string;
	number: string;
	issuestate: string;
	issuecountry?: string;
	issuedate: any;
	expirydate: any;
	idtypedescription?: string;
}

export interface Address {
	addresstype?: string;
	numberandstreet?: string;
	aptorsuite?: string;
	zipcode?: string;
	city?: string;
	state?: string;
}

export interface Employment {
	employmentstatus?: string;
	employername?: string;
	occupation?: string;
	workphonenumber?: number;
	extension?: number;
	incomelist?: Array<IncomeList>;
	empdurationyear?: string;
	empdurationmonth?: string;
	previousemployername?: string;
	previousoccupation?: string;
	management?: string;
}

export interface IncomeList {
	incomesource?: string;
	grossmonthlyincome?: number;
}

export interface Document {
	data?: string;
	doctype?: string;
	fileextension?: string;
	name?: string;
	pagetype?: string;
	omnidocskey?: string;
	user?: string;
	docpurpose: string;
	docid?: number;
	applicanttype: string;
	pid: number;
}

export interface DocResponse {
	arn: string;
	applicationdocuments: Array<Document>;
}

export interface SelectedProduct {
	productid: string;
	dividendtype?: string;
	dividendamount?: number;
	cdterm?: number;
	termunit?: string;
	interest?: string;
	plantype?: string;
	contributiontype?: string;
	disabled?: boolean;
}

export interface Account {
	id: string;
	account_no: string;
}

export interface DocumentType {
	id: string;
	documenttype: string;
}

export interface AdditionalBusinessDetails {
	additionalbusinessquestions: AdditionalDetails;
	monthlyActivity: MonthlyActivity;
}

export interface AdditionalDetails {
	accountpurpose?: string;
	describepurpose?: string;
	charityanswer?: boolean;
	selectcountry?: Country[];
	cash: boolean;
	ach: boolean;
	check: boolean;
	wire: boolean;
}

export interface MonthlyActivity {
	depositcount?: number;
	withdrawalcount?: number;
	cashinamount?: number;
	cashoutamount?: number;
	checkinamount?: number;
	checkoutamount?: number;
	achinamount?: number;
	achoutamount?: number;
	wireinamount?: number;
	wireoutamount?: number;
	internationalwireinamount?: number;
	internationalwireoutamount?: number;
	iwicountry?: string[];
	iwocountry?: string[];
}

export interface AccountActivity {
	ach?: boolean;
	cash?: boolean;
	wire?: boolean;
	domesticwire?: boolean;
	internationalwire?: boolean;
	check?: boolean;
}

export interface TyfoneDetails {
	type: string;
	details: string;
	cts: string;
	olb?: boolean;
	products?: Array<SelectedProduct>;
	signedmsg: string;
	applicationtype?: string;
	uisate?: string;
}

export interface TyfoneResponse {
	type: String;
	details: String;
	cts: string;
	olb: boolean;
	products: Array<string>;
	signedmsg: string;
	applicationtype: string;
	uistate: string;
	agerange: string;
}

export interface Country {
	// id: string;
	country_code: string;
	description: string;
}

export interface CounterOfferDetails {
	counterofferamount: string;
	counterofferrate: string;
	counterofferterm: string;
	counterofferby: string;
	offereddate: string;
}
