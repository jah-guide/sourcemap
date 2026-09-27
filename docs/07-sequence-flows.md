# Sequence Flows — SourceMap

## Purpose

Key runtime interactions in the **read-only demo UI** (local seed, no API).

## SF-01 — Application bootstrap

```mermaid
sequenceDiagram
  participant Browser
  participant Vite as Vite dev server
  participant App as React App
  participant Seed as seed.ts

  Browser->>Vite: GET /
  Vite-->>Browser: bundle + index.html
  Browser->>App: mount root
  App->>Seed: load SourceMapCatalog
  Seed-->>App: systems, fields, interfaces, mappings
  App-->>Browser: Systems catalog view
```

## SF-02 — Select system and field

```mermaid
sequenceDiagram
  participant User
  participant UI as SystemsCatalog
  participant Cat as catalog state

  User->>UI: Click HRIS
  UI->>Cat: setSelectedSystemId(sys-hris)
  Cat-->>UI: fields for HRIS
  User->>UI: Click employment_status row
  UI->>Cat: setSelectedFieldId + navigate impact
  Cat-->>User: Impact view opens
```

## SF-03 — Compute impact analysis

```mermaid
sequenceDiagram
  participant User
  participant Impact as ImpactView
  participant Lib as catalog.ts
  participant Data as seed catalog

  User->>Impact: Select HRIS.employment_status
  Impact->>Lib: computeImpact(catalog, fieldId)
  Lib->>Data: traverse mappings downstream/upstream
  Data-->>Lib: graph nodes + interfaces
  Lib-->>Impact: ImpactNode[], contracts
  Impact-->>User: metrics + blast radius + SLAs
```

## SF-04 — Filter mappings

```mermaid
sequenceDiagram
  participant User
  participant Map as MappingTable
  participant Idx as buildIndexes

  User->>Map: type filter "payroll"
  Map->>Idx: resolve labels per row
  Idx-->>Map: matching rows
  Map-->>User: filtered table
```

## Future-state sequence (out of demo scope)

Write-back of mapping edits would add validation, optimistic UI, and persistence (API or git-backed YAML). Documented for traceability to FR backlog.
