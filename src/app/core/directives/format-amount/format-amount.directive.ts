/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        format-amount-directive.ts
Author                 :        Rajneesh Mishra
Date (DD/MM/YYYY)      :        22/08/2019
Description            :        Directive to format numbers till two digits after decimal
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
	selector: '[formatAmount]'
})
export class FormatAmountDirective {

	amount: any;
	@Input() formControl: any;

	constructor(private el: ElementRef) { }

	@HostListener('blur', ['$event'])
	onblur() {
		this.amount = this.el.nativeElement.value;
		if (this.amount) {
			this.amount = this.amount - 0;
			let cal = new Intl.NumberFormat('en-US', { style: 'decimal', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(this.amount);
			cal = cal.replace('$', '').replace(/\,/g, '').trim();
			this.formControl.setValue(cal);
		}
	}

}
