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

import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';



@Injectable()
export class ConsumerStateGuard implements CanActivate {

	constructor(private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve) => {
			const existingUser = false;
			if (existingUser) {
				this.redirectToSelectProduct();
				sessionStorage.setItem('existingUser', 'true');
				resolve(false);
			} else {
				sessionStorage.setItem('existingUser', 'false');
				resolve(true);
			}
		});
	}

	consumerUiStateMap() {
		return [
			{ route: '/consumer-deposit/review', uiState: 'consumerInfo', index: 1 },
			{ route: '/consumer-deposit/account-funding', uiState: 'test', index: 2 }
		];
	}
	redirectToSelectProduct() {
		this.router.navigate(['/consumer-deposit/select-product']);
	}

}
