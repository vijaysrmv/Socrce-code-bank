/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        id-scan.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        10/09/2018
Description            :        This file has interface for id scan object
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import { Address, Identification } from './application.model';

export interface IdScanResponse {
	firstname: string;
	middlename: string;
	lastname: string;
	suffix: string;
	dob: any;
	gender: string;
	country: string;
	identification: Identification;
	physicaladdress: Address;
}
