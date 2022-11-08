/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        usps-response.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        16/08/2018
Description            :        Interface for usps data
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface ZipDetails {
	zip5: string;
	city: string;
	state: string;
}
