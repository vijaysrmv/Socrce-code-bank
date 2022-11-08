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

import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';

import { APP_BASE_HREF, Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreModule, Store } from '@ngrx/store';
// tslint:disable-next-line:import-blacklist
import { Observable, of } from 'rxjs';

import { TextMaskModule } from 'angular2-text-mask';

import { DisclosureComponent } from './disclosure.component';
import { DisclosureService } from './disclosure.service';
import { DataService } from '../../../core/services/data.service';
import { SessionService } from '../../../core/services/session.service';
import { UtilityService } from '../../../core/utility/utility.service/utility.service';

import { MockConsumerService } from '../../../mock/consumer-service/consumerService.mock';
import { MockMdmService } from '../../../mock/mdm-service/mdmService.mock';
import { MockProductService } from '../../../mock/product-service/productService.mock';

import { Services } from '../../../core/models/product.model';
import { Disclosure } from '../../../core/models/disclosure.model';


const expectedservicesOffered = {
	selected: true,
	cardapplicant: null,
	carddelivery: null,
	overdraft: null
};

class MockDisclosureService {
	getRenewAccount(): Observable<any[]> {
		return of();
	}
}

class MProductService {
	// getServicesOffered(): Observable<Services> {
	// 	return of(expectedservicesOffered);
	// }
}
class MockRouter {
	navigate = jasmine.createSpy('navigate');
}

class MockUtilityService { }

fdescribe('DisclosureComponent', () => {
	let component: DisclosureComponent;
	let fixture: ComponentFixture<DisclosureComponent>;

	const expectedDisclosures = <Array<Disclosure>>[{
		title: 'Privacy and Account Disclosures',
		url: 'http://www.google.com'
	}];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ReactiveFormsModule, FormsModule, TextMaskModule, HttpClientModule, StoreModule.forRoot({})],
			declarations: [DisclosureComponent],
			providers: [MockMdmService,
				Location, { provide: LocationStrategy, useClass: PathLocationStrategy },
				DataService,
				SessionService,
				{ provide: UtilityService, useClass: MockUtilityService },
				{ provide: Router, useClass: MockRouter },
				{ provide: APP_BASE_HREF, useValue: '/' },
				Store,
				{
					provide: '',
					useValue: MockConsumerService
				}],
			schemas: [NO_ERRORS_SCHEMA]
		})
			.overrideComponent(DisclosureComponent, {
				set: {
					providers: [
						{
							provide: DisclosureService,
							useClass: MockDisclosureService
						},
						// {
						// 	provide: MockProductService,
						// 	useClass: MProductService
						// }
					]
				}
			}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DisclosureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('#getServices: servicesOffered should be equal to expectedservicesOffered ', () => {
		component.getServices();
		expect(component.servicesOffered).toEqual(expectedservicesOffered);
	});

	it('#ngOnInit call a service to get the array of the all disclosures', inject([MockMdmService], (mdmService: MockMdmService) => {
		spyOn(mdmService, 'getDisclosures').and.returnValue(of(expectedDisclosures));
		component.ngOnInit();
		expect(component.disclosures).toEqual(expectedDisclosures);
	}));

});
