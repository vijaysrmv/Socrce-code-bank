import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorTimeoutComponent } from './error-timeout.component';

describe('ErrorTimeoutComponent', () => {
    let component: ErrorTimeoutComponent;
    let fixture: ComponentFixture<ErrorTimeoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorTimeoutComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorTimeoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
