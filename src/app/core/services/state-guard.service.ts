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
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';



import { OaoService } from '../apis/oao.service';

import { environment } from '../../../environments/environment';


@Injectable()
export class StateGuard implements CanActivate {

	sessionHash: string;
	sessionArn: string;
	sessionToken: string;

	constructor(
		private _oaoService: OaoService,
		private router: Router
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve) => {
			if (environment.ENABLE_ROUTE_GUARD) {

				const currentRoute = state.url.split('?')[0];
				const zipcode = sessionStorage.getItem('zipcode');
				// const qualificationDetails = sessionStorage.getItem('qualificationDetails');
				const eligibilityQuestions = sessionStorage.getItem('eligibilityQuestions');
				const sessionProductList = sessionStorage.getItem('productIdList');
				const tyfoneDetails = sessionStorage.getItem('tyfonedetails');

				this.sessionArn = sessionStorage.getItem('arn');
				this.sessionHash = sessionStorage.getItem('hashcode');
				this.sessionToken = sessionStorage.getItem('token');

				const UIStates = this.UiStateMap(currentRoute);

				if (currentRoute.indexOf('/resume/') === 0) {
					let currentUserRoute;
					UIStates.uistateRoutes.forEach(uistate => {
						if (currentRoute === uistate.route) {
							currentUserRoute = uistate;
						}
					});
					if (currentUserRoute && currentUserRoute['hash'] && this.sessionHash !== null) {
						resolve(true);
					} else if (currentUserRoute && currentUserRoute['token'] && this.sessionToken !== null) {
						resolve(true);
					} else {
						if (UIStates.statelessRoutes.indexOf(currentRoute) !== -1) {
							resolve(true);
						} else {
							this.redirectToGettingStarted(currentRoute);
							resolve(false);
						}
					}
				} else {
					if (UIStates.ignoreRoutes.indexOf(currentRoute) !== -1) {
						resolve(true);
					} else if (UIStates.statelessRoutes.indexOf(currentRoute) !== -1) {
						const decision = this._checkForStateLessRoutes(currentRoute, zipcode, eligibilityQuestions, sessionProductList, tyfoneDetails);
						if (decision) {
							resolve(true);
						} else {
							this.redirectToGettingStarted(currentRoute);
							resolve(false);
						}
					} else {
						if (currentRoute.indexOf('/resume/') === 0) {
							let currentUserRoute;
							UIStates.uistateRoutes.forEach(uistate => {
								if (currentRoute === uistate.route) {
									currentUserRoute = uistate;
								}
							});
							const decision = this._getResumeNavigationDecision(currentUserRoute);
							if (decision) {
								resolve(true);
							} else {
								this.redirectToGettingStarted(currentRoute);
								resolve(false);
							}
						} else {
							if (this.sessionArn) {
								this._oaoService.getNextUIState(this.sessionArn).subscribe(backendState => {
									let currentUserRoute;
									let expectedUserRoute;
									backendState.nextuistate = backendState.nextuistate.split('-')[0];
									UIStates.uistateRoutes.forEach(uistate => {
										if (currentRoute === uistate.route) {
											currentUserRoute = uistate;
										}
										if (backendState.nextuistate === uistate.uiState || (backendState.nextuistate === 'reviewInProgress' && uistate.uiState === 'review')) {
											expectedUserRoute = uistate;
										}
									});
									if (currentUserRoute && expectedUserRoute && currentUserRoute.index <= expectedUserRoute.index) {
										resolve(true);
									} else {
										this.redirectToGettingStarted(currentRoute);
										resolve(false);
									}
								});
							} else {
								this.redirectToGettingStarted(currentRoute);
								resolve(false);
							}
						}
					}
				}
			} else {
				return resolve(true);
			}
		});

	}

	UiStateMap(url) {
		if (url.indexOf('/consumer-deposit/') === 0) {
			const consumer = {
				statelessRoutes: [
					'/consumer-deposit/select-product',
					'/consumer-deposit/personal-details',
					'/consumer-deposit/finish/success',
					'/consumer-deposit/finish/review',
					'/consumer-deposit/finish/denied',
					// '/consumer-deposit/finish/denied-application',
					'/consumer-deposit/finish/save-exit',
					'/consumer-deposit/finish/additional-sign-pending',
					'/consumer-deposit/finish/funding-inprogress',
					'/consumer-deposit/finish/funding-locked',
					'/consumer-deposit/finish/cancelled',
					'/consumer-deposit/funding/ach-inprogress',
					'/consumer-deposit/funding/amd-inprogress',
					'/consumer-deposit/funding/plaid',
					'/consumer-deposit/plaid',
				],
				uistateRoutes: [
					{ route: '/consumer-deposit/joint-details', uiState: 'jointInfo', index: 1 },
					{ route: '/consumer-deposit/beneficiary-details', uiState: 'beneficiaryInfo', index: 2 },
					{ route: '/consumer-deposit/review', uiState: 'review', index: 3 },
					{ route: '/consumer-deposit/due-diligence-questionnaire', uiState: 'consumerDueDiligence', index: 4 },
					{ route: '/consumer-deposit/disclosure', uiState: 'servicesOffered', index: 5 },
					{ route: '/consumer-deposit/account-funding', uiState: 'accountFunding', index: 6 },
					{ route: '/consumer-deposit/plaid', uiState: 'MDInProgress', index: 7 }
				],
				ignoreRoutes: [
					'/consumer-deposit/finish/unserved-state',
					'/consumer-deposit/finish/error',
				]
			};
			return consumer;
		} else if (url.indexOf('/business-deposit/') === 0) {
			const business = {
				statelessRoutes: [
					'/business-deposit/select-product',
					'/business-deposit/responsible-details',
					'/business-deposit/finish/success',
					'/business-deposit/finish/review',
					'/business-deposit/finish/denied',
					// '/business-deposit/finish/denied-application',
					'/business-deposit/finish/save-exit',
					'/business-deposit/finish/additional-sign-pending',
					'/business-deposit/finish/funding-inprogress',
					'/business-deposit/finish/funding-locked',
					'/business-deposit/finish/cancelled',
					'/business-deposit/funding/ach-inprogress',
					'/business-deposit/funding/amd-inprogress',
					'/business-deposit/funding/plaid',
					'/business-deposit/plaid',
				],
				uistateRoutes: [
					// { route: '/business-deposit/responsible-details', uiState: 'responsibleInfo', index: 1 },
					// { route: '/business-deposit/additional-responsible-details', uiState: 'additionalResponsibleInfo', index: 1 },
					// { route: '/business-deposit/authorizer-details', uiState: 'authorizerInfo', index: 2 },
					{ route: '/business-deposit/business-details', uiState: 'businessInfo', index: 1 },
					// { route: '/business-deposit/additional-business-details', uiState: 'additionalBusinessInfo', index: 2 },
					{ route: '/business-deposit/review', uiState: 'review', index: 2 },
					{ route: '/business-deposit/due-diligence-questionnaire', uiState: 'consumerDueDiligence', index: 3 },
					{ route: '/business-deposit/upload-documents', uiState: 'documentUpload', index: 4 },
					{ route: '/business-deposit/disclosure', uiState: 'servicesOffered', index: 5 },
					{ route: '/business-deposit/account-funding', uiState: 'accountFunding', index: 6 },
					{ route: '/business-deposit/plaid', uiState: 'MDInProgress', index: 7 }
				],
				ignoreRoutes: [
					// '/business-deposit/finish/unserved-business',
					'/business-deposit/finish/unserved-state',
					'/business-deposit/finish/error',
				]
			};
			return business;
		} else if (url.indexOf('/resume/') === 0) {
			const resume = {
				statelessRoutes: [
					'/resume/finish/document-upload-success',
					'/resume/finish/document-upload-exit',
					// '/resume/finish/save-exit',
				],
				uistateRoutes: [
					{ route: '/resume/verify-otp', uiState: '', index: 1, hash: true, token: false, arn: false },
					{ route: '/resume/saved-applications', uiState: '', index: 2, hash: false, token: true, arn: false },
					{ route: '/resume/upload-document', uiState: '', index: 3, hash: false, token: true, arn: true }
				],
				ignoreRoutes: ['']
			};
			return resume;
		}
	}

	redirectToGettingStarted(url) {
		if (url.indexOf('/consumer-deposit/') === 0) {
			this.router.navigate(['/consumer-deposit/errors/timeout']);
		} else if (url.indexOf('/business-deposit/') === 0) {
			this.router.navigate(['/business-deposit/errors/timeout']);
		} else if (url.indexOf('/resume/') === 0) {
			this.router.navigate(['/resume/errors/timeout']);
		}
	}

	private _getResumeNavigationDecision(currentUserRoute: string): boolean {
		if (currentUserRoute) {
			switch (currentUserRoute['route']) {
				case '/resume/verify-otp':
					if (currentUserRoute['hash'] && this.sessionHash !== null) {
						return true;
					}
					return false;
				case '/resume/saved-applications':
					if (currentUserRoute['token'] && this.sessionToken !== null) {
						return true;
					}
					return false;
				case '/resume/upload-document':
					if (currentUserRoute['arn'] && currentUserRoute['token'] && this.sessionArn !== null && this.sessionToken !== null) {
						return true;
					}
					return false;
			}
		} else {
			return false;
		}
	}

	private _checkForStateLessRoutes(currentRoute: string, zipcode: string, eligibilityQuestions: string, sessionProductList: string, tyfoneDetails: string) {
		switch (currentRoute) {
			case '/consumer-deposit/personal-details':
				if (tyfoneDetails) {
					if (sessionProductList && !zipcode) {
						return true;
					} else {
						return false;
					}
				} else if (this.sessionArn) {
					if (this.sessionToken) {
						return true;
					} else {
						return false;
					}
				} else {
					if (sessionProductList && zipcode) {
						return true;
					} else {
						return false;
					}
				}
			case '/consumer-deposit/select-product':
				if (tyfoneDetails) {
					if (!zipcode) {
						return true;
					} else {
						return false;
					}
				} else {
					if (zipcode) {
						return true;
					} else {
						return false;
					}
				}
			case '/business-deposit/responsible-details':
				if (this.sessionArn) {
					// if (this.sessionToken && sessionProductList && eligibilityQuestions)
					if (this.sessionToken) {
						return true;
					} else {
						return false;
					}
				} else {
					if (sessionProductList && eligibilityQuestions) {
						return true;
					} else {
						return false;
					}
				}
			case '/business-deposit/select-product':
				if (tyfoneDetails) {
					if (!eligibilityQuestions) {
						return true;
					} else {
						return false;
					}
				} else {
					if (eligibilityQuestions) {
						return true;
					} else {
						return false;
					}
				}
			default:
				if (this.sessionArn) {
					return true;
				} else {
					return false;
				}
		}
	}

}

// @Injectable()
// export class IpRestrictCheck implements CanActivate {

// 	private isIbpsFlow = false;
// 	constructor(
// 		private consumerSvc: ConsumerService,
// 		private router: Router,
// 		private store: Store<any>
// 	) {
// 		this.store.select('ibpsStore').subscribe(ibpsFlowCheck => {
// 			this.isIbpsFlow = ibpsFlowCheck.state;
// 		});
// 	}

// 	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
// 		if (this.isIbpsFlow) {
// 			return of(true);
// 		} else {
// 			return this.consumerSvc.authorizeIP().map((response) => {
// 				return response['message'] === 'success';
// 			}).catch((error) => {
// 				if (error.status === 400) {
// 					this.router.navigate(['errors/unauthorized']);
// 				} else {
// 					this.router.navigate(['errors/technical-error']);
// 				}
// 				return of(false);
// 			});
// 		}
// 	}

// }
