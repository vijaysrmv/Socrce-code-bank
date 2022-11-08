/*------------------------------------------------------------------------------------------------------
								NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        app-config.model.ts
Author                 :        Aditya Agrawal
Date (DD/MM/YYYY)      :        02/10/2018
Description            :        This is interface for app config
-------------------------------------------------------------------------------------------------------
CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No   Change Date   Changed By    Change Description
------------------------------------------------------------------------------------------------------*/

export interface IAppConfig {
	API_ENDPOINT_GATEWAY: string;
	ROUTING_NUMBER_API_ENDPOINT_GATEWAY: string;
	MDM_URI: string;
	IDLE_TIME: number;
	RESEND_OTP_TIME: number;
	TIMEOUT_TIME: number;
	PING_TIME: number;
	TOKEN_TIMEOUT: number;
	LOADER_INIT_TIME: number;
	SSN_TEST_PATTERN: boolean;
	MOCK_CONSUMER_SERVICES: boolean;
	MOCK_PRODUCT_SERVICES: boolean;
	MOCK_MDM_SERVICES: boolean;
	MOCK_USPS_SERVICES: boolean;
	MOCK_IDSCAN_SERVICES: boolean;
	production: boolean;
	ErrorTimeOut: number;
	ENABLE_ROUTE_GUARD: boolean;
	CONTACT_NUMBER: number;
	PLAID_ENV: string;
	PLAID_KEY: string;
}
