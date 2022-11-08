/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        fields-value.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        14/08/2018
Description            :        This file has interfaces for various common field types
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface Relationship {
	id: number;
	value: string;
	DisplayOrder: number;
}

export interface EligibleAffliations {
	id: number;
	description: string;
}

export interface Title {
	id: string;
	description: string;
	DisplayOrder: number;
}

export interface Suffix {
	id: string;
	description: string;
	DisplayOrder: number;
}

export interface Gender {
	id: string;
	description: string;
}

export interface IdType {
	idtype: string;
	description: string;
	IssuedBy: string;
}

export interface PhoneType {
	phonetypeid: string;
	description: string;
}

export interface States {
	statecode: string;
	statename: string;
}

export interface OccupancyStatus {
	id: string;
	description: string;
}

export interface IncomeSource {
	id: string;
	value: string;
	hidden?: boolean;
}

export interface EmploymentStatus {
	id: string;
	value: string;
}

export interface LearnAboutUs {
	id: string;
	value: string;
	core_id: string;
}

export interface OwnershipStructure {
	ownership_id: string;
	ownership: string;
}

export interface HighRiskBusiness {
	id: number;
	value: string;
}

export interface BusinessCategory {
	code?: string;
	title?: string;
	category?: string;
	active_flag?: boolean;
}

export interface BusinessPhoneType {
	code?: string;
	title?: string;
	category?: string;
	active_flag?: boolean;
}

export interface BusinessType {
	code?: string;
	title: string;
}

export interface BusinessSubType {
	code?: string;
	title: string;
	description?: string;
	subtypecode?: string;
}

export interface Ownership {
	ownership: string;
	active_flag: boolean;
}

export interface State {
	statecode: string;
	statename: string;
}

export interface GeneralPurpose {
	id: number;
	description: string;
}

export interface TransactionRange {
	id: number;
	range: string;
}

export interface TransactionCount {
	max: string;
	min: string;
}

export interface Country {
	// id: string;
	country_code: string;
	description: string;
}

export interface Year {
	id: string;
	description: string;
}

export interface Month {
	id: string;
	description: string;
}

export interface InterestRates {
	apy: string;
	id: number;
	interestrate: string;
	maxamount: string;
	maxterm: number;
	minamount: string;
	minterm: number;
	productid: string;
	termunit: string;
}
