import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from "@angular/forms";

@Component({
	selector: "app-declaration",
	templateUrl: "./declaration.component.html",
	styleUrls: ["./declaration.component.scss"],
})
export class DeclarationComponent implements OnInit {
	constructor() {}
	businessForm: FormGroup;

	delclarationArray: any[] = [];

	taxIdentifierType = ["EIN", "GIIN", "SSN", "TIN", "VAT ID"];
	taxResidentOtherCountry = ["True", "False"];
	isReportable = ["True", "False"];
	countryOfTaxResidency = [
		"ARUBA",
		"AFGHANISTAN",
		"ANGOLA",
		"ANGUILLA",
		"AALAND ISLANDS",
		"ALBANIA",
		"ANDORRA",
		"NETHERLANDS ANTILLES",
		"UNITED ARAB EMIRATES",
		"ARGENTINA",
		"ARMENIA",
		"AMERICAN SAMOA",
		"ANTARCTICA",
		"FRENCH SOUTHERN TERRITORIES",
		"ANTIGUA AND BARBUDA",
		"AUSTRALIA",
		"AUSTRIA",
		"AZERBAIJAN",
		"BURUNDI",
		"BELGIUM",
		"BENIN",
		"BURKINA FASO",
		"BANGLADESH",
		"BULGARIA",
		"BAHRAIN",
		"INDIA",
		"UNITED STATES",
	];
	nationality = [
		"ARUBA",
		"AFGHANISTAN",
		"ANGOLA",
		"ANGUILLA",
		"AALAND ISLANDS",
		"ALBANIA",
		"ANDORRA",
		"NETHERLANDS ANTILLES",
		"UNITED ARAB EMIRATES",
		"ARGENTINA",
		"ARMENIA",
		"AMERICAN SAMOA",
		"ANTARCTICA",
		"FRENCH SOUTHERN TERRITORIES",
		"ANTIGUA AND BARBUDA",
		"AUSTRALIA",
		"AUSTRIA",
		"AZERBAIJAN",
		"BURUNDI",
		"BELGIUM",
		"BENIN",
		"BURKINA FASO",
		"BANGLADESH",
		"BULGARIA",
		"BAHRAIN",
		"INDIA",
		"UNITED STATES",
	];
	fatcaStatus = ["Exempted", "Insufficient Data", "Non US Confirmed", "Recalcitrant", "US Confirmed"];
	tinUnavailableReason = [
		"Reason A : Country does not issue TIN",
		"Reason B : Account holder unable to obtain TIN",
		"Reason C : No TIN is required",
		"Applied For",
		"Others",
	];

	addDataTodeclarationTable() {
		this.delclarationArray.push(this.businessForm.value);
		console.log(this.delclarationArray);
		this.businessForm.reset();
	}

	ngOnInit() {
		this.businessForm = new FormGroup({
			entity_name: new FormControl(""),
			taxIdentifierType: new FormControl(""),
			taxIdentificationNumber: new FormControl(""),
			countryOfTaxResidency: new FormControl(""),
			fatcaStatus: new FormControl(""),
			nationality: new FormControl(""),
		});
	}
}
