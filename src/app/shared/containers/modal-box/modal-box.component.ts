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
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';

@Component({
	selector: 'app-modal-box',
	templateUrl: './modal-box.component.html',
	styleUrls: ['./modal-box.component.scss']
})
export class ModalBoxComponent implements OnInit {
	@Input() questionLabel: string;
	@Input() infoLabel: string;
	@Input() applicantCount: number;
	@Input() showCountDiv = false;
	@Input() showConfirmationModal = false;
	@Input() isBeneficiary = false;

	@Output() addApplicant = new EventEmitter();
	@Output() subtractApplicant = new EventEmitter();
	@Output() continue = new EventEmitter();
	@Output() deleteJointDetailForm = new EventEmitter();
	@Output() deleteForm = new EventEmitter();

	constructor(private pageLoaderSvc: PageLoaderService) { }

	ngOnInit() {
		this.pageLoaderSvc.hide();
	}

	onCountDecrease() {
		this.subtractApplicant.emit();
	}

	onCountIncrease() {
		this.addApplicant.emit();
	}

	toggleDiv(value: boolean) {
		this.showCountDiv = value;
	}

	onContinue() {
		this.continue.emit(this.showCountDiv);
	}

	deleteJointForm(resp) {
		this.deleteJointDetailForm.emit(resp);
		this.deleteForm.emit(resp);
	}
}
