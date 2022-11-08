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

import { OwnershipStructure, GeneralPurpose, TransactionCount, BusinessType, BusinessSubType, BusinessCategory } from '../../../core/models/fields-value.model';


export const respOwnershipStructure = <Array<OwnershipStructure>>[
	{ ownership_id: '1', ownership: 'Sole Proprietorship' },
	{ ownership_id: '2', ownership: 'Limited Liability Company (LLC)' },
	{ ownership_id: '3', ownership: 'S Corporation' },
	{ ownership_id: '4', ownership: 'Partnership' },
	{ ownership_id: '5', ownership: 'Others' }
];

export const respGeneralPurpose = <Array<GeneralPurpose>>[
	{ id: 1, description: 'Operating Account' },
	{ id: 2, description: 'Payroll' },
	{ id: 3, description: 'Saving' },
	{ id: 4, description: 'Other' }
];

// export const respRevenueRange = <Array<RevenueRange>>[
// 	{ min: '1.00', max: '1,000' },
// 	{ min: '1,000.01', max: '5,000' },
// 	{ min: '5,000.01', max: '10,000' },
// 	{ min: '10,000.01', max: '25,000' },
// 	{ min: '25,000.01', max: '75,000' },
// 	{ min: '75.000.01', max: '150,000' },
// 	{ min: '15,000.01', max: '250,000' },
// 	{ min: '250,000.01', max: '500,000' },
// 	{ min: '500,000.01', max: '1,000,000' },
// 	{ min: '1,000,000.01', max: '2,000,000' },
// 	{ min: '2,000,000.01', max: '3,000,000' },
// 	{ min: '3,000,000.01', max: '4,000,000' },
// 	{ min: '4,000,000.01', max: '5,000,000' },
// 	{ min: '5,000,000.01', max: '99999999999' }
// ];

export const respTransactionCount = <Array<TransactionCount>>[
	{ min: '1', max: '5' },
	{ min: '6', max: '10' },
	{ min: '11', max: '15' },
	{ min: '16', max: '20' },
];

export const respBusinessType = <Array<BusinessType>>[
	{ code: 'type1', title: 'title 1' },
	{ code: 'type2', title: 'title 2' },
	{ code: 'type3', title: 'title 3' },
	{ code: 'type4', title: 'title 4' },
];

export const respBusinessSubType = <Array<BusinessSubType>>[
	{ code: 'type1', title: 'title 1' },
	{ code: 'type2', title: 'title 2' },
	{ code: 'type3', title: 'title 3' },
	{ code: 'type4', title: 'title 4' },
];

export const respBusinessCategory = <Array<BusinessCategory>>[
	{ code: 'category1', title: 'category 1' },
	{ code: 'category2', title: 'category 2' },
	{ code: 'category3', title: 'category 3' },
	{ code: 'category4', title: 'category 4' },
];
