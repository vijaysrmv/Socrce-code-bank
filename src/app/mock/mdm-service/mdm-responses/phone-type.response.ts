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

import { PhoneType } from '../../../core/models/fields-value.model';

export const respPhoneTypes = <Array<PhoneType>>[{
	phonetypeid: 'CEL',
	description: 'cell'
},
{
	phonetypeid: 'HOM',
	description: 'home'
},
{
	phonetypeid: 'BUS',
	description: 'business'
}];
