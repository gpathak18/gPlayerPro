import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllmusicComponent } from './allmusic.component';

describe('AllmusicComponent', () => {
  let component: AllmusicComponent;
  let fixture: ComponentFixture<AllmusicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllmusicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllmusicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
