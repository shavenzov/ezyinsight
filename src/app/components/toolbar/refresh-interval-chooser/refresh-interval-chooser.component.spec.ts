import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefreshIntervalChooserComponent } from './refresh-interval-chooser.component';

describe('RefreshIntervalChooserComponent', () => {
  let component: RefreshIntervalChooserComponent;
  let fixture: ComponentFixture<RefreshIntervalChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefreshIntervalChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefreshIntervalChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
