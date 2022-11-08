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

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { OaoService } from '../../../core/apis/oao.service';
import { BACKEND_STATE } from '../../../core/models/enums';

@Component({
	selector: 'docu-sign',
	templateUrl: './docu-sign.component.html',
	styleUrls: ['./docu-sign.component.scss']
})
export class DocuSignComponent implements OnInit {

	constructor(
		private _activatedRoute: ActivatedRoute,
		private location: Location,
		private _oaoService: OaoService,
		private _router: Router
	) { }

	ngOnInit() {
		this.sendDocuSignResponse();
	}

	sendDocuSignResponse() {
		const arn = this._activatedRoute.snapshot.params['arn'].toLowerCase();
		const envId = this._activatedRoute.snapshot.params['envelopeId'].toLowerCase();
		const docusignId = this._activatedRoute.snapshot.params['docusignId'].toLowerCase();
		const event = this._activatedRoute.snapshot.queryParamMap.get('event');
		if (arn && event) {
			sessionStorage.setItem('arn', arn);
			const reqData = {
				arn: arn,
				envelopeid: envId
			};
			this._oaoService.getToken(reqData).subscribe(res => {
				this._oaoService.sendResponseFromDocusign(arn, event, envId, docusignId).subscribe(data => {
					this._router.navigate(['/' + this.location.path().split('/')[1] + '/' + BACKEND_STATE[data.uistate]]);
				}, error => {
					if (error && (error.code === 2054 || error.code === 2184)) {
						this._router.navigate(['/errors/timeout']);
					}
				});
			});
		}
	}

}
