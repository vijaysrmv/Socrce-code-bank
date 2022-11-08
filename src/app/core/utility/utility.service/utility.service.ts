/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        utility.service.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        29/08/2018
Description            :        Service file containing various functions used application-wide
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { UserIdleService } from 'angular-user-idle';


@Injectable()
export class UtilityService {

	constructor(
		@Inject(UserIdleService) private userIdle: UserIdleService
	) { }

	stop() {
		this.userIdle.stopTimer();
	}

	// stopWatching() {
	// 	this.userIdle.stopWatching();
	// }

	// startWatching() {
	// 	this.userIdle.startWatching();
	// }

	// restart() {
	// 	this.userIdle.resetTimer();
	// }

	createDateObject(date: string) {
		if (date && date !== '') {
			const objDate = new Date(date);
			return {
				date: {
					year: objDate.getFullYear(),
					month: objDate.getMonth() + 1,
					day: objDate.getDate()
				}
			};
		}
		return null;
	}

	parseDate(date: string) {
		if (date && date !== '') {
			const objDate = new Date(date);
			let monthVal = (objDate.getUTCMonth() + 1).toString();
			monthVal = monthVal.length === 1 ? '0' + monthVal : monthVal;
			let dateVal = (objDate.getUTCDate()).toString();
			dateVal = dateVal.length === 1 ? '0' + dateVal : dateVal;
			const formattedDate = `${monthVal}/${dateVal}/${objDate.getUTCFullYear()}`;
			return formattedDate;
		}
		return null;
	}

	readUploadedFileAsUrl(inputFile) {
		const temporaryFileReader = new FileReader();
		return new Observable((observer) => {
			temporaryFileReader.onerror = () => {
				temporaryFileReader.abort();
				observer.error('error');
			};
			temporaryFileReader.onload = () => {
				observer.next(temporaryFileReader.result);
				observer.complete();
			};
			temporaryFileReader.readAsDataURL(inputFile);
		});
	}

	isValidExpiryDate(date: string) {
		const expireDate = new Date(date);
		expireDate.setHours(0, 0, 0);
		const currDate = new Date();
		currDate.setHours(0, 0, 0);
		return expireDate > currDate;
	}

	// isSameZip(postalCode: string) {
	// 	const zip5 = postalCode.split('-')[0];
	// 	const savedZipObj = JSON.parse(sessionStorage.getItem('zipcode'));
	// 	return savedZipObj.zip5 === zip5;
	// }

}
