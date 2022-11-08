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
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { ERRORLIST } from './../models/errorList';
import { environment } from '../../../environments/environment';


@Injectable()
export class ErrorManagerService {

	constructor(
		private toastyService: ToastyService,
		// private toastyConfig: ToastyConfig
	) { }

	getErrorMessage(accountType: string, errorCode: string) {
		const code = accountType + '-' + errorCode;
		return ERRORLIST[code];
	}

	displayError(type: string, toastOptions: ToastOptions) {
		this.toastyService[type](toastOptions);
	}

	displayToaster(accountType: string, errorCode: string, type: string, timeout?: number, params?: any) {
		const actualTimeout = (timeout && timeout > 0) ? timeout : environment.ErrorTimeOut;
		const toastOptions: ToastOptions = {
			title: type,
			msg: this.getErrorMessage(accountType, errorCode),
			showClose: true,
			timeout: actualTimeout,
			theme: 'default'
			// onAdd: (toast:ToastData) => {
			//     console.log('Toast ' + toast.id + ' has been added!');
			// },
			// onRemove: function(toast:ToastData) {
			//     console.log('Toast ' + toast.id + ' has been removed!');
			// }
		};
		this.displayError(type, toastOptions);
	}



}
