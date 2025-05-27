import { Injectable } from '@angular/core';
import {Feld} from '../models/feld';
import {Regel} from '../models/regel';
import dagre from 'dagre';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  createGraph(felder: Feld[], regeln: Regel[]): dagre.graphlib.Graph {
    const g = new dagre.graphlib.Graph();
    g.setGraph({});
    g.setDefaultEdgeLabel(() => ({}));

    // Knoten hinzufügen
    felder.forEach(feld => {
      g.setNode(feld.id, feld.name);
    });

    // Kanten hinzufügen
    felder.forEach(feld => {
      (feld.datenmanipulationslogikregeln ?? []).forEach(regelId => {
        const regel = regeln.find(r => r.id === regelId);
        if (regel?.consumesFelderWithIds) {
          regel.consumesFelderWithIds.forEach(targetId => {
            if (felder.some(f => f.id === targetId) && feld.id !== targetId) {
              g.setEdge(targetId, feld.id);
            }
          });
        }
      });
    });

    return g;
  }

  findDependentFields(g: dagre.graphlib.Graph, startNode: string): string[] {
    const visited = new Set<string>();
    const toVisit = [startNode];

    while (toVisit.length > 0) {
      const current = toVisit.pop()!;
      if (!visited.has(current)) {
        visited.add(current);
        const predecessors = g.predecessors(current) as string[] | undefined;
        if (predecessors) {
          toVisit.push(...predecessors);
        }
      }
    }

    return Array.from(visited).filter(id => id !== startNode);
  }
}
