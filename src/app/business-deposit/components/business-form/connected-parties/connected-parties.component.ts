import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from "@angular/forms";

@Component({
	selector: "app-connected-parties",
	templateUrl: "./connected-parties.component.html",
	styleUrls: ["./connected-parties.component.scss"],
})
export class ConnectedPartiesComponent implements OnInit {
	constructor() {}
	businessForm: FormGroup;

	paramterArray: any[] = [];
	buisnessArrayFormCopy: FormGroup;

	addDataToTable() {
		console.log(this.paramterArray);
		console.log(this.buisnessArrayFormCopy);
		this.paramterArray.push(this.businessForm.value);
		console.log(this.paramterArray);
		this.businessForm.reset();
	}

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
	title = [];
	gender = [];
	country = [];
	residencyStatus = [];
	legalEntityType = [];
	legalEntityCategory = [];

	ngOnInit() {
		this.businessForm = new FormGroup({
			shareholderType: new FormControl(""),
			nameShareholder: new FormControl(""),
			country: new FormControl(""),
			dateIncorporation: new FormControl(""),
			taxID: new FormControl(""),
			shareholdingAmount: new FormControl(""),
			shareholdingPerc: new FormControl(""),
			ownershipStatus: new FormControl(""),
			typeOwnership: new FormControl(""),
			title: new FormControl(""),
			firstName: new FormControl(""),
			lastName: new FormControl(""),
			gender: new FormControl(""),
			maritalStatus: new FormControl(""),
			maiden: new FormControl(""),
			dob: new FormControl(""),
			countryOfBirth: new FormControl(""),
			place: new FormControl(""),
			nationality: new FormControl(""),
			otherNationality: new FormControl(""),
			countryResidence: new FormControl(""),
			residencyStatus: new FormControl(""),
			mobileNumber: new FormControl(""),
			legalEntityType: new FormControl(""),
			legalEntityCategory: new FormControl(""),
			shareholdingAmount1: new FormControl(""),
			shareholdingPerc1: new FormControl(""),
		});
	}
}
