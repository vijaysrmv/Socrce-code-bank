/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        questionnaire.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        07/09/2018
Description            :        Interfaces for identity questionnaire
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface Questionnaire {
    name: string;
    displayName: string;
    type: string;
    choiceList: Choice;
    sequence: number;
}

interface Choice {
    choice: Array<ChoiceArray>;
}

interface ChoiceArray {
    key: string;
    display: string;
}
