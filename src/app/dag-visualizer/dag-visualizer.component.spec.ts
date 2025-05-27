import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DagVisualizerComponent } from './dag-visualizer.component';

describe('DagVisualizerComponent', () => {
  let component: DagVisualizerComponent;
  let fixture: ComponentFixture<DagVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DagVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DagVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
