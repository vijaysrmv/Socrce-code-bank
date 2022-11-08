/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        resume.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        05/09/2018
Description            :        This file has interfaces for resume flow pages
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

interface Application {
    accounttype: string;
    applicationstate: string;
    arn: string;
    created: string;
    lastmodified: string;
    products: Array<string>;
    uistate: string;
    ibpsstate?: string;
}

export interface UserApplications {
    arninfo: Array<Application>;
    firstname: string;
    lastname: string;
}

