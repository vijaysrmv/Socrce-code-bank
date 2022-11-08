/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :
File Name              :
Author                 :
Date (DD/MM/YYYY)      :
Description            :
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Injectable } from '@angular/core';
import { ModalBoxInfo } from '../../core/models/modalBoxInfo.model';

export class ModalBoxService {
    accountType: string;
    jointAccountCount: number;
    beneficiaryCount: number;
    authorizeSigner = 0;
    beneficialOwner = 0;
    significantController = 0;

    authorizerMax = 6;
    ownerMax = 4;
    controllerMax = 1;

    businessWorkingCapital = false;
    collateralDetails = false;
    // private coBorrowerCount: number;

    setJointCount(count: number) {
        this.jointAccountCount = count;
    }
    getJointCount() {
        return this.jointAccountCount;
    }

    setBeneficiaryCount(count: number) {
        this.beneficiaryCount = count;
    }
    getBeneficiaryCount() {
        return this.beneficiaryCount;
    }

    // setCoBorrowerCount(count: number) {
    //     this.coBorrowerCount = count;
    // }
    // getCoBorrowerCount() {
    //     return this.coBorrowerCount;
    // }


    getModalBoxData(accountType: string) {
        const modalData = {
            questionLabel: this._getQuestionLabel(accountType),
            infoLabel: this._getInfoLabel(accountType),
            applicantCount: 1
        };
        return modalData;
    }

    _getQuestionLabel(accountType: string) {
        if (accountType === 'beneficiary') {
            return 'Do you want to add a <b>beneficiary</b> at this time?';
        } else if (accountType === 'responsible individual') {
            // return `Do you want to add another individual?`;
            return `Does this entity have any additional individual(s) that own 25% or more in equity interest or do you want to add another signer or significant controller?`;
        } else if (accountType === 'authorized signer') {
            return `Do you want to add a non-business owner ${accountType}?`;
        }
        return `Do you want to add a <b>${accountType}</b> at this time?`;
    }

    _getInfoLabel(accountType: string) {
        if (accountType === 'beneficiary') {
            return 'Number of beneficiaries:';
        } else if (accountType === 'authorized signer' || accountType === 'responsible individual' || accountType === 'joint owner' || accountType === 'joint holder') {
            return '';
        }
        return `Number of ${accountType} applicants:`;
    }

}
