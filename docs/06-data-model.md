# Data Model — SourceMap

## Purpose

Logical entities for the demo catalog — enough to read the UI and seed file, not a physical DDL.

## Core model

```mermaid
erDiagram
  SYSTEM ||--o{ FIELD : has
  SYSTEM ||--o{ INTERFACE : participates
  INTERFACE ||--o{ FIELD_MAPPING : carries
  FIELD ||--o{ FIELD_MAPPING : source_or_target

  SYSTEM {
    string id PK
    string acronym
    string owner
    string status
  }
  FIELD {
    string id PK
    string systemId FK
    string name
    string dataType
    boolean pii
  }
  INTERFACE {
    string id PK
    string sourceSystemId FK
    string targetSystemId FK
    string protocol
    int slaMinutes
  }
  FIELD_MAPPING {
    string id PK
    string interfaceId FK
    string sourceFieldId FK
    string targetFieldId FK
    string transform
    boolean critical
  }
```

## Field cheat sheet

| Entity | What it stores |
|--------|----------------|
| **System** | App or platform in the landscape (`sys-hris`, acronym, owner, status) |
| **Field** | Column/attribute on a system (type, PII flag, description) |
| **Interface** | Feed between two systems (protocol, schedule, SLA minutes) |
| **Field mapping** | One source field → one target field on an interface (+ transform, critical) |

## Seed systems (demo)

| Acronym | Role |
|---------|------|
| HRIS | System of record |
| Payroll | Pay eligibility |
| LMS | Provisioning via email |
| CRM | Sales roster |
| DWH | Analytics dimension |

## Example lineage — `employment_status`

```mermaid
flowchart LR
  H[HRIS.employment_status]
  P[Payroll.pay_status]
  L[LMS.account_active]
  D[DWH.employment_status]

  H -->|REST · critical| P
  H -->|Kafka · critical| L
  H -->|DB sync · critical| D
```
