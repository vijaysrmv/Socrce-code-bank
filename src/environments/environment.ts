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

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	name: 'dev',
	TRUSTEV_PUBLIC_KEY: '766d3ea4d0954d92bd194750f72d9148',
	TOKEN_TIMEOUT: 540000,
	LOADER_INIT_TIME: 0,
	ErrorTimeOut: 10000,
	ENABLE_ROUTE_GUARD: false,
	IDLE_TIME: 540,
	TIMEOUT_TIME: 60,
	PING_TIME: 600,
	MOCK_CONSUMER_SERVICES: false,
	MOCK_PRODUCT_SERVICES: false,
	MOCK_MDM_SERVICES: false,
	MOCK_USPS_SERVICES: false,
	MOCK_IDSCAN_SERVICES: false,
	production: false
};
