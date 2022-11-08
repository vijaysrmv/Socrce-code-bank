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

import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { PageLoaderService } from '../components/page-loader/page-loader.service';
import { NotificationService } from '../services/notification.service';

import { environment } from '../../../environments/environment';
import { ERRORLIST } from '../models/errorList';


@Injectable()
export class ErrorsHandler implements ErrorHandler {

	constructor(
		private injector: Injector,
		private pageLoaderSvc: PageLoaderService
	) { }

	handleError(error: Error | HttpErrorResponse) {
		const router = this.injector.get(Router);
		const notification = this.injector.get(NotificationService);
		const errorsWithInvalidToken = ['2014', '2027'];
		if (environment.name !== 'prod') {
			console.error(error);
		}
		this.pageLoaderSvc.hide();
		if (error instanceof HttpErrorResponse) {
			// Server or connection error happened
			if (error.status === 404 || error.status === 500 || error.status > 500) {
				router.navigate(['/errors/technical-error']);
			} else if (error.error) {
				// this.pageLoaderSvc.hide();
				// notification.displayErrorToast('error', 'Error: ' + error.error.code, error.error.code);
				if (errorsWithInvalidToken.includes(error.error.code.toString())) {
					router.navigate(['/errors/timeout']);
				} else {
					notification.displayErrorToast('error', 'Error: ' + error.error.code, error.error.code);
				}
			}
		} else {
			// Handle Client Error (Errors from Application)
			// tslint:disable-next-line: no-use-before-declare
			if (error instanceof ApplicationError) {
				// const errorsWithResumeBtn = ['1004', '2017'];
				// if (errorsWithResumeBtn.includes(error.errorCode.toString())) {
				// 	const msg = ERRORLIST['ERR-' + error.errorCode] ? ERRORLIST['ERR-' + error.errorCode] + error.errorMsg : error.errorMsg;
				// 	const buttons = [
				// 		{
				// 			text: 'Resume',
				// 			redirectUrl: `/resume`
				// 		}
				// 	];
				// 	notification.displayToastWithButtons('error', 'Error', msg, buttons);
				if (errorsWithInvalidToken.includes(error.errorCode.toString())) {
					router.navigate(['/errors/timeout']);
				} else {
					const code = error.errorCode ? error.errorCode : '';
					if (code !== '' && error.errorMsg === '') {
						notification.displayErrorToast('error', 'Error: ' + code, code);
					} else if (error.errorMsg && error.errorMsg !== '') {
						notification.displayErrorToast('error', 'Error: ' + code, code, error.errorMsg);
					}
				}
			} else {
				notification.displayErrorToast('error', error.name, error.message);
			}
			// this.pageLoaderSvc.hide();
		}
	}

}


export class ApplicationError extends Error {

	errorCode: string;
	errorMsg: string;

	constructor(code: string, errorMsg?: string) {
		super();
		this.name = ApplicationError.name;
		this.errorMsg = errorMsg ? errorMsg : '';
		this.errorCode = code;
		Object.setPrototypeOf(this, ApplicationError.prototype);
	}

}
