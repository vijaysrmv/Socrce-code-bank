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

import { IdType } from '../../../core/models/fields-value.model';


// export const respIdTypes = <Array<IdType>>[
// 	{
// 		idtype: 'DL',
// 		description: "Driver's License"
// 	},
// 	{
// 		idtype: 'MC/OT',
// 		description: 'State ID'
// 	},
// 	{
// 		idtype: 'PS',
// 		description: 'U.S. Passport'
// 	},
// 	{
// 		idtype: 'MI',
// 		description: 'U.S. Military ID'
// 	},
// 	{
// 		idtype: 'RA',
// 		description: 'Resident Alien'
// 	}
// ];

export const respIdTypes = <Array<IdType>>[
	{
		idtype: 'DL',
		description: 'Drivers License'
	}, {
		idtype: 'PS',
		description: 'Passport'
	}, {
		idtype: 'ST',
		description: 'State ID'
	}, {
		idtype: 'MI',
		description: 'US Military ID'
		// }, {
		// 	idtype: 'Resident Alien',
		// 	description: 'Resident Alien'
	}
];
