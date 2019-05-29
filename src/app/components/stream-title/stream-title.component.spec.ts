import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamTitleComponent } from './stream-title.component';

describe('StreamTitleComponent', () => {
  let component: StreamTitleComponent;
  let fixture: ComponentFixture<StreamTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
