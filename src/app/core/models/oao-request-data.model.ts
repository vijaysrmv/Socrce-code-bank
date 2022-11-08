/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        oao-request-data.model.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        01/04/2019
Description            :        models for request data in oao api calls
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export interface AdditionalOptions {
    count: number;
    options: string;
    applicationtype: string;
}

export interface DeleteApplicant {
    arn: string;
    pid?: number;
    applicanttype: string;
    uistate: string;
}

export interface PaymentData {
    // arn: string;
    // sourceaccount?: string;
    // sourceaccountproductid?: string;
    transfertype?: string;
    // accountname?: string;
    // institutename?: string;
    // routingnumber?: string;
    totalamount?: string;
    productlist?: Array<ProductList>;
    internalfunding?: InternalFunding;
}

export interface InternalFunding {
    sourceacc: string;
    sourceaccounttype: string;
    amount: string;
}

export interface FundingData {
    fundingview: PaymentData;
}


export interface ProductList {
    productid: string;
    amount: string;
}
