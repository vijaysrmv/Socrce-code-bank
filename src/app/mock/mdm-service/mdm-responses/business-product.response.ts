/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :	    Business
File Name              :		business-product.response.ts
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :	    06/09/2019
Description            :		Mock data for business
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Product } from '../../../core/models/product.model';


export const respBusinessProducts = [
        {
            'id': 1,
            'businessshareid': 'business_money_market_83',
            'serviceid': '83',
            'sharetypename': 'Business Money Market',
            'adultallowedtoopen': true,
            'youthallowedtoopen': false,
            'minopeningdeposit': '2500',
            'status': true,
            'displayname': 'Business Money Market',
            'sharetype': 'SV',
            'minage': 18,
            'maxage': null
        },
        {
            'id': 2,
            'businessshareid': 'business_share_savings_80',
            'serviceid': '80',
            'sharetypename': 'Business Share Savings',
            'adultallowedtoopen': true,
            'youthallowedtoopen': false,
            'minopeningdeposit': '25',
            'status': true,
            'displayname': 'Business Savings',
            'sharetype': 'SV',
            'minage': 0,
            'maxage': 8
        },
        {
            'id': 3,
            'businessshareid': 'business_analysis_83',
            'serviceid': '83',
            'sharetypename': 'Business Analysis Account',
            'adultallowedtoopen': true,
            'youthallowedtoopen': false,
            'minopeningdeposit': '2500',
            'status': true,
            'displayname': 'Business Analysis Account',
            'sharetype': 'SV',
            'minage': 0,
            'maxage': 8
        },
        {
            'id': 4,
            'businessshareid': 'business_non_profit',
            'serviceid': '81',
            'sharetypename': 'Non-Profit Checking',
            'adultallowedtoopen': true,
            'youthallowedtoopen': false,
            'minopeningdeposit': '0',
            'status': true,
            'displayname': 'Non-Profit Checking',
            'sharetype': 'DD',
            'minage': 18,
            'maxage': null
        },
        {
            'id': 5,
            'businessshareid': 'business_interest',
            'serviceid': '81',
            'sharetypename': 'Business Interest Checking',
            'adultallowedtoopen': true,
            'youthallowedtoopen': false,
            'minopeningdeposit': '0',
            'status': true,
            'displayname': 'Business Interest Checking',
            'sharetype': 'DD',
            'minage': 18,
            'maxage': null
        },
        {
            'id': 6,
            'businessshareid': 'business_checking_81',
            'serviceid': '81',
            'sharetypename': 'Business Checking',
            'adultallowedtoopen': true,
            'youthallowedtoopen': false,
            'minopeningdeposit': '0',
            'status': true,
            'displayname': 'Business Checking',
            'sharetype': 'DD',
            'minage': 18,
            'maxage': null
        },
        {
            'id': 7,
            'businessshareid': 'iolta_checking',
            'serviceid': '81',
            'sharetypename': 'IOLTA',
            'adultallowedtoopen': false,
            'youthallowedtoopen': true,
            'minopeningdeposit': '0',
            'status': true,
            'displayname': 'IOLTA',
            'sharetype': 'DD',
            'minage': 0,
            'maxage': 8
        },
        {
            'id': 10,
            'productshareid': '90_day_certificate_40',
            'productid': '40',
            'sharetypename': '90 Day Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': false,
            'onlineaccountopening': false,
            'minopeningdeposit': '500.00',
            'status': false,
            'apy': '5',
            'interestrate': '10',
            'displayname': '90 days',
            'term_frequency': 'DAYS',
            'term_period': 90,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 11,
            'productshareid': '90_day_add-On_certificate_41',
            'productid': '41',
            'sharetypename': '90 Day Add-On Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': false,
            'onlineaccountopening': false,
            'minopeningdeposit': '500.00',
            'status': false,
            'apy': '5',
            'interestrate': '10',
            'displayname': '90 Day Add-On Certificate',
            'term_frequency': 'DAYS',
            'term_period': 90,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 12,
            'productshareid': '6_month_certificate_42',
            'productid': '42',
            'sharetypename': '6 Month Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': false,
            'onlineaccountopening': false,
            'minopeningdeposit': '500.00',
            'status': false,
            'apy': '5',
            'interestrate': '10',
            'displayname': '6 months',
            'term_frequency': 'MONTHS',
            'term_period': 6,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 13,
            'productshareid': '6_month_add-On_certificate_43',
            'productid': '43',
            'sharetypename': '6 Month Add-On Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': false,
            'onlineaccountopening': false,
            'minopeningdeposit': '500.00',
            'status': false,
            'apy': '5',
            'interestrate': '10',
            'displayname': '6 Month Add-On Certificate',
            'term_frequency': 'MONTHS',
            'term_period': 6,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 14,
            'productshareid': '12_month_certificate_51',
            'productid': '51',
            'sharetypename': '12 Month Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': true,
            'onlineaccountopening': true,
            'minopeningdeposit': '500.00',
            'status': true,
            'apy': '5',
            'interestrate': '10',
            'displayname': '12 months',
            'term_frequency': 'MONTHS',
            'term_period': 12,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 15,
            'productshareid': '18_month_certificate_55',
            'productid': '55',
            'sharetypename': '18 Month Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': true,
            'onlineaccountopening': true,
            'minopeningdeposit': '500.00',
            'status': true,
            'apy': '5',
            'interestrate': '10',
            'displayname': '18 months',
            'term_frequency': 'MONTHS',
            'term_period': 18,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 16,
            'productshareid': '24_month_certificate_59',
            'productid': '59',
            'sharetypename': '24 Month Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': true,
            'onlineaccountopening': true,
            'minopeningdeposit': '500.00',
            'status': true,
            'apy': '5',
            'interestrate': '10',
            'displayname': '24 months',
            'term_frequency': 'MONTHS',
            'term_period': 24,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 17,
            'productshareid': '36_month_certificate_63',
            'productid': '63',
            'sharetypename': '36 Month Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': true,
            'onlineaccountopening': true,
            'minopeningdeposit': '500.00',
            'status': true,
            'apy': '5',
            'interestrate': '10',
            'displayname': '36 months',
            'term_frequency': 'MONTHS',
            'term_period': 36,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 18,
            'productshareid': '48_month_certificate_67',
            'productid': '67',
            'sharetypename': '48 Month Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': true,
            'onlineaccountopening': true,
            'minopeningdeposit': '500.00',
            'status': true,
            'apy': '5',
            'interestrate': '10',
            'displayname': '48 months',
            'term_frequency': 'MONTHS',
            'term_period': 48,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        },
        {
            'id': 19,
            'productshareid': '60_month_certificate_71',
            'productid': '71',
            'sharetypename': '60 Month Certificate',
            'sharetype': 'CD',
            'inbranchaccountopening': true,
            'onlineaccountopening': true,
            'minopeningdeposit': '500.00',
            'status': true,
            'apy': '5',
            'interestrate': '10',
            'displayname': '60 months',
            'term_frequency': 'MONTHS',
            'term_period': 60,
            'tyfone_productid': 'CD',
            'minage': 0,
            'maxage': null
        }
];