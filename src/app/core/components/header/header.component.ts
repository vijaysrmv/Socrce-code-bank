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


import {filter} from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


import { DataService } from '../../../core/services/data.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	@Input() isLoggedIn: false;
	@Output() logoutClick = new EventEmitter<boolean>();

	showStepper = false;
	stepperIndex = 0;
	currentRoute: string;
	activatePersonalStepper: string;

	stepperRoutes = [
		'/consumer-deposit/select-product',
		'/consumer-deposit/personal-details',
		'/consumer-deposit/joint-details',
		'/consumer-deposit/beneficiary-details',
		'/consumer-deposit/review',
		'/consumer-deposit/due-diligence-questionnaire',
		'/consumer-deposit/disclosure',
		'/consumer-deposit/account-funding',

		'/business-deposit/select-product',
		'/business-deposit/business-details',
		'/business-deposit/responsible-details',
		'/business-deposit/additional-responsible-details',
		
		'/business-deposit/review',
		'/business-deposit/disclosure',
		'/business-deposit/additional-business-details',
		'/business-deposit/authorizer-details',
		'/business-deposit/due-diligence-questionnaire',
		'/business-deposit/upload-documents',
		'/business-deposit/account-funding'
	];

	constructor(
		private dataService: DataService,
		private router: Router
	) {
		this.updateStepperView();
		this.showStepperCheck();
	}

	ngOnInit() {
	}

	updateStepperView() {
		this.dataService.stepperStateCheck.subscribe(data => {
			if (this.currentRoute === data.name) {
				this.stepperIndex = data.index;
				this.activatePersonalStepper = data.personalStepper;
			}
		});
	}

	showStepperCheck = () => {
		const that = this;
		this.router.events.pipe(
			filter(event => (event instanceof NavigationEnd)))
			.subscribe((routeData: any) => {
				that.showStepper = true;
				if (this.stepperRoutes.indexOf(routeData.urlAfterRedirects) !== -1) {
					this.showStepper = true;
					this.currentRoute = routeData.urlAfterRedirects;
				} else { this.showStepper = false; }
			});
	}

	logout() { this.logoutClick.emit(); }

}
