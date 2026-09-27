# Process — As-Is to To-Be — SourceMap

## Purpose

Show why a field catalog beats hunting spreadsheets when a schema change lands.

## As-is (today)

```mermaid
flowchart LR
  CR[Change request] --> HUNT[Search wiki / sheets]
  HUNT --> GUESS[Guess affected systems]
  GUESS --> FIX[Hotfix in prod]
  FIX --> INC[Incident]
```

**Pain:** Late discovery, duplicate mappings, no shared field glossary.

## To-be (with SourceMap)

```mermaid
flowchart LR
  CR[Change request] --> SM[Find field in catalog]
  SM --> IMP[Impact analysis]
  IMP --> PLAN[Test plan + owners]
  PLAN --> SHIP[Update interfaces]
  SHIP --> DONE[Close with traceability]
```

**Gain:** Blast radius and contracts before code changes.

## Who does what (to-be)

```mermaid
sequenceDiagram
  participant Owner as System Owner
  participant SA as Analyst
  participant SM as SourceMap
  participant Eng as Integration

  Owner->>SA: Schema change idea
  SA->>SM: Select field → impact
  SM-->>SA: Mappings + SLAs
  SA->>Eng: Work order with mapping IDs
  Eng-->>SA: Deploy + verify
  SA->>Owner: Sign-off with evidence
```

## Demo scope

The app covers **read-only catalog + impact**. Tickets, CAB automation, and write-back to a governance DB are documented here as future phases.
