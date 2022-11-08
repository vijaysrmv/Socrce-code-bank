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

import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
	selector: 'app-footer-links',
	templateUrl: './footer-links.component.html',
	styleUrls: ['./footer-links.component.scss']
})
export class FooterLinksComponent implements OnInit {

	modalRef: BsModalRef;
	links = [{
		heading: 'Complete Saved Application',
		subHeading: 'Resume your saved application',
		buttonText: 'Return To Application',
		type: 'link',
		buttonLink: '/resume'
		// }, {
		// 	heading: 'Meet with Customer Executive',
		// 	subHeading: 'Let us advise you...',
		// 	buttonText: 'Schedule An Appointment',
		// 	type: 'modal',
		// 	buttonLink: 'openModal'
	}];

	constructor(
		private modalService: BsModalService
	) { }

	ngOnInit() { }

	openModal(template: TemplateRef<any>): void {
		this.modalRef = this.modalService.show(template);
	}

	bookAppointment(): void {
		this.modalRef.hide();
		window.open('https://www.newgensoft.com/', 'GetAppointmentWindow', 'toolbar=no,scrollbars=1,resizable=1,top=40,left=200,width=900,height=600');
	}

}
