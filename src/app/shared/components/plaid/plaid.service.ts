
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConsumerDepositService } from '../../../consumer-deposit/services/consumer-deposit.service';
import { OaoService } from '../../../core/apis/oao.service';

@Injectable()
export class PlaidService {

	constructor(private oaoservice: OaoService) { }

	getAccountid(reqObj): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.getPlaidAccountid(arn, reqObj).pipe(map(resp => resp));
		}
	}

	validatePlaidAccount(accountBody): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.validatePlaidAccount(arn, accountBody).pipe(map(resp => resp));
		}
	}

	discardFunding() {
		const arn = sessionStorage.getItem('arn');
		if (arn) {
			return this.oaoservice.discardFunding(arn).pipe(map(resp => resp));
		}
	}
	// getNewPublicToken(reqObj: any): Observable<any> {
	// 	return this.consumerDepositSvc.getNewPublicToken(reqObj).map(response => response);
	// }

}
