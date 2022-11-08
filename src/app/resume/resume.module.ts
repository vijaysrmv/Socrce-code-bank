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

import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ResumeRoutingModule } from './resume-routing.module';

import { ResumeService } from './services/resume.service';
import { DataService } from '../core/services/data.service';

import { VerifyOtpComponent } from './containers/verify-otp/verify-otp.component';
import { SavedApplicationsComponent } from './containers/saved-applications/saved-applications.component';
import { TrackApplicationComponent } from './containers/track-application/track-application.component';
import { UploadDocumentsComponent } from './containers/upload-documents/upload-documents.component';
// import { SelectChoiceComponent } from './components/select-choice/select-choice.component';
// import { CategoryComponent } from './components/category/category.component';
// import { ProductComponent } from '../core/components/product/product.component';

const COMPONENTS = [
	TrackApplicationComponent,
	// SelectChoiceComponent,
	VerifyOtpComponent,
	SavedApplicationsComponent,
	UploadDocumentsComponent
];

@NgModule({
	imports: [
		CoreModule,
		ResumeRoutingModule,
		SharedModule,
	],
	declarations: [
		...COMPONENTS
	],
	providers: [
		DataService,
		ResumeService
	]
})
export class ResumeModule { }
