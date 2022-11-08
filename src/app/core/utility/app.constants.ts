/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        app.constants.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        16/10/2019
Description            :        Constants to be imported throughout application
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


export abstract class AppConstants {

    private static MAX_CONSUMER_PRODUCTS = 3;
    private static MAX_CONSUMER_JOINT_APPLICANTS = 3;
    private static MAX_CONSUMER_BENEFICIARY_APPLICANTS = 4;
    private static LEARN_ABOUT_REFER_ID = 17;
    private static MIN_SENIOR_AGE = 55;
    private static SENIOR_CHECKING_ID = '62-DD-200';

    public static get maxConsumerProducts(): number {
        return this.MAX_CONSUMER_PRODUCTS;
    }

    public static get maxConsumerJoints(): number {
            return this.MAX_CONSUMER_JOINT_APPLICANTS;
    }

    public static get maxConsumerBeneficiaries(): number {
        return this.MAX_CONSUMER_BENEFICIARY_APPLICANTS;
    }

    public static get referredEmployeeLearnAboutId(): number {
        return this.LEARN_ABOUT_REFER_ID;
    }

    public static get minSeniorAge(): number {
        return this.MIN_SENIOR_AGE;
    }

    public static get seniorCheckingID(): string {
        return this.SENIOR_CHECKING_ID;
    }

}
