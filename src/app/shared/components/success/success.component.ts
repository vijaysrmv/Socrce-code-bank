/*--------------------------------------------------------------------------------------------------------
				NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  : 		PES
Project/Product        : 		Newgen - OAO
Application            : 		Newgen Portal
Module                 :		Shared
File Name              : 		success.component.ts
Author                 : 		Amir Masood
Date (DD/MM/YYYY)      : 		02/05/2019
Description            : 		Success page component
-------------------------------------------------------------------------------------------------------
				CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { forkJoin } from 'rxjs';

import { slideUpDownAnimation, slideProductPopupAnimation } from '../../../shared/animations/slide.animation';

import { SuccessService } from './success.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { APPLICANT_TYPE } from '../../../core/models/enums';
import { Product } from '../../../core/models/product.model';

@Component({
	selector: 'app-success',
	animations: [slideUpDownAnimation, slideProductPopupAnimation],
	templateUrl: './success.component.html',
	styleUrls: ['./success.component.scss'],
	providers: [
		SuccessService
	]
})
export class SuccessComponent implements OnInit {

	tiggerWindowClose = true;
	userName: string;
	selectedAccount: any;
	accountNumber: string;
	products: Array<Product>;
	accountType: string;
	consumerData: ApplicationDetails;
	applicantType: string;
	selectedPid = '';
	primaryApplicant: any;
	applicantList: any;
	// authorizerRequiredError = false;
	selectedProduct = '';
	selectedApplicants = [];

	@HostListener('window:beforeunload', ['$event'])
	onBeforeUnload($event) {
		console.log($event)
		if (this.tiggerWindowClose) {
			//	this._successSvc.logout().subscribe();
			console.log("Here");
		}
	}

	constructor(
		private pageLoaderSvc: PageLoaderService,
		private dataService: DataService,
		private _successSvc: SuccessService
	) { }

	ngOnInit() {
		this.dataService.changeStepper({ name: '/consumer-deposit/finish/success', index: 5, personalStepper: 'consumerDeposit' });
		this.dataService.currentStateCheck.subscribe(resp => {
			this.accountType = resp.accountType;
			const observable = forkJoin(
				this._successSvc.getConsumerData(),
				this._successSvc.getSelectedProductsDetails(),
			);
			observable.subscribe(result => {
				this.consumerData = result[0];
				this.products = result[1];
				if (this.accountType === 'consumerDeposit') {
					this.applicantType = 'consumerJoint';
					this.userName = this.consumerData.personaldetails['firstname'] ?
						(this.consumerData.personaldetails['firstname'] + ' ' + this.consumerData.personaldetails['lastname'])
						: this.consumerData.personaldetails['lastname'];
				}
				if (this.accountType === 'businessDeposit') {
					this.applicantType = 'businessApplicant';
					this.userName = this.consumerData.responsibledetails[0]['firstname'] ?
						(this.consumerData.responsibledetails[0]['firstname'] + ' ' + this.consumerData.responsibledetails[0]['lastname'])
						: this.consumerData.responsibledetails['lastname'];
				}
				const user_mainHeader = <HTMLElement>document.querySelector('#userNameHeader');
				if (user_mainHeader) {
					user_mainHeader.setAttribute('tabindex', '-1');
					user_mainHeader.style.outline = 'none';
					user_mainHeader.focus();
				}
				this.pageLoaderSvc.hide();
			}, err => {
				this.pageLoaderSvc.hide();
			});
		});
	}

	closePopUp() {
		this.selectedProduct = '';
	}

	selectAndSubmit(selectedAccount) {
		// if (this.applicantType === 'businessApplicant' && !this.selectedPid) {
		// 	this.authorizerRequiredError = true;
		// } else {
		// 	this.authorizerRequiredError = false;
		// 	this.submitChoice(this.selectedPid, selectedAccount);
		// }
		console.log(this.applicantList);
		this.submitChoice(selectedAccount);
	}

	onSelectApplicant(applicant) {
		// const index = this.selectedApplicants.findIndex(data => data.id === applicant.pid);
		// if (index === -1) {
		// 	this.selectedApplicants.push({applicant});
		// }else {
		// 	this.selectedApplicants.splice(index, 1);
		// }
	}

	orderChecks(selectedAccount) {
		this.selectedPid = null;
		// this.authorizerRequiredError = false;
		this.applicantList = this._getApplicantList(this.accountType);
		if (this.applicantList && this.applicantList.length > 0) {
			this.selectedProduct = selectedAccount.productname;
		} else {
			this.submitChoice(selectedAccount);
		}
	}

	// orderChecks(product: Product) {
	// 	this._successSvc.getOrderCheckResponse(product, this.accountType).subscribe((data) => {
	// 		const win = window.open('', '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
	// 		win.document.body.innerHTML = data.url;
	// 		win.document.onload =  (<any>win.document).myForm.submit();
	// 	});
	// }

	_getApplicantList(accountType: string): { id: number; name: string; }[] {
		const applicantList = [];
		// const primaryApplicant = [];
		if (accountType === 'consumerDeposit') {
			this.primaryApplicant = {
				pid: 1,
				name: this.consumerData.personaldetails.firstname + ' ' + this.consumerData.personaldetails.lastname,
				selected: true,
				applicanttype: 'PRIMARY'
			};
			if (this.consumerData.jointdetails && this.consumerData.jointdetails.length > 0) {
				this.consumerData.jointdetails.forEach((item) => {
					applicantList.push({ pid: item.pid, name: item['firstname'] + ' ' + item['lastname'], applicanttype: 'JOINT', selected: false });
				});
			}
			// this.selectedApplicants.push(this.primaryApplicant);
			return applicantList;
		}
		// if (accountType === 'businessDeposit') {
		// 	// if (accountType === 'businessDeposit' && this.consumerData.responsibledetails) {
		// 	this.primaryApplicant = {
		// 		pid: 0,
		// 		name: this.consumerData.businessdetails.businessname,
		// 		selected: true
		// 	};
		// 	// this.consumerData.responsibledetails.forEach((item) => {
		// 	// 	if (item.relationship.isauthorized) {
		// 	// 		applicantList.push({ pid: item.pid, name: item['firstname'] + ' ' + item['lastname'] });
		// 	// 	}
		// 	// });
		// 	return applicantList;
		// }
	}

	submitChoice(product: any) {
		const applicantList = this.applicantList.filter(applicant => applicant.selected === true);
		applicantList.push(this.primaryApplicant);
		// this.pageLoaderSvc.show(true, false);
		const reqData = this._setRequestData(applicantList, product);
		console.log(reqData);
		// this._successSvc.getOrderCheckResponse(product, this.accountType).subscribe((data) => {
		// 	const win = window.open('', '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
		// 	win.document.body.innerHTML = data.url;
		// 	win.document.onload = (<any>win.document).myForm.submit();
		// });
		// this._successSvc.getOrderCheckResponse(reqData).subscribe((data) => {
		// 	this.pageLoaderSvc.hide();
		// 	const win = window.open('', '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
		// 	win.document.body.innerHTML = data.url;
		// 	win.document.onload =  (<any>win.document).myForm.submit();
		// }, error => {
		// 	this.pageLoaderSvc.hide();
		// 	throw new ApplicationError(error);
		// });
	}

	_setRequestData(applicantlist, product) {
		return {
			productid: product.productid,
			accountnumber: product.accountnumber,
			applicants: applicantlist
		};
	}

	printData() {
		window.print();
	}

	enrollNow() {
		const url = this.accountType === 'consumerDeposit' ? 'https://www.newgensoft.com/' : 'https://www.newgensoft.com/';
		console.log(url)
		//window.open(url, '_blank', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
	}

	onFinishExit() {
		console.log("I am here")
		this.pageLoaderSvc.show(true, false);
		window.location.href = 'https://www.newgensoft.com/'
		
		/*this._successSvc.logout().subscribe(() => {
			this.tiggerWindowClose = false;
			window.location.href = 'https://www.newgensoft.com/';
		});*/
	}

}
