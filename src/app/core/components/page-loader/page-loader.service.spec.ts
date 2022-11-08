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

import { PageLoaderService } from './page-loader.service';

describe('PageLoaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageLoaderService]
    });
  });

  it('should be created', inject([PageLoaderService], (service: PageLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
