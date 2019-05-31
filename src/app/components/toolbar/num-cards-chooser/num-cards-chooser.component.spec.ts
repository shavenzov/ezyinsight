import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumCardsChooserComponent } from './num-cards-chooser.component';

describe('NumCardsChooserComponent', () => {
  let component: NumCardsChooserComponent;
  let fixture: ComponentFixture<NumCardsChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumCardsChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumCardsChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
