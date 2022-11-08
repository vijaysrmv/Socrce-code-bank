/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        disclosure.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        28/08/2018
Description            :        This is interface for disclosures part
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface Disclosure {
    title: string;
    url: string;
    disclosurestype: string;
    disclosuresdescription: string;
    parentfolderindex: number;
    status: boolean;
}

export interface BusinessDisclosure {
    id: number;
    disclosuresdescription: string;
    url: string;
}
