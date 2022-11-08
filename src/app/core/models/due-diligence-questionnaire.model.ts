/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core module
File Name              :        due-diligence-questionnaire.model.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        21/01/2020
Description            :        Model for due diligence questionnaire
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface DueDiligenceQuestionnaire {
    questionid: string;
    parentqueid: string;
    questiontext: string;
    answertype: string;
    error?: boolean;
    remarkError?: boolean;
    category: string;
    textanswer?: string;
    visible: boolean;
    haschild?: boolean;
    answers?: Array<ChoiceArray>;
}

interface ChoiceArray {
    optiontext: string;
    selected: boolean;
    childvisibility: boolean;
    remark: string;
    needremarks: boolean;
}
