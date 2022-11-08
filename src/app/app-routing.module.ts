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

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ErrorComponent } from "./core/containers/error/error.component";
import { StaffOtpComponent } from "./core/containers/staff-otp/staff-otp.component";
import { TyfoneIntegrationComponent } from "./core/containers/tyfone/tyfone-integration.component";
import { DashboardComponent } from "./shared/components/dashboard/dashboard.component";
import { LoginComponent } from "./shared/components/login/login.component";
// import { FinishComponent } from './personal/containers/finish/finish.component';

const routes: Routes = [
	// { path: '', redirectTo: 'personal-deposit', pathMatch: 'full' },

	{ path: "", redirectTo: "business-deposit", pathMatch: "full" },

	// {
	// 	path: 'personal-deposit',
	// 	loadChildren: './personal-deposit/personal-deposit.module#PersonalDepositModule'
	// 	// canActivate: [AuthGuard]
	// },
	{
		path: "consumer-deposit",
		loadChildren: () =>
			import("./consumer-deposit/consumer-deposit.module").then((m) => m.ConsumerDepositModule),
		// canActivate: [AuthGuard]
	},
	{
		path: "resume",
		loadChildren: () => import("./resume/resume.module").then((m) => m.ResumeModule),
		// canActivate: [AuthGuard]
	},
	{
		path: "business-deposit",
		loadChildren: () =>
			import("./business-deposit/business-deposit.module").then((m) => m.BusinessDepositModule),
		// canActivate: [AuthGuard]
	},
	{
		path: "verification/get-otp/:uuid/:enuuid",
		component: StaffOtpComponent,
	},
	{ path: "login", component: LoginComponent },
	{ path: "dashboard", component: DashboardComponent },
	{ path: "errors/:status", component: ErrorComponent },
	{ path: "tyfone-integration", component: TyfoneIntegrationComponent },
	// { path: '**', redirectTo: 'personal-deposit' },
	{ path: "**", redirectTo: "business-deposit" },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
