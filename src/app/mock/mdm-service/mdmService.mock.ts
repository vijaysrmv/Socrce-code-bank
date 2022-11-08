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

import { Observable } from 'rxjs';

import { Disclosure } from '../../core/models/disclosure.model';
import { IdType, BusinessCategory, BusinessSubType, PhoneType, Relationship, EligibleAffliations, States, Title, Gender, Suffix, EmploymentStatus, LearnAboutUs, OccupancyStatus, IncomeSource, OwnershipStructure, GeneralPurpose, TransactionCount, BusinessType } from '../../core/models/fields-value.model';

import { respOwnershipStructure, respGeneralPurpose, respTransactionCount, respBusinessCategory, respBusinessType, respBusinessSubType } from './mdm-responses/business-deposit.response';
import { respBusinessProducts } from './mdm-responses/business-product.response';
import { respDisclosures } from './mdm-responses/disclosure.response';
import { respEligibleAffliations } from './mdm-responses/eligibleAffliations.reponse';
import { respIdTypes } from './mdm-responses/id-types.response';
import { respInterestRates } from './mdm-responses/interest-rates.response';
import { respTitle, respSuffix, respGender, respEmploymentStatus, respLearnAboutUs, respStates, respOccupancyStatus, respIncomeSource } from './mdm-responses/personal-details.response';
import { respPhoneTypes } from './mdm-responses/phone-type.response';
import { respProducts } from './mdm-responses/products.response';
import { respRelationship } from './mdm-responses/relationship.response';


export class MockMdmService {
	getRelationship(): Observable<Array<Relationship>> {
		return new Observable((observer) => {
			observer.next(respRelationship);
		});
	}

	getEligibleAffliations(): Observable<Array<EligibleAffliations>> {
		return new Observable((observer) => {
			observer.next(respEligibleAffliations);
		});
	}

	getTitle(): Observable<Array<Title>> {
		return new Observable((observer) => {
			observer.next(respTitle);
		});
	}

	getGender(): Observable<Array<Gender>> {
		return new Observable((observer) => {
			observer.next(respGender);
		});
	}

	getSuffix(): Observable<Array<Suffix>> {
		return new Observable((observer) => {
			observer.next(respSuffix);
		});
	}

	getOccupancyStatus(): Observable<Array<OccupancyStatus>> {
		return new Observable((observer) => {
			observer.next(respOccupancyStatus);
		});
	}

	getIncomeSource(): Observable<Array<IncomeSource>> {
		return new Observable((observer) => {
			observer.next(respIncomeSource);
		});
	}

	getEmploymentStatus(): Observable<Array<EmploymentStatus>> {
		return new Observable((observer) => {
			observer.next(respEmploymentStatus);
		});
	}

	getLearnAboutUs(): Observable<Array<LearnAboutUs>> {
		return new Observable((observer) => {
			observer.next(respLearnAboutUs);
		});
	}

	getPhoneTypes(): Observable<Array<PhoneType>> {
		return new Observable((observer) => {
			observer.next(respPhoneTypes);
		});
	}

	getIdentificationTypes(): Observable<Array<IdType>> {
		return new Observable((observer) => {
			observer.next(respIdTypes);
		});
	}

	getStates(): Observable<Array<States>> {
		return new Observable((observer) => {
			observer.next(respStates);
		});
	}

	getProducts(type): Observable<Array<any>> {
		return new Observable((observer) => {
			if (type === 'businessShare') {
				observer.next(respBusinessProducts);
			} else {
				observer.next(respProducts);
			}
		});
	}

	getDisclosures(): Observable<Array<Disclosure>> {
		return new Observable((observer) => {
			observer.next(respDisclosures);
		});
	}

	enableWorryFree(zip: string): Observable<boolean> {
		return new Observable((observer) => {
			observer.next(true);
		});
	}

	getOwnershipStructure(): Observable<Array<OwnershipStructure>> {
		return new Observable((observer) => {
			observer.next(respOwnershipStructure);
		});
	}

	getGeneralPurpose(): Observable<Array<GeneralPurpose>> {
		return new Observable((observer) => {
			observer.next(respGeneralPurpose);
		});
	}

	getTransactionCount(): Observable<Array<TransactionCount>> {
		return new Observable((observer) => {
			observer.next(respTransactionCount);
		});
	}

	getBusinessCategory(): Observable<Array<BusinessCategory>> {
		return new Observable((observer) => {
			observer.next(respBusinessCategory);
		});
	}

	getBusinessType(): Observable<Array<BusinessType>> {
		return new Observable((observer) => {
			observer.next(respBusinessType);
		});
	}

	getBusinessSubType(): Observable<Array<BusinessSubType>> {
		return new Observable((observer) => {
			observer.next(respBusinessSubType);
		});
	}

	getInterestRates() {
		return new Observable((observer) => {
			observer.next(respInterestRates);
		});
	}

}
