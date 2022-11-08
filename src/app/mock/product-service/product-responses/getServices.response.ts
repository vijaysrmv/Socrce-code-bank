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

import { Services } from '../../../core/models/product.model';

export const respServices = {
	debitcard: <Services>{
		selected: true,
		cardapplicant: null,
		carddelivery: null,
		overdraft: null
	},
	courtesypay: <Services>{
		selected: false,
		cardapplicant: null,
		carddelivery: null,
		overdraft: null
	},
	simplesaver: <Services>{
		selected: false,
		cardapplicant: null,
		carddelivery: null,
		overdraft: null
	},
	// oktopay: <Services>{
	// 	selected: false,
	// 	cardapplicant: null,
	// 	carddelivery: null,
	// 	overdraft: null
	// },
	// olb: <Services>{
	// 	selected: false,
	// 	cardapplicant: null,
	// 	carddelivery: null,
	// 	overdraft: null
	// },
  };
