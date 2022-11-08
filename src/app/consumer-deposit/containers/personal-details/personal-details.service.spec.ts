// /*------------------------------------------------------------------------------------------------------
//                 NEWGEN SOFTWARE TECHNOLOGIES LIMITED
// Group                  :        PES
// Project/Product        :        Newgen - OAO
// Application            :        Newgen Portal
// Module                 :		Consumer Deposit
// File Name              : 		personal-details.service.spec.ts
// Author                 : 		Aditya Agrawal
// Date (DD/MM/YYYY)      : 		16/09/2019
// Description            : 		Test file for personal-details.service.ts
// -------------------------------------------------------------------------------------------------------
//                 CHANGE HISTORY
// -------------------------------------------------------------------------------------------------------
// Problem No/CR No     Change Date     Changed By        Change Description
// ------------------------------------------------------------------------------------------------------*/

// import { TestBed, inject } from '@angular/core/testing';
// import { FormControl, FormGroup } from '@angular/forms';

// import { PersonalDetailsService } from './personal-details.service';

// class MockConsumerService {
// }

// const consumerForm = new FormGroup({
// 	lastname: new FormControl(''),
// 	dob: new FormControl(''),
// 	email: new FormControl(''),
// 	primaryphonenumber: new FormControl(''),
// 	identification: new FormGroup({
// 		issuedate: new FormControl(''),
// 		expirydate: new FormControl(''),
// 	}),
// });

// describe('PersonalDetailsService', () => {
// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			providers: [
// 				PersonalDetailsService,
// 				{
// 					provide: '',
// 					useValue: MockConsumerService
// 				}
// 			]
// 		});
// 	});

// 	it('should be created', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		expect(service).toBeTruthy();
// 	}));

// 	it('#setConsumerData should return value in specific format', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		const arn = null;
// 		const personaldetails = Object({ lastname: '', dob: '', email: '', primaryphonenumber: '', identification: Object({ issuedate: '', expirydate: '' }) });
// 		expect(service.setConsumerData(consumerForm)).toEqual({ arn: arn, personaldetails: personaldetails });
// 	}));

// 	it('#setConsumerData should copy physical address to mailing address in personaldetails if second parameter provided true', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		const expectedData = {
// 			numberandstreet: '123 teststreet',
// 			aptorsuite: 'test suite',
// 			zipcode: '12345',
// 			city: 'testcity',
// 			state: 'teststate'
// 		};
// 		const physicaladdress = new FormGroup({
// 			numberandstreet: new FormControl('123 teststreet'),
// 			aptorsuite: new FormControl('test suite'),
// 			zipcode: new FormControl('12345'),
// 			city: new FormControl('testcity'),
// 			state: new FormControl('teststate')
// 		});
// 		consumerForm.addControl('physicaladdress', physicaladdress);
// 		const returnData = service.setConsumerData(consumerForm, true);
// 		expect(returnData.personaldetails.mailingaddress).toBeTruthy();
// 		expect(returnData.personaldetails.mailingaddress).toEqual(expectedData);
// 	}));

// 	it('#checkMilestoneError should not return true if dob, lastname, email have values and validated', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		consumerForm.controls['lastname'].setValue('testlastname');
// 		consumerForm.controls['dob'].setValue('testdob');
// 		consumerForm.controls['email'].setValue('testemail');
// 		consumerForm.addControl('confirmEmail', new FormControl('testemail'));
// 		expect(service.checkMilestoneError(consumerForm)).not.toEqual(true);
// 	}));


// 	it('#checkMilestoneError should return true if dob, lastname, email empty', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		consumerForm['controls'].lastname.setErrors({ 'incorrect': false });
// 		expect(service.checkMilestoneError(consumerForm)).toEqual(true);
// 	}));

// 	it('#checkMilestoneError should return true if dob, lastname, email are not empty but have errors', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		consumerForm.controls['lastname'].setValue('testlastname');
// 		consumerForm.controls['dob'].setValue('testdob');
// 		consumerForm.controls['email'].setValue('testemail');
// 		consumerForm.addControl('confirmEmail', new FormControl('testemail'));
// 		consumerForm['controls'].lastname.markAsDirty();
// 		consumerForm['controls'].lastname.setErrors({ 'incorrect': true });
// 		expect(service.checkMilestoneError(consumerForm)).toEqual(true);
// 	}));

// 	it('#checkFormSemantics should not return true if formgroup not have errors ', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		consumerForm['controls'].lastname.setErrors(null);
// 		expect(service.checkFormSemantics(consumerForm, false)).not.toEqual(true);
// 	}));

// 	it('#checkFormSemantics should return true if formgroup have errors ', inject([PersonalDetailsService], (service: PersonalDetailsService) => {
// 		consumerForm['controls'].lastname.markAsDirty();
// 		consumerForm['controls'].lastname.setErrors({ 'incorrect': true });
// 		expect(service.checkFormSemantics(consumerForm, false)).toEqual(true);
// 	}));

// });
