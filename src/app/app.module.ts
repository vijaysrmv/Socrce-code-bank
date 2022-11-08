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

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterStateSerializer } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { UserIdleModule } from 'angular-user-idle';
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ToastyModule } from 'ng2-toasty';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { AppComponent } from './core/containers/app/app.component';

import { CustomRouterStateSerializer } from './shared/utils';
import { environment } from '../environments/environment';
import { AppConfig } from './app.config';

import { StateGuard } from './core/services/state-guard.service';
import { MockBackendService } from './mock/backend-service/backendService.mock';

// RX imports











export function initConfig(appConfig: AppConfig) {
	return () => appConfig.load();
}

@NgModule({
	imports: [
		BrowserModule,
		// AngularMultiSelectModule,
		FormsModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		HttpClientModule,
		/**
		 * StoreModule.forRoot is imported once in the root module, accepting a reducer
		 * function or object map of reducer functions. If passed an object of
		 * reducers, combineReducers will be run creating your application
		 * meta-reducer. This returns all providers for an @ngrx/store
		 * based application.
		 */
		StoreModule.forRoot({}),
		// StoreModule.forRoot(reducers, { metaReducers }),
		// StoreModule.forRoot({ store: reducer, ibpsStore: ibpsReducer }),

		/**
		 * @ngrx/router-store keeps router state up-to-date in the store.
		 */
		StoreRouterConnectingModule.forRoot(),

		/**
		 * Store devtools instrument the store retaining past versions of state
		 * and recalculating new states. This enables powerful time-travel
		 * debugging.
		 *
		 * To use the debugger, install the Redux Devtools extension for either
		 * Chrome or Firefox
		 *
		 * See: https://github.com/zalmoxisus/redux-devtools-extension
		 */
		// !environment.production ? StoreDevtoolsModule.instrument() : [],

		/**
		 * EffectsModule.forRoot() is imported once in the root module and
		 * sets up the effects class to be initialized immediately when the
		 * application starts.
		 *
		 * See: https://github.com/ngrx/platform/blob/master/docs/effects/api.md#forroot
		 */
		EffectsModule.forRoot([]),

		CoreModule.forRoot(),
		ToastyModule.forRoot(),
		UserIdleModule.forRoot({ idle: environment.IDLE_TIME, timeout: environment.TIMEOUT_TIME, ping: environment.PING_TIME }),
		TypeaheadModule.forRoot(),

	],
	providers: [
		AppConfig,
		{
			provide: APP_INITIALIZER,
			useFactory: initConfig,
			deps: [AppConfig],
			multi: true
		},
		/**
		 * The `RouterStateSnapshot` provided by the `Router` is a large complex structure.
		 * A custom RouterStateSerializer is used to parse the `RouterStateSnapshot` provided
		 * by `@ngrx/router-store` to include only the desired pieces of the snapshot.
		 */
		{ provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
		StateGuard,
		MockBackendService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
