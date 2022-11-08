/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        custom-mask.directive.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        22/08/2018
Description            :        Directive to mask input fields containing sensitive user data
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/


import { Directive, ElementRef, Renderer2, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
	selector: '[customMask]'
})
export class CustomMaskDirective implements OnChanges {

	@Input('maskType') maskType: string;
	@Input('maskData') maskData: any;
	@Input('maskChar') maskChar: any = '*';

	ngOnChanges(changes: SimpleChanges) {
		if (changes['maskData'] && this.maskData !== null && this.maskData !== undefined && this.maskType !== undefined) {
			switch (this.maskType.toLowerCase()) {
				case 'ssn':
					if (this.maskData.length > 0) {
						if (this.maskData.split('-').length === 3) {
							this.el.nativeElement.textContent = this.maskData.split('-').map((text, index) => {
								if (index < 2) {
									return text.split('').map((char, indexid) => {
										return this.maskChar;
									}).join('');
								} else {
									return text;
								}
							}).join('-');
						}
						if (this.maskData.split('-').length === 2) {
							this.el.nativeElement.textContent = this.maskData.split('-').map((text, index) => {
								if (index < 1) {
									return text.split('').map((char, indexid) => {
										return this.maskChar;
									}).join('');
								} else {
									return text.split('').map((char, indexid) => {
										if (indexid < 3) {
											return this.maskChar;
										} else {
											return char;
										}
									}).join('');
								}
							}).join('-');
						}
					} else {
						this.el.nativeElement.textContent = '';
					}
					break;
				case 'email':
					if (this.maskData.length > 0) {
						this.el.nativeElement.textContent = this.maskData.split('@').map((text, index) => {
							if (index === 0) {
								if (text.length === 1) {
									return this.maskChar;
								} else {
									return text.split('').map((char, indexid) => {
										if (indexid === 0) { return char; }
										return this.maskChar;
									}).join('');
								}
							} else {
								return text;
							}
						}).join('@');
					} else {
						this.el.nativeElement.textContent = '';
					}
					break;
				case 'dob':
					// case 'jointdob':
					// const dob = this.maskData.formatted || this.maskData;
					if ((typeof this.maskData) === 'object') {
						if (this.maskData.formatted.length > 0) {
							// this.el.nativeElement.textContent = this.maskData.formatted.replace(/[0-9]/g, '*');
							this.el.nativeElement.textContent = this.maskData.formatted.split('/').map((text, index) => {
								if (index < 2) {
									return text.split('').map((char, indexid) => {
										return this.maskChar;
									}).join('');
								} else {
									return text;
								}
							}).join('/');
						} else {
							this.el.nativeElement.textContent = '';
						}
					} else {
						if (this.maskData.length > 0) {
							// this.el.nativeElement.textContent = this.maskData.replace(/[0-9]/g, '*');
							this.el.nativeElement.textContent = this.maskData.split('/').map((text, index) => {
								if (index < 2) {
									return text.split('').map((char, indexid) => {
										return this.maskChar;
									}).join('');
								} else {
									return text;
								}
							}).join('/');
						} else {
							this.el.nativeElement.textContent = '';
						}
					}
					// if (dob.length > 0) {
					// 	this.el.nativeElement.textContent = dob.replace(/[0-9]/g, '*');
					// } else {
					// 	this.el.nativeElement.textContent = '';
					// }
					break;
				case 'phone':
					if (this.maskData.length > 0) {
						this.el.nativeElement.textContent = this.maskData.split('-').map((text, index) => {
							if (index === 0) {
								return text.replace(/[0-9]/g, this.maskChar);
							} else {
								return text;
							}
						}).join('-');
					} else {
						this.el.nativeElement.textContent = '';
					}
					break;
				case 'cardnumber':
					if (this.maskData.length > 0) {
						this.el.nativeElement.textContent = this.maskData.split(' ').map((text, index) => {
							if (index < 3) {
								return text.split('').map((char, indexid) => {
									return this.maskChar;
								}).join('');
							} else {
								return text;
							}
						}).join(' ');
					} else {
						this.el.nativeElement.textContent = '';
					}
					break;
				case 'amount':
					if (this.maskData && this.maskData !== '') {
						this.el.nativeElement.textContent = new Intl.NumberFormat('en-US',
							{
								style: 'decimal',
								currency: 'USD',
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}).format(this.maskData).replace('$', '').trim();
					} else {
						this.el.nativeElement.textContent = '';
					}
					break;
				case 'amountwithoutdecimal':
					if (this.maskData && this.maskData !== '') {
						this.el.nativeElement.textContent = new Intl.NumberFormat('en-US',
							{
								style: 'decimal',
								currency: 'USD',
								minimumFractionDigits: 0,
								maximumFractionDigits: 0
							}).format(this.maskData).replace('$', '').trim();
					} else {
						this.el.nativeElement.textContent = '';
					}
			}
		} else {
			this.el.nativeElement.textContent = '';
		}

	}

	constructor(
		private el: ElementRef,
		private renderer: Renderer2
	) { }

}
