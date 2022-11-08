import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../apis/auth.service';
import { ApplicationError } from '../../../core/error-handler/error-handler.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';

@Component({
	selector: 'app-staff-otp',
	templateUrl: './staff-otp.component.html',
	styleUrls: ['./staff-otp.component.scss']
})
export class StaffOtpComponent implements OnInit {

	otp = '';

	constructor(
		private _activatedRoute: ActivatedRoute,
		private _authSvc: AuthService,
		private pageLoaderSvc: PageLoaderService,
	) { }

	ngOnInit() {
		const uuid = this._activatedRoute.snapshot.params['uuid'].toLowerCase();
		const enuuid = this._activatedRoute.snapshot.params['enuuid'].toLowerCase();
		this._authSvc.generateOtpForBackOffice(uuid, enuuid).subscribe(data => {
			this.otp = data;
		}, error => {
			this.pageLoaderSvc.hide();
			throw new ApplicationError(error.error.code);
		});
	}

}
