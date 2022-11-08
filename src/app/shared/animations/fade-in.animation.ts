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

export const fadeInAnimation =
	trigger('fadeInAnimation', [
		// route 'enter' transition
		transition(':enter', [

			// styles at start of transition
			style({ opacity: 0, transform: 'scale(0.2)' }),

			// animation and styles at end of transition
			animate('0.8s cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'scale(1.05)' })),
			animate('0.8s cubic-bezier(.35,0,.25,1)', style({ opacity: 1, transform: 'scale(1)' }))
		]),
	]);
