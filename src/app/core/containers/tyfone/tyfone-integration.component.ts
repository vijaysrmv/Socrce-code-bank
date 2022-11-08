import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TyfoneService } from './tyfone.service';
import { PageLoaderService } from '../../components/page-loader/page-loader.service';
import { DataService } from '../../services/data.service';

import { BACKEND_ACCOUNT, BACKEND_STATE } from '../../models/enums';
import { TyfoneResponse } from '../../models/application.model';

@Component({
	selector: 'app-tyfone-integration',
	templateUrl: './tyfone-integration.component.html',
	styleUrls: ['./tyfone-integration.component.scss'],
	providers: [TyfoneService]
})
export class TyfoneIntegrationComponent implements OnInit {

	queryParams: any;

	constructor(
		private activeRoute: ActivatedRoute,
		private dataSvc: DataService,
		private tyfoneSvc: TyfoneService,
		private pageLoaderSvc: PageLoaderService,
		private router: Router
	) { }

	ngOnInit() {
		this.pageLoaderSvc.show(true, false);
		this.queryParams = this.activeRoute.snapshot.queryParams;
		this.tyfoneSvc.getOlbUserData(this.queryParams).subscribe((response: TyfoneResponse) => {
			if (response) {
				sessionStorage.setItem('tyfoneDetails', JSON.stringify(response));
				const applicationType = response.applicationtype;
				const uistate = response.uistate;
				this.dataSvc.changeOlbState(true);
				this.router.navigate([BACKEND_ACCOUNT[applicationType] + '/' + BACKEND_STATE[uistate]]);
			}
		}, (error) => {
			if (error.error.code === 2017) {
				this.router.navigate(['/resume']);
			}
			setTimeout(() => {
				throw error;
			}, 1000);
		});
	}

}
