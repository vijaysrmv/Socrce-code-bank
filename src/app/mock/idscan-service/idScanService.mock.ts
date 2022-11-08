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

import { respIdScan } from './idscan-responses/id-scan.response';
import { Observable ,  of } from 'rxjs';
import { ApplicantDetails } from '../../core/models/application.model';

export class MockIdScanService {
	getDetailsFromIdScan(obj: any): Observable<ApplicantDetails> {
		return of(respIdScan);
		// new Observable((observer) => {
		// 	observer.next(respIdScan);
		// });
	}
}

