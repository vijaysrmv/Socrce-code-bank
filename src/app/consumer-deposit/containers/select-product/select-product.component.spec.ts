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

// import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
// import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
// import { By } from '@angular/platform-browser';
// import { NO_ERRORS_SCHEMA, Inject } from '@angular/core';
// import { Router, ActivatedRoute, RouterModule } from '@angular/router';
// import { SelectProductComponent } from './select-product.component';
// import { FormsModule } from '@angular/forms';
// import { TextMaskModule } from 'angular2-text-mask';
// import { StoreModule } from '@ngrx/store';
// import { of } from 'rxjs/observable/of';
// import { APP_BASE_HREF } from '@angular/common';


// import { MdmService } from '../../../core/apis/mdm.service';
// import { MockMdmService } from '../../../mock/mdm-service/mdmService.mock';
// import { FilterProductsPipe } from '../../../core/pipes/filter.pipe';
// import { FooterActionComponent } from '../../../core/components/footer-action/footer-action.component';
// import { FooterLinksComponent } from '../../../core/components/footer-links/footer-links.component';
// import { MockConsumerService } from '../../../mock/consumer-service/consumerService.mock';
// import { Observable } from 'rxjs/Observable';
// import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
// import { SelectProductService } from './select-product.service';
// import { DataService } from '../../../core/services/data.service';
// import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Product } from '../../../core/models/product.model';

// class MockSelectProductService {
// }
// // class MockMdmService {
// //   getProducts(): Observable<any> {
// //     return of(["1", "3"])
// //     // return new Observable((observer) => {

// //     // })
// //   }
// // }
// class FakeRoute { }

// class MockRouter {
// 	navigate = jasmine.createSpy('navigate');
// }
// class MockActivatedRoute extends ActivatedRoute {
// 	constructor() {
// 		super();
// 		this.snapshot = {
// 			url: null,
// 			params: null,
// 			queryParams: {
// 				'productid': 'test'
// 			},
// 			fragment: null,
// 			data: null,
// 			outlet: null,
// 			component: null,
// 			routeConfig: null,
// 			root: null,
// 			parent: null,
// 			firstChild: null,
// 			children: null,
// 			pathFromRoot: null,
// 			paramMap: null,
// 			queryParamMap: null
// 		};
// 	}
// }


// fdescribe('SelectProductComponent', () => {
// 	let component: SelectProductComponent;
// 	let fixture: ComponentFixture<SelectProductComponent>;
// 	let spy: any;

// 	const productArray = [{
// 		'productid': '115',
// 		'accounttypeid': 'CD',
// 		'accounttypedescription': 'CertificateOfDeposits',
// 		'atmcard': false,
// 		'debitcard': false,
// 		'oktopay': false,
// 		'olb': true,
// 		'billpay': false,
// 		'estatements': false,
// 		'isbusinesscustomer': false,
// 		'interestrate': 0.45,
// 		'ach': false,
// 		'active_flag': true,
// 		'minimumamount': 1000,
// 		'productname': 'CertificateOfDeposits-90days',
// 		'onlinewire': false,
// 		'dividendtype': 'quaterly',
// 		'dividendamount': null,
// 		'productdescription': '90 Days',
// 		'apy': 0.45
// 	}];

// 	beforeEach(async(() => {
// 		TestBed.configureTestingModule({
// 			imports: [
// 				ReactiveFormsModule, FormsModule, TextMaskModule, StoreModule.forRoot({}),
// 				BrowserAnimationsModule
// 			],
// 			declarations: [
// 				SelectProductComponent,
// 				FilterProductsPipe
// 			],
// 			providers: [
// 				{ provide: SelectProductService, useClass: MockSelectProductService },
// 				PageLoaderService,
// 				DataService,
// 				// MockMdmService,
// 				Location, { provide: LocationStrategy, useClass: PathLocationStrategy },

// 				{ provide: APP_BASE_HREF, useValue: '/' },
// 				{ provide: Router, useClass: MockRouter },
// 				{ provide: ActivatedRoute, useClass: MockActivatedRoute },
// 				{ provide: MdmService, useClass: MockMdmService },
// 				// MdmService,
// 				{ provide: '', useClass: MockConsumerService }
// 			],

// 			schemas: [NO_ERRORS_SCHEMA]
// 		})
// 			.compileComponents();
// 		// TestBed.overrideComponent(SelectProductComponent, {
// 		//   set: {
// 		//     providers: [{ provide: MdmService, useClass: MockMdmService }]
// 		//   }
// 		// });

// 		// fixture = TestBed.createComponent(SelectProductComponent);
// 		// component = fixture.componentInstance;
// 		// component.ngOnInit();
// 		// fixture.detectChanges();
// 	}));

// 	beforeEach(() => {
// 		fixture = TestBed.createComponent(SelectProductComponent);
// 		component = fixture.componentInstance;
// 		fixture.detectChanges();
// 	});

// 	it('should create', () => {
// 		expect(component).toBeTruthy();
// 	});

// 	it('#ngOnInit should create StudentCheckingForm instance and get initial field data', () => {
// 		component.ngOnInit();
// 		const studentDOB = component.studentCheckingForm.controls['dob'];
// 		let errors = {};
// 		const dob = component.studentCheckingForm.controls['dob'];

