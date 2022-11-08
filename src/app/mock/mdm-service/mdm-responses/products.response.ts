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

import { Product } from '../../../core/models/product.model';


export const respProducts = <Array<Product>>[
	{
		'productid': '056',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': true,
		'olb': true,
		'billpay': true,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 2.35,
		'ach': false,
		'status': true,
		'minimumamount': 25,
		'productname': 'Standard Free Checking',
		'onlinewire': false
	},
	{
		'productid': '060',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': true,
		'olb': true,
		'billpay': true,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 3.2,
		'ach': false,
		'status': true,
		'minimumamount': 25,
		'productname': 'Premier Checking',
		'onlinewire': false
	},
	{
		'productid': '272',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': true,
		'olb': true,
		'billpay': true,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 3.5,
		'ach': false,
		'status': true,
		'minimumamount': 25,
		'productname': 'Premier Plus Checking',
		'onlinewire': false
	},
	{
		'productid': '274',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': true,
		'olb': true,
		'billpay': true,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 2.6,
		'ach': false,
		'status': true,
		'minimumamount': 10,
		'productname': 'Teens "N" Charge Account',
		'onlinewire': false
	},
	{
		'productid': '271',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': true,
		'olb': true,
		'billpay': true,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 2.1,
		'ach': false,
		'status': true,
		'minimumamount': 25,
		'productname': 'IMMP (Insured Money Market Plus)',
		'onlinewire': false
	},
	{
		'productid': '270',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': true,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': true,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 4,
		'ach': false,
		'status': true,
		'minimumamount': 25,
		'productname': 'Youth Savings',
		'onlinewire': false
	},
	{
		'productid': '031',
		'accounttypeid': 'SV',
		'accounttypedescription': 'savings',
		'atmcard': true,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 1.8,
		'ach': false,
		'status': true,
		'minimumamount': 30,
		'productname': 'Primary Savings',
		'onlinewire': false
	},
	{
		'productid': '032',
		'accounttypeid': 'SV',
		'accounttypedescription': 'savings',
		'atmcard': true,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 1.8,
		'ach': false,
		'status': true,
		'minimumamount': 30,
		'productname': 'Secondary Savings',
		'onlinewire': false
	},
	{
		'productid': '061',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': true,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 2.9,
		'ach': false,
		'status': true,
		'minimumamount': 25,
		'productname': 'Holiday Savings',
		'onlinewire': false
	},
	{
		'productid': '273',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': true,
		'isbusinesscustomer': false,
		'interestrate': 3.2,
		'ach': false,
		'status': true,
		'minimumamount': 25,
		'productname': 'IMMF (Insured Money Management Fund)',
		'onlinewire': false
	},
	{
		'productid': '115',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 0.45,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 90 days',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '90 Days',
		'apy': 0.45
	},
	{
		'productid': '1150',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 0.45,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 90 days Add-On',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '90 Days Add-On',
		'apy': 0.45
	},
	{
		'productid': '116',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 0.65,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 6 months',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '6 Months',
		'apy': 0.65
	},
	{
		'productid': '1160',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 0.65,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 6 months Add-On',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '6 Months Add-On',
		'apy': 0.65
	},
	{
		'productid': '117',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 0.90,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 12 months',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '12 Months',
		'apy': 0.90
	},
	{
		'productid': '207',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 1.00,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 18 months',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '18 Months',
		'apy': 1.00
	},
	{
		'productid': '110',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 1.10,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 24 months',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '24 Months',
		'apy': 1.10
	},
	{
		'productid': '118',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 1.50,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 36 months',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '36 Months',
		'apy': 1.50
	},
	{
		'productid': '119',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 1.60,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 48 months',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '48 Months',
		'apy': 1.60
	},
	{
		'productid': '120',
		'accounttypeid': 'CD',
		'accounttypedescription': 'CertificateOfDeposits',
		'atmcard': false,
		'debitcard': false,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': false,
		'interestrate': 1.90,
		'ach': false,
		'status': true,
		'minimumamount': 1000,
		'productname': 'Certificate Of Deposits - 60 months',
		'onlinewire': false,
		'dividendtype': 'quaterly',
		'dividendamount': null,
		'productdescription': '60 Months',
		'apy': 1.90
	},
	{
		'productid': '080',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': true,
		'interestrate': 1.56,
		'ach': true,
		'status': true,
		'minimumamount': 25,
		'productname': 'BusinessShareSaving',
		'onlinewire': true
	},
	{
		'productid': '081',
		'accounttypeid': 'SV',
		'accounttypedescription': 'savings',
		'atmcard': false,
		'debitcard': true,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': true,
		'interestrate': 1.6,
		'ach': true,
		'status': true,
		'minimumamount': 30,
		'productname': 'BusinessChecking',
		'onlinewire': true
	},
	{
		'productid': '082',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': true,
		'interestrate': 1.7,
		'ach': true,
		'status': true,
		'minimumamount': 25,
		'productname': 'BusinessInterestChecking',
		'onlinewire': true
	},
	{
		'productid': '083',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': true,
		'interestrate': 1.7,
		'ach': true,
		'status': true,
		'minimumamount': 25,
		'productname': 'BusinessMoneyMarket',
		'onlinewire': true
	},
	{
		'productid': '084',
		'accounttypeid': 'DD',
		'accounttypedescription': 'demanddraft',
		'atmcard': false,
		'debitcard': true,
		'oktopay': false,
		'olb': true,
		'billpay': false,
		'estatements': false,
		'isbusinesscustomer': true,
		'interestrate': 1.7,
		'ach': true,
		'status': true,
		'minimumamount': 25,
		'productname': 'BusinessSecondaryShare',
		'onlinewire': true
	}
];
