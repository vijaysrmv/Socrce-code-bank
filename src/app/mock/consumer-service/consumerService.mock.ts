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

import { Product } from '../../core/models/product.model';
// import { respServices } from './consumer-responses/getServices.response';
// import { mockQuestionnaire } from './consumer-responses/getQuestionnaire.response';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class MockConsumerService {

	isValidRestrictedUser(rmKey: string): Observable<boolean> {
		let isValid = true;
		if (rmKey === '123456789') {
			isValid = false;
		}
		return new Observable((observer) => {
			observer.next(isValid);
		});
	}

	getQuestionnaire(key: string): Observable<any> {
		return new Observable((observer) => {
			observer.next();
		});
	}
}
