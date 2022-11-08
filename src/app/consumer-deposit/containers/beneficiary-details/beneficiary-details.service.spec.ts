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

import { TestBed, inject } from '@angular/core/testing';

import { BeneficiaryDetailsService } from './beneficiary-details.service';

describe('BeneficiaryDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BeneficiaryDetailsService]
    });
  });

  it('should be created', inject([BeneficiaryDetailsService], (service: BeneficiaryDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
