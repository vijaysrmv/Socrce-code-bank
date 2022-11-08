import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { SelectAccountComponent } from '../select-account/select-account.component';
import { PlaidService } from './plaid.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { DataService } from '../../../core/services/data.service';

import { BACKEND_ACCOUNT } from '../../../core/models/enums';
import { AppConfig } from '../../../app.config';
declare let Plaid: any;

@Component({
	selector: 'app-plaid',
	templateUrl: './plaid.component.html',
	styleUrls: ['./plaid.component.scss'],
	providers: [PlaidService]
})
export class PlaidComponent implements OnInit {

	@ViewChild(SelectAccountComponent, { static: false }) selectChoice: SelectAccountComponent;

	@Input() totalAmount: any;
	@Input() productList: any;

	@Output() plaidExit = new EventEmitter();

	applicationType: any;
	accountType: string;
	newPublicToken: any;
	plaidHandler: any;
	public_token: any;
	plaidKey = AppConfig.settings.PLAID_KEY;
	plaidEnvironment = AppConfig.settings.PLAID_ENV;

	constructor(
		private dataService: DataService,
		private plaidService: PlaidService,
		private pageLoaderSvc: PageLoaderService,
		private _activatedRoute: ActivatedRoute,
		private _location: Location,
		private router: Router
	) { }

	ngOnInit() {
		this.pageLoaderSvc.show(true, false);
		this.dataService.currentStateCheck.subscribe(resp => {
			this.applicationType = resp.accountType;
		});
		this.accountType = this._location.path().split('/')[2];
		if (this.accountType === 'plaid') {
			this.newPublicToken = sessionStorage.getItem('plaidtoken');
			this.createPlaid(this.newPublicToken);
		} else {
			this.createPlaid(this.newPublicToken);
		}
	}

	openhandler() {
		this.plaidHandler.open();
	}

	createPlaid(token) {
		const plaidObj = this;
		const arn = sessionStorage.getItem('arn');
		const currentLocation = window.location.hostname;
		const webhook = `https://${currentLocation}/api/application/${arn}/plaid/webhook/validate/`;
		this.plaidHandler = Plaid.create({
			clientName: 'Citizen Community Federal Bank',
			countryCodes: ['US'],
			env: plaidObj.plaidEnvironment,
			key: plaidObj.plaidKey,
			product: ['auth'],
			webhook: webhook,
			language: 'en',
			userLegalName: 'Citizen Community Federal Bank OAO',
			userEmailAddress: 'onlineaccountopening@firstchoicebankca.com',
			token: token,
			onLoad: function () {
			},
			onSuccess: function (public_token, metadata) {
				plaidObj.pageLoaderSvc.show(true, false);
				if (metadata.accounts.length === 1 && (metadata.accounts[0].verification_status === 'pending_manual_verification' || metadata.accounts[0].verification_status === 'manually_verified')) {
					plaidObj.validateAccount(public_token, metadata.accounts[0].id, metadata);
				} else if (metadata.account_id === null) {
					plaidObj.getAccountid(public_token, metadata);
				} else {
					plaidObj.validateAccount(public_token, metadata.account_id, metadata);
				}
			},
			onExit: function (err, metadata) {
				plaidObj.pageLoaderSvc.show(true, false);
				const account = BACKEND_ACCOUNT[plaidObj.applicationType];
				if (err && err.error_code === 'TOO_MANY_VERIFICATION_ATTEMPTS') {
					plaidObj.router.navigate(['/' + account + '/account-funding']);
					throw new ApplicationError('2158');
				} else if (err != null) {
				} else if (plaidObj.accountType === 'plaid') {
					plaidObj.router.navigate(['/' + account + '/funding/plaid']);
				} else {
					plaidObj.plaidExit.emit();
				}
				plaidObj.pageLoaderSvc.hide();
			},
		});
		this.openhandler();
	}

	getAccountid(public_token: any, metadata: any) {
		this.public_token = public_token;
		const reqObj = {
			fundingview: {
				totalamount: this.totalAmount,
				transfertype: 'ach',
				productlist: this.productList,
			},
			plaidview: {
				public_token: public_token
			}
		};
		this.plaidService.getAccountid(reqObj).subscribe((data: any) => {
			this.selectChoice.showChoices(data.numbers.ach);
		}, error => {
			this.pageLoaderSvc.hide();
			throw new ApplicationError(error.error.code);
		});
	}

	selectAccount(account: any) {
		this.validateAccount(this.public_token, account.account_id);
	}

	discardFunding(event: any) {
		this.plaidService.discardFunding().subscribe((data: any) => {
			// console.log('discarded');
			this.plaidExit.emit();
		}, error => {
			this.pageLoaderSvc.hide();
			this.plaidExit.emit();
			throw new ApplicationError(error.error.code);
		});
	}

	validateAccount(public_token: any, id: any, metadata?: any) {
		if (metadata && metadata.accounts.length && metadata.accounts[0].verification_status === 'manually_verified') {
			metadata.accounts[0].verification_status = 'pending_manual_verification';
		}
		let accountBody = {};
		if (metadata) {
			accountBody = {
				fundingview: {
					totalamount: this.totalAmount,
					transfertype: 'ach',
					productlist: this.productList,
				},
				plaidview: {
					public_token: public_token,
					accountId: id,
					verification_status: metadata.accounts[0].verification_status
				}
			};
		} else {
			accountBody = {
				plaidview: {
					public_token: public_token,
					accountId: id,
				}
			};
		}
		const account = BACKEND_ACCOUNT[this.applicationType];
		this.plaidService.validatePlaidAccount(accountBody).subscribe((resp: any) => {
			this.pageLoaderSvc.hide();
			if (resp === 'applicationCompleted') {
				this.router.navigate(['/' + account + '/finish/success']);
			} else if (resp === 'achInProgress') {
				this.router.navigate(['/' + account + '/funding/ach-inprogress']);
			} else if (resp === 'MDInProgress') {
				this.router.navigate(['/' + account + '/funding/plaid']);
			} else if (resp === 'AMDInProgress') {
				this.router.navigate(['/' + account + '/funding/amd-inprogress']);
			}
		}, error => {
			if (error.error.code === 2114) {
				this.plaidExit.emit();
				this.router.navigate(['/' + account + '/account-funding/insufficient-funds']);
				// throw new ApplicationError('1015');
			} else {
				this.plaidExit.emit();
				// this.pageLoaderSvc.hide();
				throw new ApplicationError(error.error.code);
			}
		});
	}

}
