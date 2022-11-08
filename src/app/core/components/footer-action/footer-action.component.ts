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

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-footer-action',
	templateUrl: './footer-action.component.html',
	styleUrls: ['./footer-action.component.scss']
})
export class FooterActionComponent implements OnInit {

	@Input() showMandatoryMessage = false;
	@Input() showAgree = false;
	@Input() showBack = false;
	@Input() showContinue = false;
	@Input() showSaveExit = false;
	@Input() showExit = false;
	@Input() changeExitColor = false;
	@Input() showComplete = false;
	@Input() showSkip = false;
	@Input() disableAgree = false;
	@Input() disableBack = false;
	@Input() disableContinue = false;
	@Input() disableSaveExit = false;
	@Input() disableExit = false;
	@Input() disableComplete = false;

	@Output() clickAgree = new EventEmitter();
	@Output() clickBack = new EventEmitter();
	@Output() clickContinue = new EventEmitter();
	@Output() clickSaveExit = new EventEmitter();
	@Output() clickExit = new EventEmitter();
	@Output() clickComplete = new EventEmitter();
	@Output() clickSkip = new EventEmitter();

	constructor() { }

	ngOnInit() { }

	handleAgree() {
		this.clickAgree.emit();
	}

	handleBack() {
		this.clickBack.emit();
	}

	handleContinue() {
		this.clickContinue.emit();
	}

	handleSaveExit() {
		this.clickSaveExit.emit();
	}

	handleComplete() {
		this.clickComplete.emit();
	}

	handleExit() {
		this.clickExit.emit();
	}

	handleSkip() {
		this.clickSkip.emit();
	}

}
