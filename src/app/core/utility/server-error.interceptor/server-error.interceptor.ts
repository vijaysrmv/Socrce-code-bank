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


import {throwError as observableThrowError,  Observable ,  of } from 'rxjs';

import {mergeMap, retryWhen} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';





@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// If the call fails, retry until 3 times before throwing an error
		return next.handle(request).pipe(
			retryWhen((errors) => {
				// return errors
				//   .mergeMap((error) => (error.status === 500) ? of(error) : Observable.throw(error)).take(2);
				let errCount = 0;

				return errors.pipe(mergeMap((error: any) => {
					if (++errCount <= 1 && error.status === 500) {
						return of(error.status);
					}
					return observableThrowError(error);
				}));
			}));
	}
}
