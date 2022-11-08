/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Shared
File Name              :        document.model.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        07/03/2019
Description            :        Model interfaces for document service
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

export interface IdDocumentModel {
    FRONT: IdImgModel;
    BACK: IdImgModel;
}

export interface IdImgModel {
    img: string;
    id: string;
    side?: string;
    holder?: string;
}

export interface DocumentList {
    pid: number;
    applicanttype?: string;
    applicantname?: string;
    documents?: Array<Document>;
}

export interface Document {
    docid?: number;
    doctype?: string;
    uploaded?: boolean;
}
