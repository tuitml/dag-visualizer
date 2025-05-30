# Cycle Detection in Data Dependency Graphs

## Introduction

This Angular application enables the visualization and detection of cycles in dependency graphs. The mathematical foundation is based on a directed graph G = (V,E), where V represents a set of fields and E ⊆ V×V represents a set of directed edges that indicate dependencies between these fields. A cycle C in G is defined as a sequence of fields {v₁, v₂, ..., vₙ} ⊆ V, where: ∀i∈{1,2,...,n-1}: (vᵢ, vᵢ₊₁)∈E ∧ (vₙ, v₁)∈E.

## Features

The application offers the following functions:
- Visualization of data dependency graphs using D3.js and dagre
- Detection of cycles in dependency relationships
- Display of dependent fields for a selected field
- Interactive graph visualization with zoom and pan functionality

## Technologies

- Angular 19.2.0
- D3.js 7.9.0 for visualization
- dagre 0.8.5 for graph layout
- TypeScript 5.7.2

## Components

- **DAG-Visualizer**: Visualizes the directed acyclic graph
- **Cycle-Detector**: Identifies cycles between fields and their dependencies

## Data Model

The application works with the following main data types:
- **Field**: Represents a data field with ID, name, and associated data manipulation logic rules
- **Rule**: Defines a rule with ID and the fields it depends on
