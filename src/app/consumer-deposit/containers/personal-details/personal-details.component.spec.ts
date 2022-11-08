/*------------------------------------------------------------------------------------------------------
                NEWGEN SOFTWARE TECHNOLOGIES LIMITED
Group                  :        PES
Project/Product        :        Newgen - OAO
Application            :        Newgen Portal
Module                 :		Consumer Deposit
File Name              :        personal-details.component.spec.ts
Author                 : 		Aditya Agrawal
Date (DD/MM/YYYY)      : 	    16/09/2019
Description            : 		Test file for personal-details.component.ts
-------------------------------------------------------------------------------------------------------
                CHANGE HISTORY
-------------------------------------------------------------------------------------------------------
Problem No/CR No     Change Date     Changed By        Change Description
------------------------------------------------------------------------------------------------------*/

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { Router } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';

import { CoreModule } from '../../../core/core.module';

import { PersonalDetailsComponent } from './personal-details.component';
import { UspsService } from '../../../core/apis/usps.service';
import { BackendService } from '../../../core/backend/backend.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { DataService } from '../../../core/services/data.service';
import { UtilityService } from '../../../core/utility/utility.service/utility.service';
import { MockConsumerService } from '../../../mock/consumer-service/consumerService.mock';
import { MockBackendService } from '../../../mock/backend-service/backendService.mock';
import { MockUspsService } from '../../../mock/usps-service/uspsService.mock';
import { ModalBoxService } from '../../../shared/services/modal-box.service';

class MockIdScanService { }

class MockRouter {
	navigate = jasmine.createSpy('navigate');
}

class MockUtilityService { }

// import { MockBackendService } from '../../../mock/backend-service/backendService.mock';

// class MockConsumerService { }
// class MockBackendService { }

describe('PersonalDetailsComponent', () => {
	let component: PersonalDetailsComponent;
	let fixture: ComponentFixture<PersonalDetailsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CoreModule, StoreModule.forRoot({})],
			declarations: [PersonalDetailsComponent],
			providers: [{
				provide: '',
				useValue: MockConsumerService
			},
			{
				provide: BackendService,
				useValue: MockBackendService
			},
			{ provide: UtilityService, useClass: MockUtilityService },
			{ provide: Router, useClass: MockRouter },
			{ provide: APP_BASE_HREF, useValue: '/' },
			{
				provide: UspsService,
				useValue: MockUspsService
			},
				MockBackendService,
				AuthorizationService,
				Store,
				PageLoaderService,
				DataService,
				ModalBoxService
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PersonalDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('jointModalData should be Do you want to add a joint holder with your account?', () => {
		component.ngOnInit();
		expect(component.jointModalData.questionLabel).toEqual('Do you want to add a joint holder with your account?');
	});

	it('BeneficiaryModalData.questionLabel should be Do you want to include beneficiary?', () => {
		component.ngOnInit();
		expect(component.beneficiaryModalData.questionLabel).toEqual('Do you want to include beneficiary?');
	});

	it('jointModalData applicantCount should be 1 by default', () => {
		component.ngOnInit();
		expect(component.jointModalData.applicantCount).toEqual(1);
	});

	it('jointModalData applicantCount should be incremented by 1', () => {
		component.showJointModal = true;
		component.ngOnInit();
		component.addApplicant();
		expect(component.jointModalData.applicantCount).toEqual(2);
	});

	it('jointModalData applicantCount should not be incremented if applicantCount = 2', () => {
		component.showJointModal = true;
		component.jointModalData.applicantCount = 2;
		component.addApplicant();
		expect(component.jointModalData.applicantCount).toEqual(2);
	});

	it('jointModalData subtractApplicant should be decremented by 1 when applicationCount is 2 ', () => {
		component.showJointModal = true;
		component.jointModalData.applicantCount = 2;
		component.subtractApplicant();
		expect(component.jointModalData.applicantCount).toEqual(1);
	});

	it('jointModalData subtractApplicant should not be decremented by 1 when applicationCount is 1', () => {
		component.showJointModal = true;
		component.jointModalData.applicantCount = 1;
		component.subtractApplicant();
		expect(component.jointModalData.applicantCount).toEqual(1);
	});

	it('jointModalData, #addAccount should set applicationCount as jointModalData.applicantCount  if event is true', inject([ModalBoxService], (service: ModalBoxService) => {
		component.showJointModal = true;
		component.jointModalData.applicantCount = 2;
		component.addAccount(true);
		expect(service.getJointCount()).toEqual(2);
	}));

	it('jointModalData, #addAccount should set joint applicationCount as 0 if event is false', inject([ModalBoxService], (service: ModalBoxService) => {
		component.showJointModal = true;
		component.addAccount(false);
		// expect(component.showCountDiv).toBeFalsy();
		expect(service.jointAccountCount).toEqual(0);
		expect(component.showBeneficiaryModal).toBeTruthy();
	}));

	it('jointModalData, #addAccount should set beneficiary applicationCount as  getBeneficiaryCount() if event is false', inject([ModalBoxService], (service: ModalBoxService) => {
		component.showJointModal = true;
		service.setBeneficiaryCount(1);
		component.addAccount(false);
		// expect(component.showCountDiv).toBeTruthy();
		expect(component.beneficiaryModalData.applicantCount).toEqual(1);
	}));

	it('BeneficicaryData, #addAccount should set applicationCount as beneficiary applicationCount if event is true', inject([ModalBoxService], (service: ModalBoxService) => {
		// component.showJointModal = false;
		component.showBeneficiaryModal = true;
		component.beneficiaryModalData.applicantCount = 2;
		component.addAccount(true);
		expect(service.getBeneficiaryCount()).toEqual(2);
	}));

	it('BeneficicaryData, #addAccount should set beneficiary applicationCount as 0 if event is false', inject([ModalBoxService], (service: ModalBoxService) => {
		// component.showJointModal = false;
		component.showBeneficiaryModal = true;
		service.setBeneficiaryCount(3);
		component.addAccount(false);
		expect(service.getBeneficiaryCount()).toEqual(0);
	}));


	// beneficiary
	it('beneficiaryModalData applicantCount should be 1 by default', () => {
		component.ngOnInit();
		expect(component.beneficiaryModalData.applicantCount).toEqual(1);
	});

	it('beneficiaryModalData applicantCount should be incremented by 1', () => {
		component.showBeneficiaryModal = true;
		component.ngOnInit();
		component.addApplicant();
		expect(component.beneficiaryModalData.applicantCount).toEqual(2);
	});

	it('beneficiaryModalData applicantCount should not be incremented if applicantCount = 4', () => {
		component.showBeneficiaryModal = true;
		component.beneficiaryModalData.applicantCount = 4;
		component.addApplicant();
		expect(component.beneficiaryModalData.applicantCount).toEqual(4);
	});

	it('beneficiaryModalData subtractApplicant should be decremented by 1', () => {
		component.showBeneficiaryModal = true;
		component.beneficiaryModalData.applicantCount = 4;
		component.subtractApplicant();
		expect(component.beneficiaryModalData.applicantCount).toEqual(3);
	});

	it('beneficiaryModalData subtractApplicant should not be decremented by 1 when applicationCount is 1', () => {
		component.showBeneficiaryModal = true;
		component.beneficiaryModalData.applicantCount = 1;
		component.subtractApplicant();
		expect(component.beneficiaryModalData.applicantCount).toEqual(1);
	});

});
