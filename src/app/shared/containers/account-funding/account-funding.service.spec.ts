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

import { AccountFundingService } from './account-funding.service';

describe('AccountFundingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountFundingService]
    });
  });

  it('should be created', inject([AccountFundingService], (service: AccountFundingService) => {
    expect(service).toBeTruthy();
  }));
});
