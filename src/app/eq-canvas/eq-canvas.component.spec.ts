import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EqCanvasComponent } from './eq-canvas.component';

describe('EqCanvasComponent', () => {
  let component: EqCanvasComponent;
  let fixture: ComponentFixture<EqCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EqCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EqCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
