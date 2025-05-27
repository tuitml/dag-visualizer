import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleDetectorComponent } from './cycle-detector.component';

describe('CycleDetectorComponent', () => {
  let component: CycleDetectorComponent;
  let fixture: ComponentFixture<CycleDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleDetectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
