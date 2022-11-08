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

import { ConsumerDepositRoutingModule } from './consumer-deposit-routing.module';

import { GettingStartedComponent } from './containers/getting-started/getting-started.component';
import { SelectProductComponent } from './containers/select-product/select-product.component';
import { PersonalDetailsComponent } from './containers/personal-details/personal-details.component';
import { ReviewApproveComponent } from './containers/review-approve/review-approve.component';
import { JointDetailsComponent } from './containers/joint-details/joint-details.component';
import { BeneficiaryDetailsComponent } from './containers/beneficiary-details/beneficiary-details.component';
import { IraComponent } from './containers/ira/ira.component';

import { AuthorizationService } from '../core/services/authorization.service';
import { ConsumerDepositService } from './services/consumer-deposit.service';
import { ConsumerStateGuard } from './services/consumer-state-guard.service';
import { MockMdmService } from '../mock/mdm-service/mdmService.mock';

const COMPONENTS = [
	GettingStartedComponent,
	SelectProductComponent,
	PersonalDetailsComponent,
	ReviewApproveComponent,
	JointDetailsComponent,
	BeneficiaryDetailsComponent,
	IraComponent
];

@NgModule({
	imports: [
		CoreModule,
		ConsumerDepositRoutingModule,
		SharedModule
	],
	declarations: [
		...COMPONENTS
	],
	providers: [
		AuthorizationService,
		ConsumerStateGuard,
		MockMdmService,
		ConsumerDepositService
	]
})
export class ConsumerDepositModule { }
