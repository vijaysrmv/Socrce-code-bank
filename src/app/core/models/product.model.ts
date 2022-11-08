/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        product.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        07/08/2018
Description            :        This file has interfaces for product page
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface Product {
	productshareid: string;
	businessshareid?: string;
	producttype: string;
	accounttypedescription: string;
	atmcard: boolean;
	debitcard: boolean;
	oktopay: boolean;
	olb: boolean;
	interestrate: number;
	minopeningdeposit: string;
	billpay: boolean;
	estatements: boolean;
	isbusinesscustomer: boolean;
	ach: boolean;
	status: boolean;
	productid: string;
	productname: string;
	onlinewire: boolean;
	// dividendtype?: string;
	dividendtype?: string;
	dividendamount?: number;
	sharetypename?: string;
	apy?: number;
	displayname: string;
	adultallowedtoopen?: true;
	id?: number;
	inbranchaccountopening?: boolean;
	minpaymentamount?: string;
	onlineaccountopening?: boolean;
	youthallowedtoopen?: boolean;
	minage?: number;
	maxage?: number;
	creditlimit?: string;
	cardno?: string;
	type?: string;
	accounttypeid: string;
	minimumamount: number;
	amount?: number;
	minterm?: number;
	maxterm?: number;
	// term?: number;
	cdterm?: number;
	termunit?: string;
	highlighter?: string;
	showhighlighter?: boolean;
	hyperlink?: string;
	showoverlay?: boolean;
	monthlymaintenancefee?: string;
	learnmore?: string;
	disabled?: boolean;
	plantype?: string;
	contributiontype?: string;
}

export interface Services {
	deliverymethod?: string;
	selected: boolean;
	cardapplicant?: string;
	carddelivery?: string;
	overdraft?: boolean;
	applicantlist?: ApplicantList[];
}

export interface ApplicantList {
	firstname: string;
	lastname: string;
	pid: number;
	applicanttype: string;
	selected: boolean;
}
