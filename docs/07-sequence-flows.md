# Sequence Flows — SourceMap

## Purpose

How the **read-only demo UI** loads seed data and responds to clicks (no API).

## SF-01 — App load

```mermaid
sequenceDiagram
  participant Browser
  participant App as React app
  participant Seed as seed.ts

  Browser->>App: Load bundle
  App->>Seed: Read catalog
  Seed-->>App: systems, fields, mappings
  App-->>Browser: Systems view
```

## SF-02 — Pick system → field → impact

```mermaid
sequenceDiagram
  participant User
  participant UI as SystemsCatalog
  participant State as app state

  User->>UI: Click HRIS
  UI->>State: selectedSystemId
  User->>UI: Click employment_status
  UI->>State: selectedFieldId + impact view
```

## SF-03 — Compute impact

```mermaid
sequenceDiagram
  participant User
  participant View as ImpactView
  participant Lib as catalog.ts

  User->>View: Select field
  View->>Lib: computeImpact(catalog, fieldId)
  Lib-->>View: nodes + contracts
  View-->>User: metrics + blast radius
```

## SF-04 — Filter mappings

```mermaid
sequenceDiagram
  participant User
  participant Table as MappingTable

  User->>Table: Type filter text
  Table-->>User: Matching rows only
```

## Out of scope (future)

Editing mappings would add validation, persistence (API or git-backed YAML), and optimistic UI — tracked in the requirements backlog.
