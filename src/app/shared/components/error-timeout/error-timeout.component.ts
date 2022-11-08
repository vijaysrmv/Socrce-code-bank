/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Shared
File Name              :        error-timeout.component.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        20/09/2018
Description            :        This component is used in case the application is refreshed at a sensitive page
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';

import { AppConfig } from '../../../app.config';

@Component({
	selector: 'app-error-timeout',
	templateUrl: './error-timeout.component.html',
	styleUrls: ['./error-timeout.component.scss']
})
export class ErrorTimeoutComponent implements OnInit {

	contactNumber = AppConfig.settings.CONTACT_NUMBER;
	createApplicationUrl = '';

	constructor(
		private location: Location,
		private pageLoaderSvc: PageLoaderService
	) { }

	ngOnInit() {
		this.pageLoaderSvc.hide();
		const applicationType = this.location.path().split('/');
		this.createApplicationUrl = '/' + applicationType[1];
	}

}
