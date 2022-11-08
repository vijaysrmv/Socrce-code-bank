/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        block-copy-paste.directive.ts
Author                 :        Prince Kakkar
Date (DD/MM/YYYY)      :        31/08/2018
Description            :        Directive to block copy/paste events on an input field
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import { Directive, HostListener } from '@angular/core';

@Directive({
	selector: '[appBlockCopyPaste]'
})
export class BlockCopyPasteDirective {

	constructor() { }

	@HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
		e.preventDefault();
	}

	@HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
		e.preventDefault();
	}

	@HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
		e.preventDefault();
	}

}
