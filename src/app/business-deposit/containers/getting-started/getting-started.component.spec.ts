// /*--------------------------------------------------------------------------------------------------------
//                 NEWGEN SOFTWARE TECHNOLOGIES LIMITED
// Group                  :        PES
// Project/Product        :        Newgen - OAO
// Application            :        Newgen Portal
// Module                 :
// File Name              :
// Author                 :
// Date (DD/MM/YYYY)      :
// Description            :
// -------------------------------------------------------------------------------------------------------
//                 CHANGE HISTORY
// -------------------------------------------------------------------------------------------------------
// Problem No/CR No     Change Date     Changed By        Change Description
// --------------------------------------------------------------------------------------------------------*/

// import { Router } from '@angular/router';
// import { GettingStartedService } from './getting-started.service';
// import { MockUspsService } from '../../../mock/usps-service/uspsService.mock';
// import { UspsService } from '../../../core/apis/usps.service';
// import { FooterActionComponent } from '../../../core/components/footer-action/footer-action.component';
// import { FormsModule } from '@angular/forms';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { GettingStartedComponent } from './getting-started.component';
// import { By } from '@angular/platform-browser';

// class FakeRoute {

// }

// describe('GettingStartedComponent', () => {
// 	let component: GettingStartedComponent;
// 	let fixture: ComponentFixture<GettingStartedComponent>;

// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			imports: [FormsModule],
// 			declarations: [
// 				GettingStartedComponent,
// 				FooterActionComponent
// 			],
// 			providers: [
// 				GettingStartedService,
// 				{
// 					provide: Router,
// 					useClass: FakeRoute
// 				},
// 				{
// 					provide: UspsService,
// 					useClass: MockUspsService
// 				}
// 			],
// 			schemas: [NO_ERRORS_SCHEMA]
// 		}).compileComponents();

// 		// this.usps = TestBed.get(UspsService);
// 		fixture = TestBed.createComponent(GettingStartedComponent);
// 		component = fixture.componentInstance;
// 		fixture.detectChanges();
// 	});

// 	it('should create', () => {
// 		expect(component).toBeTruthy();
// 	});

// 	describe('verifyZip()', () => {
// 		beforeEach(() => {
// 			const zipEl = fixture.debugElement.query(By.css('[name="zipCode"]'));
// 			spyOn(component, 'verifyZip').and.callThrough();
// 		});

// 		it('should validate zipcode', () => {
// 			this.zipEl.nativeElement.value = '02364';
// 			this.zipEl.nativeElement.dispatchEvent(new Event('change'));
// 			fixture.detectChanges();
// 			// expect(component.onProductChanged).toHaveBeenCalled();
// 			// expect(component.selectedProduct).toEqual();
// 		});
// 	});
// });
