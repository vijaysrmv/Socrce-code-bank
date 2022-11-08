/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        only-numbers.directive.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :
Description            :        Directive to restrict input fields to accept only numbers
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[numbersOnly]'
})

export class NumberOnlyDirective {
    @Input() allowDecimal: boolean;
    private regex: RegExp;
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Del', 'Delete', 'Tab', 'End', 'Home'];
    // private specialKeys: Array<string> = ['Backspace', 'Delete', 'Tab', 'End', 'Home', '-'];

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow decimal numbers and negative values
        this.regex = this.allowDecimal ? new RegExp(/^-?[0-9]+(\.[0-9]{0,}){0,1}$/g) : new RegExp(/^[0-9]{1,}$/g);
        // Allow Backspace, delete, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1 ||
            // Allow: Ctrl+A
            (event.keyCode === 65 && event.ctrlKey === true) ||
            // Allow: Ctrl+C
            (event.keyCode === 67 && event.ctrlKey === true) ||
            // Allow: Ctrl+V
            (event.keyCode === 86 && event.ctrlKey === true) ||
            // Allow: Ctrl+X
            (event.keyCode === 88 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)
        ) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        // const next: string = current.concat(event.key);
        if ((current && !String(current).match(this.regex) && !String(event.key).match(/^(Decimal|\.)$/g))
            || !String(event.key).match(/^((Decimal)|[\.0-9])$/g)
            || (this.allowDecimal && current.indexOf('.') !== -1 && String(event.key).match(/^(Decimal|\.)$/g))
            || (!this.allowDecimal && String(event.key).match(/^(Decimal|\.)$/g))
        ) {
            event.preventDefault();
        }
    }

}
