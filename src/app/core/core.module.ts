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

import { NgModule, ErrorHandler } from "@angular/core";
import { CommonModule, CurrencyPipe, Location } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { TextMaskModule } from "angular2-text-mask";
import { MyDatePickerModule } from "mydatepicker";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { NgProgressModule } from "ngx-progressbar";
import { ToastyModule } from "ng2-toasty";

import { AppComponent } from "./containers/app/app.component";
import { ErrorComponent } from "./containers/error/error.component";
import { TyfoneIntegrationComponent } from "./containers/tyfone/tyfone-integration.component";
import { FooterActionComponent } from "./components/footer-action/footer-action.component";
import { FooterLinksComponent } from "./components/footer-links/footer-links.component";
import { HeaderComponent } from "./components/header/header.component";
import { PageLoaderComponent } from "./components/page-loader/page-loader.component";
import { ResumePopupComponent } from "./components/resume-popup/resume-popup.component";
import { StepperComponent } from "./components/stepper/stepper.component";

import { BlockCopyPasteDirective } from "./directives/block-copy-paste/block-copy-paste.directive";
import { CustomMaskDirective } from "./directives/custom-mask/custom-mask.directive";
import { ModalFocusDirective } from "./directives/modal-focus/modal-focus.directive";
import { NumberOnlyDirective } from "./directives/allow-only-numbers/only-numbers.directive";
import { PreventEventsDirective } from "./directives/prevent-events/prevent-events.directive";

import { DocumentService } from "./apis/document.service";
import { IdScanService } from "./apis/id-scan.service";
import { MdmService } from "./apis/mdm.service";
import { MdmDataService } from "./services/mdm-data.service";
import { OaoService } from "./apis/oao.service";
import { UspsService } from "./apis/usps.service";

import { BackendService } from "./backend/backend.service";
import { ErrorsHandler } from "./error-handler/error-handler.service";
import { AuthorizationService } from "./services/authorization.service";
import { DataService } from "./services/data.service";
import { FormUtilityService } from "./services/form-utility.service";
import { NotificationService } from "./services/notification.service";
import { SessionService } from "./services/session.service";
import { ServerErrorInterceptor } from "./utility/server-error.interceptor/server-error.interceptor";
import { UtilityService } from "./utility/utility.service/utility.service";

import { PageLoaderService } from "./components/page-loader/page-loader.service";
import { FilterProductsPipe, FilterDocumentsPipe } from "./pipes/filter.pipe";
import { environment } from "../../environments/environment";

import { MockIdScanService } from "../mock/idscan-service/idScanService.mock";
import { MockMdmService } from "../mock/mdm-service/mdmService.mock";
import { StaffOtpComponent } from "./containers/staff-otp/staff-otp.component";
import { AuthService } from "./apis/auth.service";
import { FormatAmountDirective } from "./directives/format-amount/format-amount.directive";
import { LoginComponent } from "../shared/components/login/login.component";
import { DashboardComponent } from "../shared/components/dashboard/dashboard.component";
import { NgxChartsModule } from "@swimlane/ngx-charts";

export const COMPONENTS = [
	AppComponent,
	HeaderComponent,
	StepperComponent,
	FooterActionComponent,
	FooterLinksComponent,
	FilterProductsPipe,
	FilterDocumentsPipe,
	BlockCopyPasteDirective,
	CustomMaskDirective,
	ModalFocusDirective,
	NumberOnlyDirective,
	PreventEventsDirective,
	PageLoaderComponent,
	ResumePopupComponent,
	ErrorComponent,
	TyfoneIntegrationComponent,
	StaffOtpComponent,
	FormatAmountDirective,
	LoginComponent,
	DashboardComponent,
];

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		HttpClientModule,
		NgProgressModule,
		ToastyModule.forRoot(),
		ModalModule.forRoot(),
		BsDropdownModule.forRoot(),
		AccordionModule.forRoot(),
		CarouselModule.forRoot(),
		MyDatePickerModule,
		TextMaskModule,
		NgxChartsModule,
	],
	declarations: COMPONENTS,
	exports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		ToastyModule,
		ModalModule,
		BsDropdownModule,
		AccordionModule,
		CarouselModule,
		MyDatePickerModule,
		TextMaskModule,
		NgxChartsModule,
		COMPONENTS,
	],
})
export class CoreModule {
	static forRoot() {
		return {
			ngModule: CoreModule,
			providers: [
				// { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
				CurrencyPipe,
				Location,
				NotificationService,
				// {
				// 	provide: BackendService,
				// 	useClass: environment.MOCK_BACKEND_SERVICES ? MockBackendService : BackendService
				// },
				BackendService,
				SessionService,
				UtilityService,
				{
					provide: MdmService,
					useClass: environment.MOCK_MDM_SERVICES ? MockMdmService : MdmService,
				},
				MdmDataService,
				AuthorizationService,
				{
					provide: IdScanService,
					useClass: environment.MOCK_IDSCAN_SERVICES ? MockIdScanService : IdScanService,
				},
				PageLoaderService,
				DocumentService,
				UspsService,
				{ provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
				// { provide: HTTP_INTERCEPTORS, useClass: NgProgressInterceptor, multi: true },
				{ provide: ErrorHandler, useClass: ErrorsHandler },
				DataService,
				FormUtilityService,
				OaoService,
				AuthService,
			],
		};
	}
}
