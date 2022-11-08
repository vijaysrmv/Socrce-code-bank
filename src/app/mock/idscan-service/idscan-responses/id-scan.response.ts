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

import { Identification, ApplicantDetails, Address } from '../../../core/models/application.model';

export const respIdScan = <ApplicantDetails>{
	firstname: 'CATHLEEN',
	lastname: 'BASTIBLE',
	middlename: 'CA',
	suffix: '',
	dob: '05/05/1990',
	identification: <Identification>{
		type: 'DL',
		number: 'S31873135',
		expirydate: '05/05/2019',
		issuedate: '02/02/2018',
		issuestate: 'MA'
	},
	physicaladdress: <Address>{
		aptorsuite: '',
		numberandstreet: '45 WESTERN AVE',
		zipcode: '02364',
		city: 'KINGSTON',
		state: 'MA'
	}
};
