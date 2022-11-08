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


import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable ,  of } from 'rxjs';

import { OaoService } from '../../../core/apis/oao.service';

import { ApplicationDetails } from '../../../core/models/application.model';
import { Disclosure } from '../../../core/models/disclosure.model';
import { ACCOUNT_TYPE } from '../../../core/models/enums';
import { Response } from '../../../core/models/response';


@Injectable()
export class DisclosureService {

	constructor(
		private location: Location,
		private oaoService: OaoService,
	) { }

	getServicesOffered(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getServicesOffered(arn).pipe(map(data => {
				if (data.body && data.body.courtesypay) {
					data.body.courtesypay.overdraft = null;
				}
				return data.body;
			}));
		}
		return of([]);
	}

	saveServicesOffered(reqObj): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.saveServicesOffered(arn, reqObj).pipe(map(data => data));
		}
		return of([]);
	}

	getDisclosures(): Observable<Array<Disclosure>> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getDisclosures(arn).pipe(map(data => data));
		}
		return of([]);
	}

	getConsumerData(): Observable<ApplicationDetails> {
		return new Observable((observer) => {
			const arn = sessionStorage.getItem('arn');
			if (arn) {
				this.oaoService.getConsumerData(arn).subscribe((data: ApplicationDetails) => {
					return observer.next(data);
				}, (error) => {
					return observer.error();
				});
			}
		});
	}

	getUIState() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getNextUIState(arn).pipe(map(data => data));
		}
		return of([]);
	}

	getAccount() {
		return ACCOUNT_TYPE[this.location.path().split('/')[1]];
	}

	processNextStepNavigation(servicesOffered: any): Observable<any> {
		return new Observable((observer) => {
			const serviceData = this.setDisclosureRequestData(servicesOffered);
			const arn = sessionStorage.getItem('arn');
			serviceData.applicationtype = this.getAccount();
			if (arn) {
				return this.oaoService.continueDetails(arn, serviceData).subscribe((data: Response) => {
					if (data.message === 'OK') {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				});
			}
		});
	}

	setDisclosureRequestData(servicesOffered: any) {
		let disclosureData: ApplicationDetails;
		const arn = sessionStorage.getItem('arn');
		disclosureData = {
			arn: arn,
			productservices: servicesOffered,
			updateuistate: true,
			uistate: 'servicesOffered'
		};
		return disclosureData;
	}

	processSaveAndExit(servicesOffered: any): Observable<any> {
		return new Observable((observer) => {
			const arn = sessionStorage.getItem('arn');
			if (arn) {
				const serviceData = this.setDisclosureRequestData(servicesOffered);
				serviceData.applicationtype = this.getAccount();
				serviceData.updateuistate = false;
				return this.oaoService.saveDetails(arn, serviceData).subscribe((data: Response) => {
					if (data.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				});
			}
		});
	}

	processBack(servicesOffered: any): Observable<any> {
		return new Observable((observer) => {
			const arn = sessionStorage.getItem('arn');
			if (arn) {
				const serviceData = this.setDisclosureRequestData(servicesOffered);
				serviceData.applicationtype = this.getAccount();
				serviceData.updateuistate = false;
				return this.oaoService.saveDetailsOnBack(arn, serviceData).subscribe((data: Response) => {
					if (data.statusCode === 200) {
						observer.next('success');
					} else {
						observer.next('failure');
					}
				});
			}
		});
	}

	getDocusignUrl() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.getDocusignUrl(arn).pipe(map(data => data));
		}
		return of([]);
	}

	downloadDisclosure(url): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.downloadDisclosure(arn, url).pipe(map(data => data));
		}
		return of([]);
	}

	downloadAllDisclosures(): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoService.downloadAllDisclosures(arn).pipe(map(data => data));
		}
		return of([]);
	}

}
