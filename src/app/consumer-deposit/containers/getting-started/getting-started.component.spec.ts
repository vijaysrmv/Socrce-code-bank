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

import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { GettingStartedService } from './getting-started.service';
import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
import { UspsService } from '../../../core/apis/usps.service';
import { MockMdmService } from '../../../mock/mdm-service/mdmService.mock';
import { MockUspsService } from '../../../mock/usps-service/uspsService.mock';
// import { BackendService } from '../../../core/backend/backend.service';
// import { FooterLinksComponent } from '../../../core/components/footer-links/footer-links.component';
import { FooterActionComponent } from '../../../core/components/footer-action/footer-action.component';
import { GettingStartedComponent } from './getting-started.component';

// class FakeRoute {
// }

class MockGettingStartedService {
}

describe('GettingStartedComponent', () => {
	let component: GettingStartedComponent;
	let fixture: ComponentFixture<GettingStartedComponent>;
	let continueElement: DebugElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
			declarations: [
				GettingStartedComponent,
				FooterActionComponent
			],
			providers: [
				GettingStartedService,
				PageLoaderService,
				MockMdmService,
				{
					provide: UspsService,
					useValue: MockUspsService
				}
			],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
		TestBed.overrideComponent(GettingStartedComponent, {
			set: {
				providers: [
					{
						provide: UspsService,
						useClass: MockUspsService
					},
					{
						provide: GettingStartedService,
						useClass: MockGettingStartedService
					}
				]
			}
		});

		fixture = TestBed.createComponent(GettingStartedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// it('should create gettingStartedForm instance and get initial field data', () => {
	// 	component.ngOnInit();
	// 	expect(component.gettingStartedForm).toBeTruthy();
	// 	expect(component.relationship).toBeDefined();
	// 	expect(component.eligibleAffliations).toBeDefined();
	// });

	// it('gettingStartedForm invalid when empty', () => {
	// 	expect(component.gettingStartedForm.valid).toBeFalsy();
	// });

	it('should have continue button disabled initially', () => {
		continueElement = fixture.debugElement.query(By.css('[type="button"]'));
		expect(continueElement.nativeElement.textContent.trim()).toBe('Continue');
		expect(continueElement.nativeElement.disabled).toBeTruthy();
	});

	// it('should show continue button enabled when gettingStartedForm is valid', () => {
	// 	let qualification = component.gettingStartedForm.controls['qualification'];
	// 	let disclosure = component.gettingStartedForm.controls['disclosure'];

	// 	qualification.setValue('zipcode');
	// 	disclosure.setValue(true);
	// 	expect(component.gettingStartedForm.valid).toBeTruthy();
	// 	fixture.detectChanges();
	// 	continueElement = fixture.debugElement.query(By.css('[type="button"]'));
	// 	expect(continueElement.nativeElement.disabled).toBeFalsy();
	// });

	// it('call verifyzip method', () => {
	// 	// spyOn(component, 'verifyZip');
	// 	const zipEl = fixture.debugElement.query(By.css('[name="zipCode"]')).nativeElement;
	// 	zipEl.value = '02364';
	// 	zipEl.dispatchEvent(new Event('change'));
	// 	fixture.detectChanges();
	// 	// expect(component.verifyZip).toHaveBeenCalled();
	// });

	// it('call checkzipChar method', () => {
	// 	spyOn(component, 'checkZipChar');
	// 	const zipEl = fixture.debugElement.query(By.css('[name="zipCode"]')).nativeElement;
	// 	zipEl.value = '02364';
	// 	zipEl.dispatchEvent(new Event('keypress'));
	// 	fixture.detectChanges();
	// 	expect(component.checkZipChar).toHaveBeenCalled();
	// });

	// it('verify correct zip', () => {
	// 	const zipEl = fixture.debugElement.query(By.css('[name="zipCode"]')).nativeElement;
	// 	zipEl.value = '02364';
	// 	zipEl.dispatchEvent(new Event('change'));
	// 	fixture.detectChanges();
	// 	expect(component.validZip).toBe(true);
	// });

	// it('verify incorrect zip', () => {
	// 	const zipEl = fixture.debugElement.query(By.css('[name="zipCode"]')).nativeElement;
	// 	zipEl.value = '12345';
	// 	zipEl.dispatchEvent(new Event('change'));
	// 	fixture.detectChanges();
	// 	expect(component.validZip).toBe(false);
	// });

});
