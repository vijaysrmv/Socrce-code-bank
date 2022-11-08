import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from "@angular/forms";

@Component({
	selector: "app-major-customers-and-supplier",
	templateUrl: "./major-customers-and-supplier.component.html",
	styleUrls: ["./major-customers-and-supplier.component.scss"],
})
export class MajorCustomersAndSupplierComponent implements OnInit {
	constructor() {}
	businessForm: FormGroup;

	customerBuyerArray: any[] = [];
	supplierCreditorArray: any[] = [];

	addDataToCustomerTable() {
		this.customerBuyerArray.push(this.businessForm.value);
		console.log(this.customerBuyerArray);
		this.businessForm.reset();
	}

	addDataToSupplierTable() {
		this.supplierCreditorArray.push(this.businessForm.value);
		console.log(this.supplierCreditorArray);
		this.businessForm.reset();
	}

	ngOnInit() {
		this.businessForm = new FormGroup({
			nameType: new FormControl(""),
			SSN_Tax_ID: new FormControl(""),
			countryOfIncorporation: new FormControl(""),
			DOIFormation: new FormControl(""),
			City_Place: new FormControl(""),
			product_name: new FormControl(""),
			shareInTotalSale: new FormControl(""),
			shareInTotalSaleAmt: new FormControl(""),
		});
	}
}
