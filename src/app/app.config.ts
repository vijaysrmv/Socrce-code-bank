/*------------------------------------------------------------------------------------------------------
								NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                                : PES
Project/Product                      :
Application                          :
Module                               :
File Name                            : app.config.ts
Author                               :
Date (DD/MM/YYYY)                    : 17/10/2018
Description                          : This file is used to configure different environments of the application
-------------------------------------------------------------------------------------------------------
CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No   Change Date   Changed By    Change Description
------------------------------------------------------------------------------------------------------*/

import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { IAppConfig } from './core/models/app-config.model';

@Injectable()
export class AppConfig {

	static settings: IAppConfig;

	constructor(private http: HttpClient) { }

	load() {
		const jsonFile = `ccf-oao-assets/config/config.${environment.name}.json`;
		return new Promise<void>((resolve, reject) => {
			this.http.get(jsonFile).toPromise().then((response: Response) => {
				AppConfig.settings = <IAppConfig><unknown>response;
				resolve();
			}).catch((response: any) => {
				reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
			});
		});
	}
}
