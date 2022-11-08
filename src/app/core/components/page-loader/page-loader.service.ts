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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Spinner } from '../../models/spinner.model';


@Injectable()
export class PageLoaderService {

	private loader: Spinner = {
		show: false,
		processingLabel: false
	};

	private spinnerSubject = new BehaviorSubject(this.loader);

	spinner = this.spinnerSubject.asObservable();

	constructor() { }

	show(show, processingLabel) {
		this.loader = {
			show: show,
			processingLabel: processingLabel
		};
		this.spinnerSubject.next(this.loader);
	}

	hide() {
		this.loader = {
			show: false,
			processingLabel: false
		};
		this.spinnerSubject.next(this.loader);
	}

}
