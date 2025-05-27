import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as dagre from 'dagre';
import * as d3 from 'd3';
import { forkJoin } from 'rxjs';
import felderJson from '../../assets/felder.json';
import regelnJson from '../../assets/regeln.json';

interface Feld {
  id: string;
  name: string;
  datenmanipulationslogikregeln: string[];
}

interface Regel {
  id: string;
  consumesFelderWithIds: string[];
}

@Component({
  selector: 'app-dag-visualizer',
  template: `<svg id="dag"></svg>`,
  styles: [
    `
      #dag {
        width: 100%;
        height: 800px;
        border: 1px solid #ccc;
      }
      .node rect {
        stroke: #333;
        fill: #fff;
      }
      .edgePath path {
        stroke: #333;
        fill: none;
      }
      .node text {
        font-size: 12px;
      }
    `,
  ],
})
export class DagVisualizerComponent implements OnInit {
  constructor(private http: HttpClient) {}


  ngOnInit(): void {
    const felder = felderJson.felder as Feld[];
    const regeln: Regel[] = regelnJson.regeln.map(regel => ({
      ...regel,
      consumesFelderWithIds: regel.javaDefinition?.consumesFelderWithIds ?? []
    }));
    this.createDag(felder, regeln);
  }

  getTextWidth(text: string, font: string = '12px sans-serif'): number{
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return 200;
    context.font = font;
    return context.measureText(text).width + 50;
  }

  createDag(felder: Feld[], regeln: Regel[]): void {
    // DAG mit dagre erstellen
    const g = new dagre.graphlib.Graph().setGraph({
      rankdir: 'LR',
      nodesep: 50,
      ranksep: 150,
      marginx: 20,
      marginy: 20
    }).setDefaultEdgeLabel(() => ({}));

    // Knoten hinzufügen (Felder)
    felder.forEach((feld) => {
      g.setNode(feld.id, { label: feld.name, width: this.getTextWidth(feld.name), height: 50 });
    });

    // Kanten basierend auf Regeln hinzufügen
    felder.forEach((feld) => {
      (feld.datenmanipulationslogikregeln ?? []).forEach((regelId) => {
        const regel = regeln.find((r) => r.id === regelId);
        if (regel && regel.consumesFelderWithIds) {
          regel.consumesFelderWithIds.forEach((targetId) => {
            if (felder.find((f) => f.id === targetId) && feld.id !== targetId) {
              g.setEdge(targetId,feld.id);
            }
          });
        }
      });
    });

    // Layout berechnen
    dagre.layout(g);

    // D3 Visualisierung
    const svg = d3.select('#dag');
    svg.attr('width', '100%').attr('height',600);
    const inner = svg.append('g');

    // Kanten rendern
    g.edges().forEach((e) => {
      const edge = g.edge(e);
      const points = edge.points.map((p: any) => [p.x, p.y] as [number,number]);
      inner
        .append('path')
        .attr('class', 'edgePath')
        .attr('d', d3.line().curve(d3.curveBasis)(points))
        .attr('stroke','#666')
        .attr('fill', 'none')
        .attr('marker-end', 'url(#arrowhead)');
    });

    // Knoten rendern
    const nodes = inner.selectAll('.node').data(g.nodes()).enter().append('g').attr('class', 'node');
    nodes
      .attr('transform', (v) => {
        const node = g.node(v);
        return `translate(${node.x - node.width / 2},${node.y - node.height / 2})`;
      })
      .append('rect')
      .attr('width', (v) => g.node(v).width)
      .attr('height', (v) => g.node(v).height)
      .attr('fill', '#fff')
      .attr('stroke', '#333');

    nodes
      .append('text')
      .attr('x', (v) => g.node(v).width / 2)
      .attr('y', (v) => g.node(v).height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .text((v) => g.node(v).label ?? '');

    nodes.on('click', (event, nodeId) => {
      console.log(g.node(nodeId).label)
    });

    // Zoom und Pan
    svg.call(
      d3.zoom().on('zoom', (event) => {
        inner.attr('transform', event.transform);
      }) as any
    );

    // Pfeilspitzen-Definition
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#333');

  }
}
