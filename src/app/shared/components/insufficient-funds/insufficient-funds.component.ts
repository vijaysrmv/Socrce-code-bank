/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  : 		PES
Project/Product        : 		FMB OAO
Application            : 		FMB OAO  Portal
Module                 :		Shared
File Name              : 		insufficient-funds.component.ts
Author                 : 		Chetna Luthra
Date (DD/MM/YYYY)      : 		16/07/2020
Description            : 		Insufficient Funds component
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-insufficient-funds',
  templateUrl: './insufficient-funds.component.html',
  styleUrls: ['./insufficient-funds.component.scss']
})
export class InsufficientFundsComponent implements OnInit {
  @Output() clickOk = new EventEmitter();
 // @Output() clickCancel = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  okRedirection() {
    this.clickOk.emit();
  }

  // cancelRedirection() {
  //   this.clickCancel.emit();
  // }
}
