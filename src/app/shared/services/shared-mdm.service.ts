
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { MdmDataService } from './../../core/services/mdm-data.service';

import {
	IdType,
	States,
	Country,
	LearnAboutUs,
	EmploymentStatus,
	OwnershipStructure,
	HighRiskBusiness,
	InterestRates,
	Title,
	Suffix,
	Relationship
} from '../../core/models/fields-value.model';
import { Product } from '../../core/models/product.model';

@Injectable()
export class SharedMdmService {

	idTypes: Array<IdType>;
	allStates: Array<States>;
	learnAboutUs: Array<LearnAboutUs>;
	allCountries: Array<Country>;
	nonUSCountries: Array<Country>;
	employmentStatus: Array<EmploymentStatus>;
	businessProducts: Array<Product>;
	ownershipStructure: Array<OwnershipStructure>;
	highRiskBusiness: Array<HighRiskBusiness>;
	interestRates: Array<InterestRates>;
	titles: Array<Title>;
	suffixes: Array<Suffix>;
	beneficiaryRelations: Array<Relationship>;

	sharedMdmData = false;
	sharedBusinessData = false;

	constructor(
		private _mdm: MdmDataService
	) {
		//  this.fetchMdmData();
	}

	fetchSharedMdmData() {
		if (!this.sharedMdmData) {
			const observable = forkJoin(
				this.getStates(),
				this.getIdentification(),
				this.getAboutUs(),
				this.getCountry(),
				this.getEmploymentStatus(),
				this.getInterestRates()
			);
			observable.subscribe(result => {
				this.allStates = result[0];
				this.idTypes = result[1];
				this.learnAboutUs = result[2];
				this.allCountries = result[3].allCountries;
				this.nonUSCountries = result[3].nonUSCountries;
				this.employmentStatus = result[4];
				this.interestRates = result[5];
				this.sharedMdmData = true;
			}, err => { });
		}
	}

	fetchBusinessData() {
		if (!this.sharedBusinessData) {
			const observable = forkJoin(
				this.getOwnershipStructure(),
				this.getHighRiskBusiness(),
			);
			observable.subscribe(result => {
				this.ownershipStructure = result[0];
				this.highRiskBusiness = result[1];
				this.sharedBusinessData = true;
			}, err => { });
		}
	}

	getStates() {
		return this._mdm.getMdmData('state').pipe(map(data => {
			data.map(state => state.statename = state.statename.toUpperCase());
			this.allStates = data;
			return data;
		}));
	}

	getIdentification() {
		return this._mdm.getMdmData('id').pipe(map(data => {
			data.map(idType => idType.description = idType.description.toUpperCase());
			data.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
			this.idTypes = data;
			return data;
		}));
	}

	getAboutUs() {
		return this._mdm.getMdmData('aboutUs').pipe(map(data => {
			data.map(aboutType => aboutType.value = aboutType.value.toUpperCase());
			this.learnAboutUs = data.sort((a, b) => a.value.localeCompare(b.value));
			return this.learnAboutUs;
		}));
	}

	getCountry() {
		return this._mdm.getMdmData('country').pipe(map(data => {
			data.map(country => country.description = country.description.toUpperCase());
			this.allCountries = data.sort((a, b) => a.description.localeCompare(b.description));
			this.nonUSCountries = [...this.allCountries];
			const USAIndex = this.nonUSCountries.findIndex(country => country.country_code === 'US');
			if (USAIndex) {
				this.nonUSCountries.splice(USAIndex, 1);
			}
			return { allCountries: this.allCountries, nonUSCountries: this.nonUSCountries };
		}));
	}

	getEmploymentStatus() {
		return this._mdm.getMdmData('employment').pipe(map(data => {
			// data.map(employment => employment.value = employment.value.toUpperCase());
			this.employmentStatus = data.sort((a, b) => a.value.localeCompare(b.value));
			return this.employmentStatus;
		}));
	}

	getOwnershipStructure() {
		return this._mdm.getMdmData('ownership').pipe(map(data => {
			data.map(item => item.ownership = item.ownership.toUpperCase());
			this.ownershipStructure = data;
			return data;
		}));
	}

	getHighRiskBusiness() {
		return this._mdm.getMdmData('highRiskBusiness').pipe(map(data => {
			this.highRiskBusiness = data;
			return data;
		}));
	}

	getInterestRates() {
		return this._mdm.getMdmData('certificateDeposit').pipe(map(data => {
			this.interestRates = data;
			return data;
		}));
	}

	getTitles() {
		return this._mdm.getMdmData('title').pipe(map(data => {
			data.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
			this.titles = data;
			return data;
		}));
	}

	getSuffixes() {
		return this._mdm.getMdmData('suffix').pipe(map(data => {
			data.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
			this.suffixes = data;
			return data;
		}));
	}

	getRelationship(): Observable<Array<Relationship>> {
		return this._mdm.getMdmData('relationship').pipe(map(data => {
			data.sort((a, b) => a.DisplayOrder - b.DisplayOrder);
			data.map(relation => relation.value = relation.value.toUpperCase());
			this.beneficiaryRelations = data;
			return data;
		}));
		// return this._backend.backendRequest(this.API + 'relationship', 'get').map(data => data.body.sort((a, b) => a.DisplayOrder < b.DisplayOrder));
	}

	getFundingLimits(accountType) {
		return this._mdm.getMdmDataWithAccountType('fundinglimit', accountType).pipe(map(data => {
			return data;
		}));
	}
}
