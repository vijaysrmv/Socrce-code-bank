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


import {map} from 'rxjs/operators';
import { Injectable, Inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BackendService } from '../backend/backend.service';

import { AppConfig } from '../../app.config';
// import { BusinessDisclosure } from '../models/disclosure.model';
import {
	// PhoneType,
	// IdType,
	// BusinessType,
	// Ownership,
	// EligibleAffliations,
	// TransactionCount,
	// OccupancyStatus,
	BusinessCategory,
	BusinessSubType,
	States,
	Relationship,
	OwnershipStructure,
	HighRiskBusiness,
	TransactionRange,
	GeneralPurpose,
	Country,
	LearnAboutUs,
	BusinessPhoneType,
} from '../models/fields-value.model';
import { Product, Services } from '../models/product.model';


@Injectable()
export class MdmService {

	private API = AppConfig.settings.API_ENDPOINT_GATEWAY + 'mdm/';
	// private API = 'http://137.116.127.59:5000/api/mdm/';

	constructor(
		@Inject(BackendService) private _backend: BackendService,
		private currency: CurrencyPipe,
	) { }

	getZipData(zipcode: string): Observable<Array<any>> {
		return this._backend.backendRequest(`${this.API}zipcode/${zipcode}`, 'get').pipe(map(data => data.body));
	}

	getProducts(type: any): Observable<Array<Product>> {
		return this._backend.backendRequest(this.API + type, 'get').pipe(map(data => data.body));
	}

	getInterestRates() {
		return this._backend.backendRequest(this.API + 'certificateDeposit', 'get').pipe(map(data => data.body));
	}

	getProductsById(ids: Array<string>, applicationType: string): Observable<Array<Product>> {
		const params = new HttpParams().set('productid', `${ids}`);
		return this._backend.backendRequest(this.API + 'products/search/' + applicationType + '/productbyids', 'get', null, params).pipe(map(data => data.body ? <Array<Product>>data.body : []));
	}

	getBusinessCategory(): Observable<Array<BusinessCategory>> {
		return this._backend.backendRequest(this.API + 'businessCategories', 'get').pipe(map(data => data.body));
	}

	getBusinessPhoneType(): Observable<Array<BusinessPhoneType>> {
		return this._backend.backendRequest(this.API + 'phonetype', 'get').pipe(map(data => data.body));
	}

	// getRestrictedCategories(): Observable<Array<BusinessType>> {
	// 	return this._backend.backendRequest(this.API + 'restrictedCategories', 'get').map(data => data.body);
	// }

	getBusinessSubCategory(id: string): Observable<Array<BusinessSubType>> {
		return this._backend.backendRequest(this.API + 'subcategory/' + id, 'get').pipe(map(data => data.body));
	}

	getStates(): Observable<Array<States>> {
		return this._backend.backendRequest(this.API + 'state', 'get').pipe(map(data => data.body));
	}

	// getOwnershipOptions(): Observable<Array<Ownership>> {
	// 	return this._backend.backendRequest(this.API + 'ownership', 'get').map(data => data.body);
	// }

	getOwnershipStructure(): Observable<Array<OwnershipStructure>> {
		return this._backend.backendRequest(this.API + 'ownership', 'get').pipe(map(data => data.body));
	}

	getHighRiskBusiness(): Observable<Array<HighRiskBusiness>> {
		return this._backend.backendRequest(this.API + 'highRiskBusiness', 'get').pipe(map(data => data.body));
	}

	getRelationship(): Observable<Array<Relationship>> {
		return this._backend.backendRequest(this.API + 'relationship', 'get').pipe(map(data => data.body.sort((a, b) => a.DisplayOrder < b.DisplayOrder)));
	}

	getEmploymentStatus() {
		return this._backend.backendRequest(this.API + 'employment', 'get').pipe(map(data => data.body));
	}

	// getTransactionCount(): Observable<Array<TransactionCount>> {
	// 	return this._backend.backendRequest(this.API + 'count', 'get').map(data => data.body);
	// }

	getTransactionRange(): Observable<Array<TransactionRange>> {
		// return this._backend.backendRequest(this.API + 'range', 'get').map(data => data.body);
		return this._backend.backendRequest(this.API + 'range', 'get').pipe(map(data => {
			return data.body.map(range => {
				const rangeValue = this.currency.transform(range.max, 'USD') ? (this.currency.transform(range.min, 'USD') + ' - ' + this.currency.transform(range.max, 'USD')) : (this.currency.transform(range.min, 'USD') + ' +');
				return { id: range.id, range: rangeValue };
			});
		}));
	}

	getGeneralPurpose(): Observable<Array<GeneralPurpose>> {
		return this._backend.backendRequest(this.API + 'purpose', 'get').pipe(map(data => data.body));
	}

	getCountry(): Observable<Array<Country>> {
		return this._backend.backendRequest(this.API + 'country', 'get').pipe(map(data => {
			const countries: Array<Country> = data.body;
			const USAIndex = countries.findIndex(country => country.country_code === 'US');
			if (USAIndex) {
				countries.splice(USAIndex, 1);
			}
			return countries;
		}));
	}

	getLearnAboutUs(): Observable<Array<LearnAboutUs>> {
		return this._backend.backendRequest(this.API + 'aboutUs', 'get').pipe(map(data => data.body));
	}

	// getBusinessDisclosure(): Observable<Array<BusinessDisclosure>> {
	// 	return this._backend.backendRequest(this.API + 'businessDisclosures', 'get').map(data => data.body);
	// }

	getDocumentType(): Observable<any> {
		return this._backend.backendRequest(this.API + 'mbrdashboard', 'get').pipe(map(data => data.body));
	}

	getProductsMaxAmount(limitType: string) {
		return this._backend.backendRequest(this.API + 'fundinglimit/' + limitType, 'get').pipe(map(data => data.body));
	}

	// getBusinessdocTypeList(): Observable<Array<States>> {
	// 	return this._backend.backendRequest(this.API + 'businessdocumentlist', 'get').map(data => data.body);
	// }

	getPlan(): Observable<any> {
		return this._backend.backendRequest(this.API + 'plan', 'get').pipe(map(data => data.body));
	}

	getContributionTypeList(): Observable<any> {
		return this._backend.backendRequest(this.API + 'contibutionType', 'get').pipe(map(data => data.body));
	}

	getSourceFunds(): Observable<any> {
		return this._backend.backendRequest(this.API + 'sourceofFund', 'get').pipe(map(data => data.body));
	}

}
