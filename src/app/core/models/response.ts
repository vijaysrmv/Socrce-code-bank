/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :        Core
File Name              :        response.ts
Author                 :        Ajeetesh Roy
Date (DD/MM/YYYY)      :        21/08/2018
Description            :        This file has interface for response
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

export interface Response {
	statusCode: number;
	status: string;
	message: string;
}
