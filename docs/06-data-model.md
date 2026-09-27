# Data Model — SourceMap

## Purpose

Logical entities, relationships, and demo data dictionary for the catalog.

## Entity-relationship diagram

```mermaid
erDiagram
  SYSTEM ||--o{ FIELD : contains
  SYSTEM ||--o{ INTERFACE_CONTRACT : source
  SYSTEM ||--o{ INTERFACE_CONTRACT : target
  INTERFACE_CONTRACT ||--o{ FIELD_MAPPING : includes
  FIELD ||--o{ FIELD_MAPPING : source
  FIELD ||--o{ FIELD_MAPPING : target

  SYSTEM {
    string id PK
    string name
    string acronym
    string owner
    string domain
    string status
  }

  FIELD {
    string id PK
    string systemId FK
    string name
    string dataType
    boolean pii
  }

  INTERFACE_CONTRACT {
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

## Data dictionary (excerpt)

### System

| Attribute | Description |
|-----------|-------------|
| id | Stable key (e.g. `sys-hris`) |
| acronym | Short label shown in UI |
| status | production \| staging \| deprecated |

### Field

| Attribute | Description |
|-----------|-------------|
| name | Physical/logical column name in source system |
| dataType | UUID, string, enum, date, boolean |
| pii | Marks fields requiring privacy review |

### Interface contract

| Attribute | Description |
|-----------|-------------|
| protocol | REST, SFTP, Kafka, DB sync |
| frequency | Human-readable schedule |
| slaMinutes | Recovery target for stale feeds |

### Field mapping

| Attribute | Description |
|-----------|-------------|
| transform | Direct copy or expression (demo text) |
| critical | When true, highlighted on impact summary |

## Seed landscape summary

| System | Role in demo |
|--------|----------------|
| HRIS | System of record |
| Payroll | Compensation eligibility |
| LMS | Provisioning via email |
| CRM | Sales roster / territory |
| DWH | Analytics dimension |

## Key lineage (employment_status)

```mermaid
flowchart LR
  H[HRIS.employment_status]
  P[Payroll.pay_status]
  L[LMS.account_active]
  D[DWH.employment_status]

  H -->|REST critical| P
  H -->|Kafka critical| L
  H -->|DB sync critical| D
```
