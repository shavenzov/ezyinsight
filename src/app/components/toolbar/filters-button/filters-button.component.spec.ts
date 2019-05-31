import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersButtonComponent } from './filters-button.component';

describe('FiltersButtonComponent', () => {
  let component: FiltersButtonComponent;
  let fixture: ComponentFixture<FiltersButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
