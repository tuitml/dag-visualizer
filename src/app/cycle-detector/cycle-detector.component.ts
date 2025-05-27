// cycle-detector.component.ts
import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import * as dagre from 'dagre';
import felderJson from '../../assets/felder.json';
import regelnJson from '../../assets/regeln.json';
import {NgForOf, NgIf} from '@angular/common';
import {Feld} from '../models/feld';
import {Regel} from '../models/regel';
import {GraphService} from '../services/graph.service';



@Component({
  selector: 'app-cycle-detector',
  templateUrl: './cycle-detector.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  styleUrl: './cycle-detector.component.scss',
})
export class CycleDetectorComponent {
  felder: Feld[] = felderJson.felder as Feld[];
  regeln: Regel[] = regelnJson.regeln.map(regel => ({
    ...regel,
    consumesFelderWithIds: regel.javaDefinition?.consumesFelderWithIds ?? [],
  }));
  selectedField = new FormControl('');
  invalidFields: string[] = [];

  constructor(private graphService: GraphService) {
    this.selectedField.valueChanges.subscribe(feldId => {
      if (feldId) {
        this.checkCycles(feldId);
      }
    });
  }

  private checkCycles(selectedFeldId: string): void {
    const g = this.graphService.createGraph(this.felder, this.regeln);
    this.invalidFields = this.graphService.findDependentFields(g, selectedFeldId);
  }

  protected getFieldName(fieldId: string): string {
    return this.felder.find(f => f.id === fieldId)?.name || fieldId;
  }
}