// 		errors = dob.errors || {};
// 		expect(component.studentCheckingForm).toBeTruthy();
// 		expect(studentDOB).toBeDefined();
// 		expect(studentDOB.valid).toBeFalsy();
// 		expect(errors['required']).toBeTruthy();
// 	});

// 	it('#ngOnInit should create YouthChekingForm instance and get initial field data', () => {
// 		component.ngOnInit();
// 		const youthDOB = component.youthCheckingForm.controls['dob'];
// 		let errors = {};
// 		const dob = component.studentCheckingForm.controls['dob'];

// 		errors = dob.errors || {};
// 		expect(component.youthCheckingForm).toBeTruthy();
// 		expect(youthDOB).toBeDefined();
// 		expect(youthDOB.valid).toBeFalsy();
// 		expect(errors['required']).toBeTruthy();
// 	});

// 	it('#ngOnInit should intialize the properties and and set the initial value', () => {
// 		component.ngOnInit();

// 		expect(component.activeProducts).toBeDefined();
// 		expect(component.certificateDepositProductList).toBeDefined();
// 		expect(component.studentChecking).toEqual(false);
// 		expect(component.certificateOfDeposit).toEqual(false);
// 		expect(component.viewCompleteMoneyInterest).toEqual(false);
// 		expect(component.viewMoneyInterest).toEqual(false);
// 		expect(component.showMoreTerms).toEqual(false);

// 		expect(component.worryFreeEnabled).toEqual(false);
// 		expect(component.checkingProduct).toEqual(false);
// 		expect(component.savingProduct).toEqual(true);
// 		expect(component.showMoreProducts).toEqual(false);
// 		expect(component.certificateDepositProduct).toEqual(true);
// 		expect(component.showStudentEligibilty).toEqual(false);
// 		expect(component.showYouthEligibility).toEqual(false);
// 		expect(component.showCompleteMoneyEligibilty).toEqual(false);
// 		expect(component.dobInvalid).toEqual(false);
// 		expect(component.youthDobInvalid).toEqual(false);
// 		expect(component.isIbpsFlow).toEqual(false);
// 		expect(component.isIbpsFlow).toEqual(false);
// 	});

// 	it('#ngOnInit call a service to get the array of the active products if active flag is true', inject([MdmService], (mdmService: MdmService) => {
// 		spy = spyOn(mdmService, 'getProducts').and.returnValue(of(productArray));
// 		component.ngOnInit();
// 		expect(component.activeProducts).toEqual(productArray);
// 	}));

// 	it('#ngOnInit: the activeproducts will be empty array if active flag is false', inject([MdmService], (mdmService: MdmService) => {
// 		productArray[0].active_flag = false;
// 		spy = spyOn(mdmService, 'getProducts').and.returnValue(of(productArray));
// 		component.ngOnInit();
// 		expect(spy).toHaveBeenCalled();
// 		expect(component.activeProducts).toEqual([]);
// 	}));

// 	it('when getCODProducts function called, return only those products which have accounttypeid = "CD"', () => {
// 		component.ngOnInit();
// 		expect(component.getCODProducts).toBeDefined();
// 		component.getCODProducts(productArray);
// 		productArray[0]['showError'] = false;
// 		expect(component.certificateDepositProductList).toEqual(productArray);
// 	});

// 	it('when getCODProducts function called and no product has accounttypeid = "CD" then return an empty array', () => {
// 		component.ngOnInit();
// 		expect(component.getCODProducts).toBeDefined();
// 		productArray[0].accounttypeid = 'DD';
// 		component.getCODProducts(productArray);
// 		expect(component.certificateDepositProductList).toEqual([]);
// 	});

// 	it('Call onDateChanged Method and if the selected product is TeenAccount then the valid age should be less than 18 and greater than 8', () => {
// 		component.onDateChanged('08/07/1995', 'TeenAccount');
// 		expect(component.dobInvalid).toEqual(true);
// 		component.onDateChanged('08/07/2008', 'TeenAccount');
// 		expect(component.dobInvalid).toEqual(false);
// 	});

// 	it('Call onDateChanged Method and send the selected product as other than TeenAccount, then the age should be less than the 8 years', () => {
// 		component.onDateChanged('08/07/1995', 'YouthSavingAccount');
// 		expect(component.youthDobInvalid).toEqual(true);
// 		component.onDateChanged('08/07/2012', 'YouthSavingAccount');
// 		expect(component.youthDobInvalid).toEqual(false);
// 	});

// 	it('For TeenAccount product, showStudentEligibilty should be true', () => {
// 		const eventObj = {
// 			target: {
// 				'textContent': 'Select'
// 			}
// 		};
// 		component.selectProduct(eventObj, 'TeenAccount');
// 		expect(component.showStudentEligibilty).toEqual(true);
// 	});

// 	it('For YouthSaving product, showYouthEligibilty should be true', () => {
// 		const eventObj = {
// 			target: {
// 				'textContent': 'Select'
// 			}
// 		};
// 		component.selectProduct(eventObj, 'YouthSaving');
// 		expect(component.showYouthEligibility).toEqual(true);
// 	});

// 	fit('Click on remove product, show call the function toggleProduct', () => {
// 		spyOn(component, 'toggleProduct').and.callThrough();
// 		const eventObj = {
// 			target: {
// 				'textContent': 'Remove'
// 			}
// 		};
// 		component.selectProduct(eventObj, 'YouthSaving');
// 		expect(component.toggleProduct).toHaveBeenCalled();
// 	});

// });
