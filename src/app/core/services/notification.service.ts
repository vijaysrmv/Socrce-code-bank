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
import { ToastyService, ToastyConfig, ToastOptions } from 'ng2-toasty';

import { ERRORLIST } from '../models/errorList';
import { AppConfig } from '../../app.config';


@Injectable()
export class NotificationService {

    constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
        this.toastyConfig.limit = 1;
    }

    displayErrorToast(type: string, title: string, code: string = '', msg: string = '', timeout?: number) {
        const actualTimeout = (timeout && timeout > 0) ? timeout : AppConfig.settings.ErrorTimeOut;
        const toastOptions: ToastOptions = this._setToastyOptions(null, code.toString(), msg, actualTimeout);
        this.toastyService[type](toastOptions);
    }

    displayToastWithButtons(type: string, title: string, msg: string = '', buttons: Array<object>, timeout?: number) {
        const actualTimeout = (timeout && timeout > 0) ? timeout : AppConfig.settings.ErrorTimeOut;
        const buttonString = buttons.map((button, index) => {
            return `<a class="toasty-resume-btn" href="${button['redirectUrl']}">${button['text']}</a>`;
        }).join('');
        msg = `<span>${msg}</span>${buttonString}`;
        const toastOptions: ToastOptions = this._createToastyOptions(null, msg, actualTimeout);
        this.toastyService[type](toastOptions);
    }

    displayToast(type: string, title: string, msg: string = '', timeout?: number) {
        const actualTimeout = (timeout && timeout > 0) ? timeout : AppConfig.settings.ErrorTimeOut;
        const toastOptions: ToastOptions = this._createToastyOptions(null, msg, actualTimeout);
        this.toastyService[type](toastOptions);
    }

    private _setToastyOptions(title: string, code: string = '', msg: string, timeout) {
        // let toastOptions: ToastOptions;
        const errorsWithResumeBtn = ['1004', '2017'];
        // const msgText = ERRORLIST['ERR-' + code] ? ERRORLIST['ERR-' + code] : 'Something has gone wrong please try again.';
        const msgText = ERRORLIST['ERR-' + code] ? ERRORLIST['ERR-' + code] : ERRORLIST['ERR-1000'];
        if (errorsWithResumeBtn.includes(code)) {
            msg = `<span>${msgText + msg}</span>`;
            // msg = `<span>${msgText + msg}</span><a class="toasty-resume-btn" href="/resume/">Resume here</a><button onclick="(${this.test})()">test</button>`;
        } else {
            msg = msgText;
        }
        return this._createToastyOptions(title, msg, timeout);
    }

    private _createToastyOptions(title: string, msg: string, timeout: number) {
        let toastOptions: ToastOptions;
        return toastOptions = {
            title,
            msg,
            showClose: true,
            timeout,
            theme: 'default'
        };
    }

}
