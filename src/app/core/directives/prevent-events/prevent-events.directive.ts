/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        prevent-events.directive.ts
Author                 :        Prince Kakkar
Date (DD/MM/YYYY)      :        18/09/2018
Description            :        This directive restricts any keyboard entry into a disabled field
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[preventEvents]'
})
export class PreventEventsDirective {

	private restrictedEvents: Array<string> = ['Backspace'];

	constructor() { }

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (this.restrictedEvents.indexOf(event.key) !== -1) {
			event.preventDefault();
		} else {
			return;
		}
	}

}
