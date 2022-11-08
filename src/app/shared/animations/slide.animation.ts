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

import { trigger, state, animate, transition, style } from '@angular/animations';

export const slideProductPopupAnimation =
	trigger('slideProductPopupAnimation', [
		// route 'enter' transition
		transition(':enter', [

			// styles at start of transition
			style({
				// transform: 'translateY(100%)'
				'max-height': '0px',
				overflow: 'hidden'
			}),

			// animation and styles at end of transition
			animate('0.3s cubic-bezier(.35,0,.25,1)', style({
				// transform: 'translateY(0%)'
				'max-height': '100px'
			})),

			style({
				// transform: 'translateY(100%)'
				overflow: 'visible'
			})
		]),
		transition(':leave', [

			// styles at start of transition
			style({
				'max-height': '100px',
				overflow: 'hidden'
			}),

			// animation and styles at end of transition
			animate('0.3s cubic-bezier(.35,0,.25,1)', style({
				'max-height': '0px'
			}))
		]),
	]);

export const slideUpDownAnimation =
	trigger('slideUpDownAnimation', [
		// route 'enter' transition
		transition(':enter', [

			// styles at start of transition
			style({
				transform: 'translateY(100%)',
				overflow: 'hidden'
			}),

			// animation and styles at end of transition
			animate('0.3s cubic-bezier(.35,0,.25,1)', style({
				transform: 'translateY(0%)'
			})),
			style({
				overflow: 'visible'
			})
		]),
		transition(':leave', [

			// styles at start of transition
			style({
				transform: 'translateY(0%)'
			}),

			// animation and styles at end of transition
			animate('0.3s cubic-bezier(.35,0,.25,1)', style({
				transform: 'translateY(100%)'
			}))
		]),
	]);

export const slideDownUpAnimation =
	trigger('slideDownUpAnimation', [
		// route 'enter' transition
		transition(':enter', [

			// styles at start of transition
			style({
				transform: 'translateY(-100%)',
				overflow: 'hidden'
			}),

			// animation and styles at end of transition
			animate('0.3s cubic-bezier(.35,0,.25,1)', style({
				transform: 'translateY(0%)'
			})),
			style({
				overflow: 'visible'
			})
		]),
		transition(':leave', [

			// styles at start of transition
			style({
				transform: 'translateY(0%)'
			}),

			// animation and styles at end of transition
			animate('0.3s cubic-bezier(.35,0,.25,1)', style({
				transform: 'translateY(-100%)'
			}))
		]),
	]);
