import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InstructionManualComponent} from './instruction-manual.component';

describe('InstructionManualComponent', () => {
    let component: InstructionManualComponent;
    let fixture: ComponentFixture<InstructionManualComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InstructionManualComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InstructionManualComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
