/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Resume
File Name              :        select-choice.component.ts
Author                 :        Amir Masood
Date (DD/MM/YYYY)      :        03/04/2019
Description            :        select choice component
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Component, OnInit, ViewChild, EventEmitter, Output, Input, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';

@Component({
	selector: 'app-select-choice',
	templateUrl: './select-choice.component.html',
	styleUrls: ['./select-choice.component.scss']
})
export class SelectChoiceComponent implements OnInit {
	@ViewChild('selectchoice', {static: false}) choiceRef: TemplateRef<any>;
	@Output() clickSubmit = new EventEmitter();
	// @Output() discard = new EventEmitter();
	@Input() selectEmail = false;
	@Input() checkOrder = false;
	@Input() overdraft = false;
	// @Input() plaidAccounts = false;
	modalRef: BsModalRef;
	choices: any;
	choiceId;

	constructor(
		private modalService: BsModalService,
		private pageLoaderSvc: PageLoaderService
	) { }

	ngOnInit() {
		if (!this.checkOrder) {
			this.pageLoaderSvc.hide();
		}
	}

	showChoices(choices) {
		this.pageLoaderSvc.hide();
		this.choiceId = null;
		this.choices = choices;
		this.modalRef = this.modalService.show(this.choiceRef, { ignoreBackdropClick: true, keyboard: false });
	}

	submitChoice() {
		this.pageLoaderSvc.show(true, false);
		const selectedChoice = this.choiceId;
		this.clickSubmit.emit(selectedChoice);
		this.closeModal();
	}

	closeModal() {
		this.modalRef.hide();
	}

	// discardFunding() {
	// 	this.discard.emit(true);
	// 	this.modalRef.hide();
	// }

}
