/*------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Resume
File Name              :        verify-otp.component.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        25/02/2019
Description            :        Verify otp component to validate otp sent to user
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { OtpComponent } from '../../../shared/components/otp/otp.component';

import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';
import { OtpService } from '../../../shared/services/otp.service';

@Component({
	selector: 'verify-otp',
	templateUrl: './verify-otp.component.html',
	styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit {

	@ViewChild(OtpComponent, {static: false}) otpComponentRef: OtpComponent;
	private otpCounter = 0;

	constructor(
		private otpService: OtpService,
		private dataService: DataService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router
	) { }

	ngOnInit() { }

	validateOtp($event) {
		this.pageLoaderSvc.show(true, false);
		this.otpService.validateOtp($event.otp).subscribe((data: any) => {
			this.dataService.updateSavedApplications(data);
			this.router.navigate(['/resume/saved-applications']);
			sessionStorage.removeItem('hashcode');
		}, error => {
			this.otpCounter++;
			this.pageLoaderSvc.hide();
			if (this.otpCounter >= 3) {
				this.router.navigate(['/resume']);
			} else if (error.error && error.error.code) {
				this.otpComponentRef.clearOtp();
				throw new ApplicationError(error.error.code);
			}
		});
	}

}
