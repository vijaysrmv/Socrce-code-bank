/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Shared Module
File Name              :        finish.service.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        01/03/2019
Description            :        finish page component
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

import { PageLoaderService } from "../../../core/components/page-loader/page-loader.service";
import { DataService } from "../../../core/services/data.service";
import { SessionService } from "../../../core/services/session.service";
import { SharedService } from "../../services/shared.service";

import { ApplicationDetails } from "../../../core/models/application.model";
import { ACCOUNT_TYPE } from "../../../core/models/enums";
import { AppConfig } from "../../../app.config";

@Component({
	selector: "app-finish",
	templateUrl: "./finish.component.html",
	styleUrls: ["./finish.component.scss"],
	providers: [SharedService],
})
export class FinishComponent implements OnInit {
	applicationStatus: string;
	applicant: string;
	userName: string;
	workitem: string;
	transactionId: string;
	paymentAmount: string;
	authorizedDate: string;
	expectedDate: string;
	timeoutResumeCases = ["review", "save-exit", "additional-sign-pending", "funding-inprogress"];
	contactNumber = AppConfig.settings.CONTACT_NUMBER;
	hideExpected = false;

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _location: Location,
		private _sharedSvc: SharedService,
		private dataService: DataService,
		private pageLoaderSvc: PageLoaderService,
		private session: SessionService
	) {}

	ngOnInit() {
		const account = ACCOUNT_TYPE[this._location.path().split("/")[1]];
		this.applicationStatus = this._activatedRoute.snapshot.params["status"].toLowerCase();
		const arn = sessionStorage.getItem("arn");
		const canResume = arn && this.timeoutResumeCases.indexOf(this.applicationStatus) !== -1 ? true : false;
		this.dataService.changeResumeStatus({ checkValue: true, resume: canResume });

		if (this.applicationStatus === "additional-sign-pending") {
			if (account === "consumerDeposit") {
				this.applicant = "joint applicants";
			}
		}
		// if (this.applicationStatus === 'ach-inprogress') {
		// 	this.transactionId = this._location.path().split('/')[4];
		// }
		if (arn) {
			this._sharedSvc.getConsumerData(arn).subscribe(
				(data: ApplicationDetails) => {
					this.workitem = data.workitem;
					if (account === "consumerDeposit") {
						this.userName = data.personaldetails["firstname"]
							? data.personaldetails["firstname"] + " " + data.personaldetails["lastname"]
							: data.personaldetails["lastname"];
					} else if (account === "businessDeposit") {
						this.userName = data.responsibledetails[0]["firstname"]
							? data.responsibledetails[0]["firstname"] + " " + data.responsibledetails[0]["lastname"]
							: data.responsibledetails["lastname"];
					} else {
						if (data.personaldetails) {
							this.userName = data.personaldetails["firstname"]
								? data.personaldetails["firstname"] + " " + data.personaldetails["lastname"]
								: data.personaldetails["lastname"];
						}
						if (data.responsibledetails && data.responsibledetails.length > 0) {
							this.userName = data.responsibledetails[0]["firstname"]
								? data.responsibledetails[0]["firstname"] + " " + data.responsibledetails[0]["lastname"]
								: data.responsibledetails["lastname"];
						}
					}
					this.userName = this.userName.toUpperCase();
					const user_mainHeader = <HTMLElement>document.querySelector("#userNameHeader");
					if (user_mainHeader) {
						user_mainHeader.setAttribute("tabindex", "-1");
						user_mainHeader.style.outline = "none";
						user_mainHeader.focus();
					}
					if (this.applicationStatus === "ach-inprogress") {
						this.paymentAmount = data["achdetails"] ? data["achdetails"]["paymentamount"] : "";
						this.authorizedDate = data["achdetails"] ? data["achdetails"]["authorizeddate"] : "";
						if (this.paymentAmount && this.authorizedDate) {
							this.hideExpected = false;
							this._getDateByBusinessDays();
						} else {
							this.hideExpected = true;
							this.pageLoaderSvc.hide();
						}
					} else {
						this.pageLoaderSvc.hide();
					}
					this.session.clearSession();
				},
				(error) => {
					this.pageLoaderSvc.hide();
				}
			);
		} else {
			// const username = sessionStorage.getItem('username');
			// this.userName = username;
			if (sessionStorage.username) {
				this.userName = sessionStorage.getItem("username");
			}
			this.pageLoaderSvc.hide();
		}
	}

	_getDateByBusinessDays() {
		this._sharedSvc.getDateByBusinessDays(this.authorizedDate, 5).subscribe(
			(result) => {
				this.expectedDate = result.expecteddate;
				this.pageLoaderSvc.hide();
			},
			(error) => {
				this.pageLoaderSvc.hide();
			}
		);
	}

	resume() {
		window.location.href = "/resume";
	}
}
