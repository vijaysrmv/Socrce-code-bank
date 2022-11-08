/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        oao-response-data.model.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        06/12/2019
Description            :        models for response data in oao api calls
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

export interface AccountList {
    balance: number;
    accountdescription: string;
    accounttype: string;
    accountnumber: string;
}
