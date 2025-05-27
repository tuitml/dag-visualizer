import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {DagVisualizerComponent} from './dag-visualizer/dag-visualizer.component';
import {CycleDetectorComponent} from './cycle-detector/cycle-detector.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DagVisualizerComponent, CycleDetectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'modeltool';
}
