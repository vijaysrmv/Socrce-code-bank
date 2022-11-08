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

import { SelectProductService } from './select-product.service';

describe('SelectProductService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SelectProductService]
    });
  });

  it('should be created', inject([SelectProductService], (service: SelectProductService) => {
    expect(service).toBeTruthy();
  }));
});
