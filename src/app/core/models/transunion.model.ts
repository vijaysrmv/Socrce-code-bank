/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen OAO
Application            :        Newgen OAO
Module                 :        Consumer OAO
File Name              :        transunion.model.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        12/03/2019
Description            :        models for transunion related data
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface TransunionResponse {
    transId?: string;
    nextrequeststate?: string;
    authenticationquestions?: AuthenticationQuestions[];
}

export interface AuthenticationQuestions {
    name: string;
    displayname: string;
    choicelist: ChoiceList[];
}

export interface ChoiceList {
    key: string;
    display: string;
}
