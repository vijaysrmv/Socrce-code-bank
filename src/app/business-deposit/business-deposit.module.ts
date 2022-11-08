/*--------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Business
File Name              :  		business-deposit.module.ts
Author                 :		Amir Masood
Date (DD/MM/YYYY)      :		06/09/2019
Description            :		Business deposit module
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
--------------------------------------------------------------------------------------------------------*/

import { NgModule } from '@angular/core';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { BusinessDepositRoutingModule } from './business-deposit-routing.module';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { GettingStartedComponent } from './containers/getting-started/getting-started.component';
import { SelectProductComponent } from './containers/select-product/select-product.component';
import { ResponsibleDetailsComponent } from './containers/responsible-details/responsible-details.component';
import { BusinessDetailsComponent } from './containers/business-details/business-details.component';
import { BusinessFormComponent } from './components/business-form/business-form.component';
import { BusinessReviewComponent } from './containers/business-review/business-review.component';
import { UploadDocumentsComponent } from './containers/upload-documents/upload-documents.component';

import { AuthorizationService } from '../core/services/authorization.service';
import { BusinessDepositService } from './services/business-deposit.service';
import { CompanyDetailComponent } from './components/business-form/company-detail/company-detail.component';
import { MajorCustomersAndSupplierComponent } from './components/business-form/major-customers-and-supplier/major-customers-and-supplier.component';
import { DeclarationComponent } from './components/business-form/declaration/declaration.component';
import { ConnectedPartiesComponent } from './components/business-form/connected-parties/connected-parties.component';
import { GroupCompanyDetailsComponent } from './components/business-form/group-company-details/group-company-details.component';

const COMPONENTS = [
	GettingStartedComponent,
	SelectProductComponent,
	ResponsibleDetailsComponent,
	BusinessDetailsComponent,
	BusinessFormComponent,
	BusinessReviewComponent,
	UploadDocumentsComponent,
];

@NgModule({
	imports: [
		// NgMultiSelectDropDownModule,
		// AngularMultiSelectModule,
		BusinessDepositRoutingModule,
		CoreModule,
		SharedModule,
		
	],
	declarations: [
		...COMPONENTS,
		CompanyDetailComponent,
		MajorCustomersAndSupplierComponent,
		DeclarationComponent,
		ConnectedPartiesComponent,
		GroupCompanyDetailsComponent
	],
	providers: [
		AuthorizationService,
		BusinessDepositService
	]
})
export class BusinessDepositModule { }
