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

import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { ConsumerFormComponent } from './consumer-form.component';
import { ReactiveFormsModule, FormsModule, } from '@angular/forms';
import { TextMaskModule } from 'angular2-text-mask';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomMaskDirective } from '../../../core/directives/custom-mask/custom-mask.directive';

import { IdScanService } from '../../../core/apis/id-scan.service';
import { DataService } from '../../../core/services/data.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { UspsService } from '../../../core/apis/usps.service';
import { UtilityService } from '../../../core/utility/utility.service/utility.service';
import { NotificationService } from '../../../core/services/notification.service';

import { MockUspsService } from '../../../mock/usps-service/uspsService.mock';
import { MockConsumerService } from '../../../mock/consumer-service/consumerService.mock';
import { UserIdleService } from 'angular-user-idle';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Store } from '@ngrx/store';
import { StoreModule } from '@ngrx/store';

class MockIdScanService { }

describe('ConsumerFormComponent', () => {
	let component: ConsumerFormComponent;
	let fixture: ComponentFixture<ConsumerFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, FormsModule, TextMaskModule, StoreModule.forRoot({})],
			declarations: [ConsumerFormComponent, CustomMaskDirective],
			providers: [
				{ provide: APP_BASE_HREF, useValue: '/' },
				IdScanService,
				DataService,
				PageLoaderService,
				UtilityService,
				UserIdleService,
				Store,
				NotificationService,
				ToastyService,
				ToastyConfig,
				{
					provide: IdScanService,
					useValue: MockIdScanService
				},
				{
					provide: '',
					useValue: MockConsumerService
				},
				{
					provide: UspsService,
					useValue: MockUspsService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConsumerFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#ngOnInit should create consumerForm instance and get initial field data', () => {
		component.ngOnInit();
		expect(component.consumerForm).toBeTruthy();
		expect(component.title).toBeDefined();
		// expect(component.gender).toBeDefined();
		expect(component.suffix).toBeDefined();
		expect(component.employmentStatus).toBeDefined();
		expect(component.learnAboutUs).toBeDefined();
		// expect(component.phoneTypes).toBeDefined();
		expect(component.idTypes).toBeDefined();
		expect(component.allStates).toBeDefined();
	});

	it('#ngOnInit should set initial value true to the properties when reviewPage initial value is false', fakeAsync(() => {
		component.ngOnInit();
		tick();
		expect(component.editPersonalDetails).toEqual(true);
		expect(component.editIdDetails).toEqual(true);
		expect(component.editContactInfo).toEqual(true);
		expect(component.editMailingAddress).toEqual(true);
		expect(component.editEmpDetails).toEqual(true);
	}));

	it('#ngOnInit should set initial value false to the properties when reviewPage initial value is true', fakeAsync(() => {
		component.reviewPage = true;
		component.ngOnInit();
		tick();
		expect(component.editPersonalDetails).toEqual(false);
		expect(component.editIdDetails).toEqual(false);
		expect(component.editContactInfo).toEqual(false);
		expect(component.editMailingAddress).toEqual(false);
		expect(component.editEmpDetails).toEqual(false);
	}));

	it('should set mismatch to true in consumerForm error property if email and confirm email value in consumerForm does not match', () => {
		component.consumerForm.controls['email'].setValue('test1@test.com');
		component.consumerForm.controls['confirmEmail'].setValue('test2@test.com');
		expect(component.consumerForm.errors.mismatch).toBeDefined();
		expect(component.consumerForm.errors.mismatch).toEqual(true);
	});

	it('should set error property in consumerForm null if email and confirm email value matches', () => {
		component.consumerForm.controls['email'].setValue('test1@test.com');
		component.consumerForm.controls['confirmEmail'].setValue('test1@test.com');
		expect(component.consumerForm.errors).toEqual(null);
	});

	it('required field validity for consumerForm required fields', () => {
		expect(component.consumerForm.controls.firstname.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.lastname.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.ssn.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.gender.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.primaryphonenumber.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.email.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.confirmEmail.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.mothermaiden.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.identification['controls'].type.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.identification['controls'].number.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.identification['controls'].issuestate.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.identification['controls'].issuedate.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.identification['controls'].expirydate.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.physicaladdress['controls'].numberandstreet.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.physicaladdress['controls'].zipcode.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.physicaladdress['controls'].city.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.physicaladdress['controls'].state.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.employment['controls'].employmentstatus.errors.required).toBeTruthy();
		expect(component.consumerForm.controls.employment['controls'].grossmonthlyincome.errors.required).toBeTruthy();
	});

	it('errors property for a field be null when required field has value in consumerForm', () => {
		component.consumerForm.controls['firstname'].setValue('testfirstname');
		component.consumerForm.controls['lastname'].setValue('testlastname');
		component.consumerForm.controls['gender'].setValue('male');
		component.consumerForm.controls['mothermaiden'].setValue('testname');
		component.consumerForm['controls'].identification['controls'].issuedate.setValue('id card');
		component.consumerForm['controls'].physicaladdress['controls'].zipcode.setValue('12345');
		component.consumerForm['controls'].employment['controls'].employmentstatus.setValue('Employed');
		expect(component.consumerForm.controls.firstname.errors).toEqual(null);
		expect(component.consumerForm.controls.lastname.errors).toEqual(null);
		expect(component.consumerForm.controls.gender.errors).toEqual(null);
		expect(component.consumerForm.controls.mothermaiden.errors).toEqual(null);
		expect(component.consumerForm.controls.identification['controls'].issuedate.errors).toEqual(null);
		expect(component.consumerForm.controls.physicaladdress['controls'].zipcode.errors).toEqual(null);
		expect(component.consumerForm.controls.employment['controls'].employmentstatus.errors).toEqual(null);
	});

	it('should set pattern property in consumerForm errors field if firstname not conforms to name pattern', () => {
		component.consumerForm.controls['firstname'].setValue('testspecialch@racter');
		expect(component.consumerForm.controls.firstname.errors.pattern).toBeDefined();
		component.consumerForm['controls'].firstname.setErrors(null);
		component.consumerForm.controls['firstname'].setValue('testnum6er');
		expect(component.consumerForm.controls.firstname.errors.pattern).toBeDefined();
	});

	it('should errors field be null in consumerForm if firstname conforms to name pattern', () => {
		component.consumerForm.controls['firstname'].setValue('testwithnoerror');
		expect(component.consumerForm.controls.firstname.errors).toEqual(null);
	});

	it('#onDateChanged should return dobInvalid true and reset dobPicker when age is invalid or less than 18 years', () => {
		component.onDateChanged('01/11/2010', 'dob');
		expect(component.dobInvalid).toEqual(true);
		expect(component.consumerForm.value.dobPicker).toEqual({ date: { year: 0, month: 0, day: 0 } });
	});

	it('#onDateChanged should return dobInvalid false and keep date value in dobPicker when age is greater than 18 years', () => {
		component.onDateChanged('01/11/1999', 'dob');
		expect(component.dobInvalid).toEqual(false);
		expect(component.consumerForm.value.dobPicker).toEqual({ date: { year: 1999, month: 1, day: 11 } });
	});

	it('#onDateChanged should return issueDateInvalid true and reset issuedatePicker when issueDate is invalid or greater than current date', () => {
		component.onDateChanged('01/11/2025', 'issueDate');
		expect(component.issueDateInvalid).toEqual(true);
		expect(component.consumerForm.value.identification.issuedatePicker).toEqual({ date: { year: 0, month: 0, day: 0 } });
	});

	it('#onDateChanged should return issueDateInvalid false and keep date value in issuedatePicker when issueDate is valid or less than current date', () => {
		component.onDateChanged('01/11/2015', 'issueDate');
		expect(component.expiryDateInvalid).toEqual(false);
		expect(component.consumerForm.value.identification.issuedatePicker).toEqual({ date: { year: 2015, month: 1, day: 11 } });
	});

	it('#onDateChanged should return expiryDateInvalid true and reset expirydatePicker when expiryDate is invalid or less than current date', () => {
		component.onDateChanged('01/11/2015', 'expiryDate');
		expect(component.expiryDateInvalid).toEqual(true);
		expect(component.consumerForm.value.identification.expirydatePicker).toEqual({ date: { year: 0, month: 0, day: 0 } });
	});

	it('#onDateChanged should return expiryDateInvalid false and keep date value in expirydatePicker when expiryDate is valid or greater than current date', () => {
		component.onDateChanged('01/11/2025', 'expiryDate');
		expect(component.issueDateInvalid).toEqual(false);
		expect(component.consumerForm.value.identification.expirydatePicker).toEqual({ date: { year: 2025, month: 1, day: 11 } });
	});
});
