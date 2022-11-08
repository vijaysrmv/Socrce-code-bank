// /*--------------------------------------------------------------------------------------------------------
//                 NEWGEN SOFTWARE TECHNOLOGIES LIMITED
// Group                  :        PES
// Project/Product        :        Newgen Bank
// Application            :
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

// import { JointDetailsComponent } from './joint-details.component';
// import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
// import { TextMaskModule } from 'angular2-text-mask';
// import { CustomMaskDirective } from '../../../core/directives/custom-mask/custom-mask.directive';
// import { NO_ERRORS_SCHEMA } from '@angular/core';
// import { MockConsumerService } from '../../../mock/consumer-service/consumerService.mock';
// import { IdScanService } from '../../../core/apis/id-scan.service';
// import { APP_BASE_HREF } from '@angular/common';
// import { Store, StoreModule } from '@ngrx/store';
// import { Router } from '@angular/router';
// import { PageLoaderService } from '../../../core/components/page-loader/page-loader.service';
// import { UtilityService } from '../../../core/utility/utility.service';
// import { DataService } from '../../../core/services/data.service';
// import { UspsService } from '../../../core/apis/usps.service';
// import { MockUspsService } from '../../../mock/usps-service/uspsService.mock';
// import { ModalBoxService } from '../../../shared/services/modal-box.service';

// class MockIdScanService { }

// class MockRouter {
//   navigate = jasmine.createSpy('navigate');
// }

// class MockUtilityService { }

// fdescribe('JointDetailsComponent', () => {
//   let component: JointDetailsComponent;
//   let fixture: ComponentFixture<JointDetailsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports:[ReactiveFormsModule, FormsModule, TextMaskModule, StoreModule.forRoot({})],
//       declarations: [ JointDetailsComponent, CustomMaskDirective ],
//       providers:[
//         PageLoaderService,
//         DataService,
//         ModalBoxService,
//         {provide:UtilityService,useClass:MockUtilityService},
//         {provide: Router, useClass: MockRouter},
//         { provide: APP_BASE_HREF, useValue: '/' },
//         Store,
//         {
//         provide: ConsumerService,
//         useValue: MockConsumerService
//       },
//       {
//         provide: IdScanService,
//         useValue: MockIdScanService
//       },
//       {
//         provide: UspsService,
//         useValue: MockUspsService
//       }
//     ],
//       schemas: [NO_ERRORS_SCHEMA]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(JointDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   fit('should create JointDetailsComponent', () => {
//     expect(component).toBeTruthy();
//   });

//   fit('#ngOnInit should create jointForm instance and get initial field data', () => {
//     component.selectedSingleAccount = true;
// 		component.ngOnInit();
//     expect(component.selectedSingleAccount).toBeTruthy();
//     expect(component.jointForm).toBeDefined();
//     expect(component.allStates).toBeDefined();
// 		expect(component.title).toBeDefined();
// 		expect(component.gender).toBeDefined();
// 		expect(component.suffix).toBeDefined();
// 		expect(component.employmentStatus).toBeDefined();
// 		expect(component.learnAboutUs).toBeDefined();
// 		expect(component.phoneTypes).toBeDefined();
// 		expect(component.idTypes).toBeDefined();
//     expect(component.validStates).toBeDefined();
//   });

//   // fit('', () => {
//   //   jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
//   //  });

//   fit('#ngOnInit should initialise jointAccountManager and its fields should be initialised as true if reviewPage is false',inject([ModalBoxService], (service: ModalBoxService) => {
//     component.reviewPage = false;
//     expect(component.reviewPage).toBeFalsy;
//     service.setJointCount(1);
//     expect(service.getJointCount()).toEqual(1);
//     component.ngOnInit();
//     expect(component.jointAccountManager).toBeDefined();
//     expect(component.jointAccountManager[0].editJointPersonalDetails).toEqual(true);
//     expect(component.jointAccountManager[0].editJointIdDetails).toEqual(true);
//     expect(component.jointAccountManager[0].editJointContactInfo).toEqual(true);
//     expect(component.jointAccountManager[0].editJointEmpDetails).toEqual(true);
//   }));

//   fit('#ngOnInit should initialise jointAccountManager and its fields should be initialised as false if reviewPage is true',inject([ModalBoxService], (service: ModalBoxService) => {
//     component.reviewPage = true;
//     expect(component.reviewPage).toBeTruthy;
//     service.setJointCount(1);
//     component.ngOnInit();
//     expect(component.jointAccountManager[0].editJointPersonalDetails).toEqual(false);
//     expect(component.jointAccountManager[0].editJointIdDetails).toEqual(false);
//     expect(component.jointAccountManager[0].editJointContactInfo).toEqual(false);
//     expect(component.jointAccountManager[0].editJointEmpDetails).toEqual(false);
//   }));

//   fit('#_addJointForm : Add Joint form count is one, selectedSingleAccount should be true ,formArray length should be equal to count',inject([ModalBoxService], (service: ModalBoxService) => {
//     component.selectedSingleAccount = true;
//     service.setJointCount(1);
//     let count =service.getJointCount();
//     component.ngOnInit();
//     expect(component.selectedSingleAccount).toBeTruthy;
//     const formArray = component.jointForm.get('jointList') as FormArray;
//     expect(formArray.length).toEqual(count);
//     expect(formArray.controls[0]['controls']['firstname'].errors.required).toBeTruthy();
//   }));


//   fit('#_addJointForm : required field validity for jointForm required fields',inject([ModalBoxService], (service: ModalBoxService) => {
//     component.selectedSingleAccount = true;
//     component.samePhysicalAsPrimary = true;
//     service.setJointCount(1);
//     component.ngOnInit();
//     const formArray = component.jointForm.get('jointList') as FormArray;
//     expect(formArray.controls[0]['controls']['firstname'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['lastname'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['dob'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['ssn'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['email'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['confirmEmail'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['mothermaiden'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['gender'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['primaryphonenumber'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['phonetype'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['uscitizen'].errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['identification']['controls'].type.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['identification']['controls'].number.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['identification']['controls'].issuestate.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['identification']['controls'].issuedate.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['identification']['controls'].expirydate.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['physicaladdress']['controls'].numberandstreet.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['physicaladdress']['controls'].zipcode.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['physicaladdress']['controls'].city.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['physicaladdress']['controls'].state.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['employment']['controls'].employmentstatus.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['employment']['controls'].employername.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['employment']['controls'].occupation.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['employment']['controls'].incomesource.errors.required).toBeTruthy();
//     expect(formArray.controls[0]['controls']['employment']['controls'].grossmonthlyincome.errors.required).toBeTruthy();

//   }));

//   fit('#_addJointForm : Add Joint form count is more than one, selectedSingleAccount should be false',inject([ModalBoxService], (service: ModalBoxService) => {
//     component.selectedSingleAccount = false;
//     service.setJointCount(2);
//     component.ngOnInit();
//     expect(component.selectedSingleAccount).toBeFalsy;
//   }));


// });
