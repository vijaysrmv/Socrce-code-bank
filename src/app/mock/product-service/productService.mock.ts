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

import { Services } from '../../core/models/product.model';
import { respServices } from './product-responses/getServices.response';
import { Observable } from 'rxjs';

export class MockProductService {
	getServicesOffered(): Observable<any> {
		return new Observable((observer) => {
			observer.next(respServices);
		});
	}

	saveServicesOffered(reqObj): Observable<any> {
		const arn = sessionStorage.getItem('arn');
		return new Observable((observer) => {
			console.log(reqObj);
			observer.next({message: 'success'});
		});
	}
}
