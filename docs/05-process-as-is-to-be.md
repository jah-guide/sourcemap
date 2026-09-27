# Process — As-Is to To-Be — SourceMap

## Purpose

Contrast today’s ad-hoc integration documentation with a catalog-driven change impact process.

## As-is process (pain)

```mermaid
flowchart TD
  CR[Change request: rename field] --> TICKET[Ticket to integration team]
  TICKET --> SPREAD[Search spreadsheets / wiki]
  SPREAD --> GUESS[Best-guess affected systems]
  GUESS --> FIX[Emergency fixes in prod]
  FIX --> INC[Incident or payroll defect]
```

**Problems:** Late discovery, duplicate mappings undocumented, no single field glossary.

## To-be process (target)

```mermaid
flowchart TD
  CR[Change request] --> SM[SourceMap: locate field]
  SM --> IMP[Run impact analysis]
  IMP --> CAB{Critical mappings?}
  CAB -->|Yes| REVIEW[Change advisory + owner sign-off]
  CAB -->|No| PLAN[Test plan from blast radius]
  REVIEW --> PLAN
  PLAN --> BUILD[Update interfaces / transforms]
  BUILD --> VERIFY[Verify against mapping table]
  VERIFY --> CLOSE[Close CR with traceability]
```

## Swimlane (to-be)

```mermaid
sequenceDiagram
  participant Owner as System Owner
  participant SA as Systems Analyst
  participant SM as SourceMap
  participant INT as Integration Eng

  Owner->>SA: Proposed schema change
  SA->>SM: Select field + impact view
  SM-->>SA: Blast radius + contracts
  SA->>Owner: Review affected systems
  SA->>INT: Work order with mapping IDs
  INT->>SM: Confirm mapping updates (future state)
  INT-->>SA: Deployment complete
  SA->>Owner: Close change with evidence
```

## Demo scope note

The prototype implements **catalog + impact read paths** only. Workflow tickets, CAB automation, and write-back to a governance database are future phases documented here for process completeness.
