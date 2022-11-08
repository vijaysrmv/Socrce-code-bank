/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Resume
File Name              :        saved-applications.component.ts
Author                 :
Date (DD/MM/YYYY)      :
Description            :
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ResumeService } from '../../services/resume.service';
import { DataService } from '../../../core/services/data.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { APPLICATION_TYPE, BACKEND_STATE, BACKEND_ACCOUNT, IBPS_STATUS, PRODUCTLIST } from '../../../core/models/enums';
import { UserApplications } from '../../../core/models/resume.model';
import { SessionService } from '../../../core/services/session.service';
import { SharedMdmService } from '../../../shared/services/shared-mdm.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';

@Component({
	selector: 'app-saved-applications',
	templateUrl: './saved-applications.component.html',
	styleUrls: ['./saved-applications.component.scss']
})
export class SavedApplicationsComponent implements OnInit {

	productList: Array<string>;
	savedApplications: Array<any>;
	selectedApplication: Object;
	userName: String;
	productNames = PRODUCTLIST;
	applicationType = APPLICATION_TYPE;
	ibpsStatus = IBPS_STATUS;
	application = 'application';
	// savedApplications: Array<any> = [];

	constructor(
		private resumeService: ResumeService,
		private dataService: DataService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router,
		private session: SessionService,
		private sharedMdm: SharedMdmService
	) { }

	ngOnInit() {
		this.getData();
	}

	getData() {
		this.dataService.savedApplications.subscribe((data: UserApplications) => {
			this.savedApplications = data.arninfo;
			this.application = this.savedApplications.length > 1 ? 'applications' : 'application';
			this.userName = data['firstname'] ? data['firstname'].toUpperCase() : data['lastname'];
			this.pageLoaderSvc.hide();
		});
	}

	getTimeStamp(datetime: string) {
		const time = new Date(datetime);
		return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
	}

	resumeApplication(application: any) {
		if (!this.disableApplication(application.ibpsstate)) {
			// if (application.uistate !== 'referred') {
			this.pageLoaderSvc.show(true, false);
			sessionStorage.setItem('arn', application.arn);
			// sessionStorage.setItem('productIdList', JSON.stringify(application.products));
			this.selectedApplication = application;
			this.resumeData();
		}
	}

	resumeData() {
		const data = { arns: '' }; // {arns: sessionStorage.getItem('arn')}; // { arns: '' };
		data.arns = this.savedApplications.map(application => application.arn).join(',');
		this.resumeService.resumeApplication(data).subscribe((application: ApplicationDetails) => {
			this._resumeApplication();
		}, (error) => {
			if (error.error.code === 2019) {
				throw new ApplicationError('1017');
			} else if (error.error.code === 2089) {
				throw new ApplicationError('2030');
			}
			this.pageLoaderSvc.hide();
		});
	}

	_resumeApplication() {
		sessionStorage.setItem('applicationFlow', 'resume');
		// sessionStorage.setItem('productIdList', this.selectedApplication['products'].toString());
		const accountType = this.selectedApplication['applicationtype'];
		let uistate = this.selectedApplication['uistate'];
		if (uistate === 'docusign') {
			this._redirectToDocuSign();
		} else {
			if (uistate === 'reviewInProgress') {
				sessionStorage.setItem('uistate', uistate);
				uistate = 'review';
			}
			if (uistate.indexOf('responsibleInfo') !== -1) {
				sessionStorage.setItem('pid', uistate.split('-')[1]);
				uistate = uistate.split('-')[0];
			}
			if (uistate.indexOf('jointInfo') !== -1) {
				const pid = +uistate.split('-')[1] + 1;
				sessionStorage.setItem('pid', pid.toString());
				uistate = uistate.split('-')[0];
			}
			const page = BACKEND_STATE[uistate];
			console.log(page, uistate);
			const account = BACKEND_ACCOUNT[accountType];
			this._retrieveMdmData(account, this.selectedApplication);
			this.pageLoaderSvc.show(true, false);
			this.router.navigate(['/' + account + '/' + page]);
		}
	}

	_retrieveMdmData(accountType: string, selectedApplication: any) {
		if ((accountType === 'business-deposit' || accountType === 'consumer-deposit') && !this.sharedMdm.sharedMdmData) {
			this.sharedMdm.fetchSharedMdmData();
		}
	}

	uploadDocument(application) {
		if (application.ibpsstate === 'COMMUNICATION_HOLD') {
			this.pageLoaderSvc.show(true, false);
			const arn = application.arn;
			sessionStorage.setItem('arn', arn);
			// sessionStorage.setItem('arns', this.savedApplications.map(savedApplication => savedApplication.arn).join(','));
			const data = { arns: this.savedApplications.map(savedApplication => savedApplication.arn).join(',') };
			this.resumeService.resumeApplication(data).subscribe(() => {
				this.router.navigate(['resume/upload-document']);
			});
		}
	}

	private _redirectToDocuSign() {
		this.resumeService.getDocusignUrl().subscribe(data => {
			if (data.viewurl && data.viewurl !== '') {
				window.location.href = data.viewurl;
			} else if (data.message && data.message !== '') {
				const account = BACKEND_ACCOUNT[this.selectedApplication['applicationtype']];
				this.router.navigate(['/' + account + '/' + BACKEND_STATE[data.message]]);
			}
		});
		// this.resumeService.getDocusignUrl().subscribe(url => {
		// 	if (url && url !== '') {
		// 		window.location.href = url;
		// 	}
		// });
	}

	// private _redirectToPlaidScreen(account: string) {
	// 	// this.resumeService.getAccountFundingPageStatus().subscribe(data => {
	// 	// 	console.log(data);
	// 	// });
	// 	this.resumeService.getPlaidAccessToken().subscribe(data => {
	// 		this.router.navigate([`/${account}/plaid/${data}`]);
	// 	});
	// 	// this.resumeService.getAccountFundingPageStatus().subscribe(data => {
	// 	// 	console.log('review', data);
	// 	// 	if (data.type === 'SAME-DAY MICRO-DEPOSIT') {
	// 	// 		this.resumeService.getPlaidAccessToken().subscribe(val => {
	// 	// 			this.router.navigate(['/consumer-deposit/plaid/' + data[0].token]);
	// 	// 		});
	// 	// 	} else if (data.type === 'AUTOMATED MICRO-DEPOSIT' && data.status === 'success') {
	// 	// 		this.router.navigate(['/consumer-deposit/finish/ach-success']);
	// 	// 	} else if (data.type === 'AUTOMATED MICRO-DEPOSIT' && data.status === 'inprogress') {
	// 	// 		this.router.navigate(['/consumer-deposit/finish/ach-inprogress']);
	// 	// 	}
	// 	// });
	// }

	logout() {
		this.session.clearSession();
		this.router.navigate(['resume/track-application']);
	}

	disableApplication(ibpsstate) {
		switch (ibpsstate) {
			case 'PENDING_SUBMISSION':
			case 'PENDING_DOCSIGN':
			case 'PENDING_FUNDING':
			case 'COMPLETED':
			case 'COUNTER_OFFER':
				return false;

			case 'HOLD':
			case 'PENDING_REVIEW':
			case 'SUBMIT_FAILED':
			case 'INSTANT_DECLINED':
			case 'OPERATIONS_DECLINED':
			case 'CANCELLED':
			case 'DISCARDED':
			case 'ADDITIONAL_DOCUSIGN_PENDING':
			case 'DOCUSIGN_DECLINE':
			case 'IN_PROCESSING':
			case 'PENDING_DISBURSEMENT':
			case 'COMMUNICATION_HOLD':
				return true;

			default:
				return true;
		}
	}

}
