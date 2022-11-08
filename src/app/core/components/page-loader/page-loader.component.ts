/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        page-loader.component.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        21/08/2018
Description            :        Component for loader modal of the application
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, Input } from '@angular/core';
import { PageLoaderService } from './page-loader.service';
import { environment } from '../../../../environments/environment';

@Component({
	selector: 'page-loader',
	templateUrl: './page-loader.component.html',
	styleUrls: ['./page-loader.component.scss']
})
export class PageLoaderComponent implements OnInit {

	@Input() processingLabel = false;
	@Input() threshold = environment.LOADER_INIT_TIME;
	// @Input() timeout = 5000;
	// @Input() zIndex = 9999;
	@Input() showSpinner = false;
	thresholdTimer;
	// timeoutTimer;

	constructor(private pageLoader: PageLoaderService) { }

	ngOnInit() {
		this.pageLoader.spinner.subscribe((spinner) => {
			// this.showSpinner = spinner.show;
			// this.processingLabel = spinner.processingLabel;
			if (spinner.show) {
				if (this.thresholdTimer) {
					return;
				}
				this.thresholdTimer = setTimeout(() => {
					this.showSpinner = spinner.show;
					this.processingLabel = spinner.processingLabel;
					// this.timeoutTimer = setTimeout(function () {
					// 	this.timeoutTimer = null;
					// 	this.showSpinner = false;
					// }, this.timeout);
				}, this.threshold);
			} else {
				if (this.thresholdTimer) {
					clearTimeout(this.thresholdTimer);
					this.thresholdTimer = null;
				}
				this.showSpinner = false;
				this.processingLabel = false;
			}
		});
	}

}
