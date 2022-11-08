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

import { ZipDetails } from '../../../core/models/usps-response.model';

export const respZipLookup = <ZipDetails> {
	zip5: '85001',
	city: 'PHOENIX',
	state: 'MA'
};

export const inCorrectZip = <ZipDetails> {
	zip5: '12345',
	city: 'TEST',
	state: 'NA'
};
