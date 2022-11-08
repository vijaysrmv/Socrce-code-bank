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

import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { Location, LocationStrategy, PathLocationStrategy, PlatformLocation } from "@angular/common";
import { FormControlName } from "@angular/forms";
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from "@angular/router";

import { ModalDirective } from "ngx-bootstrap/modal";
import { UserIdleService } from "angular-user-idle";

import { DataService } from "../../../core/services/data.service";
import { PageLoaderService } from "../../components/page-loader/page-loader.service";
import { ApplicationError } from "../../error-handler/error-handler.service";
import { SessionService } from "../../services/session.service";
import { SharedMdmService } from "../../../shared/services/shared-mdm.service";

import { environment } from "../../../../environments/environment";
import { ACCOUNT_TYPE, UI_STATE } from "../../models/enums";

// declare var TrustevV2: any;

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
	providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }, SharedMdmService],
})
export class AppComponent implements OnInit, AfterViewInit {
	@ViewChild(ModalDirective, { static: false }) modal: ModalDirective;

	config = {
		backdrop: true,
		ignoreBackdropClick: true,
		keyboard: false,
		show: true,
	};
	timeLeft: string;
	isModalShown = false;
	sessionExpired = false;
	resumeApplication = false;
	timeout;
	year = new Date().getFullYear();

	constructor(
		private location: Location,
		private pageLoader: PageLoaderService,
		private router: Router,
		private session: SessionService,
		private userIdle: UserIdleService,
		private dataService: DataService,
		private platformLocation: PlatformLocation,
		private sharedMdm: SharedMdmService
	) {
		window.history.pushState(null, null, null);
		this.platformLocation.onPopState(() => {
			window.history.pushState(null, null, null);
			throw new ApplicationError("1008");
		});
	}

	showModal() {
		this.isModalShown = true;
	}

	hideModal() {
		this.sessionExpired = true;
		// this.modal.hide();
		// window.location.href = '/' + applicationFlow + '/';
		const arn = sessionStorage.getItem("arn");
		const applicationFlow = this.location.path().split("/")[1];
		if (arn || applicationFlow === "resume") {
			this.resumeApplication = true;
		}
		this.resumeCheck();
	}

	resumeCheck() {
		this.dataService.canResumeCheck.subscribe((data) => {
			if (data.checkValue) {
				this.resumeApplication = data.resume;
			}
		});
	}

	onHidden() {
		this.isModalShown = false;
	}

	confirm() {
		this.userIdle.stopTimer();
		this.modal.hide();
	}

	resume() {
		this.modal.hide();
		const applicationFlow = this.location.path().split("/")[1];

		window.location.href = this.resumeApplication ? "/resume" : "/" + applicationFlow + "/";
	}

	setTimeRemaining(remainingTime: number) {
		const time = environment.TIMEOUT_TIME - remainingTime;
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60);
		this.timeLeft = this.getTimeString(minutes) + ":" + this.getTimeString(seconds);
	}

	getTimeString(time) {
		return time < 10 ? "0" + time : time.toString();
	}

	ngOnInit() {
		const currentUrl = this.location.path();
		if (!currentUrl.toLowerCase().includes("docusign")) {
			// this.session.clearSession();
		}

		// this.consumer.authorizeIP().subscribe(null, (error) => {
		// 	if (error.status === 400) {
		// 		this.router.navigate(['error/unauthorized']);
		// 	} else {
		// 		this.router.navigate(['error/technical-error']);
		// 	}
		// });
		// Start watching for user inactivity.
		this.userIdle.startWatching();

		// Start watching when user idle is starting.
		this.userIdle.onTimerStart().subscribe((count) => {
			if (count !== null) {
				// const time = environment.TIMEOUT_TIME - count;
				// this.timeLeft = time < 10 ? ('0' + time) : time.toString();
				this.setTimeRemaining(count);
				if (count === 1) {
					this.showModal();
				}
			}
		});
		// Close application when time is up.
		this.userIdle.onTimeout().subscribe(() => {
			setTimeout(() => {
				// console.log('Time is up!');
				this.hideModal();
			}, 1000);
		});

		const originFormControlNameNgOnChanges = FormControlName.prototype.ngOnChanges;
		FormControlName.prototype.ngOnChanges = function () {
			const result = originFormControlNameNgOnChanges.apply(this, arguments);
			if (this.valueAccessor._elementRef) {
				this.control.nativeElement = this.valueAccessor._elementRef.nativeElement;
			}
			return result;
		};
	}

	ngAfterViewInit() {
		this.router.events.subscribe((event) => {
			if (event instanceof NavigationStart) {
				this.pageLoader.show(true, false);
				this.updateState(event.url);
				this.initialiseTrustev(event.url);
				this._fetchMdmData(event.url);
			} else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
				// setTimeout(() => {
				// 	this.pageLoader.hide();
				// }, 1000);
				this.scrollToTop();
			}
			// } else if (event instanceof NavigationCancel) {
			// 	this.pageLoader.hide();
			// } else if (event instanceof NavigationEnd) {
			// 	this.scrollToTop();
			// }
		});
	}

	scrollToTop() {
		if (document.body.scrollTop !== 0 || document.documentElement.scrollTop !== 0) {
			document.body.scrollTop = document.body.scrollTop - 25; // For Safari
			document.documentElement.scrollTop = document.documentElement.scrollTop - 25; // For Chrome, Firefox, IE and Opera
			this.timeout = setTimeout(() => {
				this.scrollToTop();
			}, 1);
		} else {
			clearTimeout(this.timeout);
			this.timeout = null;
			setTimeout(() => {
				const mainHeader = <HTMLElement>document.querySelector("#main-header");
				if (mainHeader) {
					mainHeader.setAttribute("tabindex", "-1");
					mainHeader.style.outline = "none";
					mainHeader.focus();
				}
			}, 2);
		}
	}

	updateState(url: string) {
		this.dataService.updateCurrentState({
			accountType: ACCOUNT_TYPE[url.split("/")[1]],
			page: UI_STATE[this.getPageType(url)],
		});
	}

	getPageType(url: string) {
		if (url.split("/").length > 2) {
			return url.includes("?") ? url.split("/")[2].split("?")[0] : url.split("/")[2];
		} else {
			return null;
		}
	}

	_fetchMdmData(url: string) {
		const moduleName = url.split("/")[1];
		if (!url.includes("verification")) {
			if (
				(moduleName === "business-deposit" || moduleName === "consumer-deposit") &&
				!this.sharedMdm.sharedMdmData
			) {
				this.sharedMdm.fetchSharedMdmData();
			}
			if (moduleName === "business-deposit" && !this.sharedMdm.sharedBusinessData) {
				this.sharedMdm.fetchBusinessData();
			}
		}
	}

	initialiseTrustev(url: string) {
		// const page = UI_STATE[url.split('/')[2]];
		// if (TrustevV2) {
		// 	TrustevV2.Init(environment.TRUSTEV_PUBLIC_KEY,
		// 		(sessionId) => {
		// 			// console.log('session Id', sessionId);
		// 			if (page === 'review') {
		// 				sessionStorage.setItem('trustevSessionId', sessionId);
		// 			} else {
		// 				sessionStorage.removeItem('trustevSessionId');
		// 			}
		// 		});
		// }
	}
}
