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


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageLoaderService } from '../../components/page-loader/page-loader.service';
import { ConsumerDepositService } from '../../../consumer-deposit/services/consumer-deposit.service';

import { AppConfig } from '../../../app.config';

@Component({
	selector: 'app-error',
	templateUrl: './error.component.html',
	styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

	errorType = '';
	contactNumber = AppConfig.settings.CONTACT_NUMBER;

	constructor(
		private _activatedRoute: ActivatedRoute,
		// private consumerSvc: ConsumerDepositService,
		private pageLoaderSvc: PageLoaderService
	) { }

	ngOnInit() {
		this.errorType = this._activatedRoute.snapshot.params['status'].toLowerCase();
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			// this.consumerSvc.unlockApplication().subscribe(data => {
			// 	// do nothing on application unlock call
			// });
		}
		sessionStorage.clear();
		this.pageLoaderSvc.hide();
	}

}
