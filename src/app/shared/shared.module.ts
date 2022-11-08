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

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { CoreModule } from '../core/core.module';

import { AccountFundingComponent } from './containers/account-funding/account-funding.component';
import { DisclosureComponent } from './containers/disclosure/disclosure.component';
import { DocuSignComponent } from './containers/docu-sign/docu-sign.component';
import { ModalBoxComponent } from './containers/modal-box/modal-box.component';
import { DueDiligenceQuestionnaireComponent } from './containers/due-diligence-questionnaire/due-diligence-questionnaire.component';

import { AddressComponent } from './components/address/address.component';
import { ConsumerFormComponent } from './components/consumer-form/consumer-form.component';
import { EmploymentComponent } from './components/employment/employment.component';
import { ErrorTimeoutComponent } from './components/error-timeout/error-timeout.component';
import { FinishComponent } from './components/finish/finish.component';
import { IdentityComponent } from './components/identity/identity.component';
import { IdScanComponent } from './components/id-scan/id-scan.component';
import { MfaFormComponent } from './components/mfa-form/mfa-form.component';
import { PaymentCardFormComponent } from './components/payment-card-form/payment-card-form.component';
import { PlaidComponent } from './components/plaid/plaid.component';
import { SelectAccountComponent } from './components/select-account/select-account.component';
import { SelectChoiceComponent } from './components/select-choice/select-choice.component';
import { SuccessComponent } from './components/success/success.component';
import { OtpComponent } from './components/otp/otp.component';

import { ModalBoxService } from './services/modal-box.service';
import { OtpService } from './services/otp.service';
import { InsufficientFundsComponent } from './components/insufficient-funds/insufficient-funds.component';
// import { SharedMdmService } from './services/shared-mdm.service';

const COMPONENTS = [
    AccountFundingComponent,
    DisclosureComponent,
    DocuSignComponent,
    ModalBoxComponent,
    DueDiligenceQuestionnaireComponent,
    AddressComponent,
    ConsumerFormComponent,
    EmploymentComponent,
    ErrorTimeoutComponent,
    FinishComponent,
    IdentityComponent,
    IdScanComponent,
    MfaFormComponent,
    PaymentCardFormComponent,
    PlaidComponent,
    SelectAccountComponent,
    SelectChoiceComponent,
    SuccessComponent,
    OtpComponent,
    InsufficientFundsComponent
];

@NgModule({
    imports: [
        CoreModule,
        ReactiveFormsModule,
        TypeaheadModule
    ],
    declarations: COMPONENTS,
    bootstrap: [MfaFormComponent, OtpComponent],
    providers: [
        ModalBoxService,
        OtpService
    ],
    exports: COMPONENTS
})
export class SharedModule { }
