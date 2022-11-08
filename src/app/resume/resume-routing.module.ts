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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackApplicationComponent } from './containers/track-application/track-application.component';
import { VerifyOtpComponent } from './containers/verify-otp/verify-otp.component';
import { SavedApplicationsComponent } from './containers/saved-applications/saved-applications.component';
import { UploadDocumentsComponent } from './containers/upload-documents/upload-documents.component';
import { FinishComponent } from '../shared/components/finish/finish.component';

import { StateGuard } from '../core/services/state-guard.service';

const routes: Routes = [
	{ path: '', redirectTo: 'track-application', pathMatch: 'full' },
	{ path: 'track-application', component: TrackApplicationComponent },
	{ path: 'verify-otp', component: VerifyOtpComponent, canActivate: [StateGuard] },
	{ path: 'saved-applications', component: SavedApplicationsComponent, canActivate: [StateGuard] },
	{ path: 'upload-document', component: UploadDocumentsComponent, canActivate: [StateGuard] },
	{ path: 'finish/:status', component: FinishComponent, canActivate: [StateGuard] },
	{ path: '**', redirectTo: 'track-application' }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ResumeRoutingModule { }
