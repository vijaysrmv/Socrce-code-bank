/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        modal-focus.directive.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        10/05/2019
Description            :        This directive restricts user keyboard controls to move focus out of modal when active in DOM
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[appModalFocus]'
})
export class ModalFocusDirective {

	private KEY_TAB = 9;
	private focusableEls: any;
	private firstFocusableEl: any;
	private lastFocusableEl: any;

	constructor(private el: ElementRef) {
		setTimeout(() => {
			this.initElements(el);
		}, 1000);
	}

	initElements(element) {
		this.focusableEls = element.nativeElement.querySelectorAll('a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]');
		this.focusableEls = Array.prototype.slice.call(this.focusableEls);
		if (this.focusableEls.length > 0) {
			this.firstFocusableEl = this.focusableEls[0];
			this.lastFocusableEl = this.focusableEls[this.focusableEls.length - 1];
			this.firstFocusableEl.focus();
		}
	}

	handleBackwardTab(event) {
		if (document.activeElement === this.firstFocusableEl) {
			event.preventDefault();
			this.lastFocusableEl.focus();
		}
	}

	handleForwardTab(event) {
		if (document.activeElement === this.lastFocusableEl) {
			event.preventDefault();
			this.firstFocusableEl.focus();
		}
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		switch (event.keyCode) {
			case this.KEY_TAB:
				if (this.focusableEls.length === 1) {
					event.preventDefault();
					break;
				}
				if (event.shiftKey) {
					this.handleBackwardTab(event);
				} else {
					this.handleForwardTab(event);
				}
				break;
			// case KEY_ESC:
			// 	Dialog.close();
			// 	break;
			default:
				break;
		}
	}

}
