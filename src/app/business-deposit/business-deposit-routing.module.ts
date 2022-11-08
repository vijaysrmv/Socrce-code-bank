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

import { GettingStartedComponent } from './containers/getting-started/getting-started.component';
import { SelectProductComponent } from './containers/select-product/select-product.component';
import { ResponsibleDetailsComponent } from './containers/responsible-details/responsible-details.component';
import { BusinessDetailsComponent } from './containers/business-details/business-details.component';
import { BusinessReviewComponent } from './containers/business-review/business-review.component';
import { UploadDocumentsComponent } from './containers/upload-documents/upload-documents.component';

import { DueDiligenceQuestionnaireComponent } from '../shared/containers/due-diligence-questionnaire/due-diligence-questionnaire.component';
import { DisclosureComponent } from '../shared/containers/disclosure/disclosure.component';
import { DocuSignComponent } from '../shared/containers/docu-sign/docu-sign.component';
import { AccountFundingComponent } from '../shared/containers/account-funding/account-funding.component';
import { PlaidComponent } from '../shared/components/plaid/plaid.component';
import { FinishComponent } from '../shared/components/finish/finish.component';
import { SuccessComponent } from '../shared/components/success/success.component';

import { StateGuard } from '../core/services/state-guard.service';

const routes: Routes = [
	{ path: '', redirectTo: 'getting-started', pathMatch: 'full' },
	{ path: 'getting-started', component: GettingStartedComponent },
	{ path: 'select-product', component: SelectProductComponent, canActivate: [StateGuard] },
	{ path: 'responsible-details', component: ResponsibleDetailsComponent, canActivate: [StateGuard] },
	{ path: 'business-details', component: BusinessDetailsComponent, canActivate: [StateGuard] },
	{ path: 'review', component: BusinessReviewComponent, canActivate: [StateGuard] },
	{ path: 'due-diligence-questionnaire', component: DueDiligenceQuestionnaireComponent, canActivate: [StateGuard] },
	{ path: 'upload-documents', component: UploadDocumentsComponent, canActivate: [StateGuard] },
	{ path: 'disclosure', component: DisclosureComponent, canActivate: [StateGuard] },
	{ path: 'docusign/:arn/envelope/:envelopeId/docusignId/:docusignId', component: DocuSignComponent },
	{ path: 'account-funding', component: AccountFundingComponent, canActivate: [StateGuard] },
	{ path: 'plaid', component: PlaidComponent, canActivate: [StateGuard] },
	{ path: 'finish/success', component: SuccessComponent, canActivate: [StateGuard] },
	{ path: 'finish/:status', component: FinishComponent, canActivate: [StateGuard] },
	{ path: 'funding/:status', component: FinishComponent, canActivate: [StateGuard] },
	{ path: '**', redirectTo: 'getting-started' }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class BusinessDepositRoutingModule { }
