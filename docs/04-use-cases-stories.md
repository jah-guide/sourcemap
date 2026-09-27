# Use Cases & User Stories — SourceMap

## Purpose

Three core flows the demo supports — written for a quick walkthrough, not a full BRD.

## Actors

| Actor | Role |
|-------|------|
| **Systems Analyst** | Owns catalog accuracy; runs impact for change requests |
| **Integration Engineer** | Validates transforms and interface timing |
| **System Owner** | Confirms inventory matches production |

## UC-01 — Browse systems catalog

1. Open **Systems catalog**.
2. Scan acronym, status, owner, domain.
3. Select **HRIS** → field table (`employee_id`, `work_email`, `employment_status`, …).

**Outcome:** Authoritative field names for CRs and test plans.

## UC-02 — Review field mappings

1. Open **Field mappings**.
2. Scan source → target rows with interface and transform.
3. Filter `employment_status` → see HRIS→Payroll, LMS, DWH paths.

**Outcome:** Lineage visible without opening integration code.

## UC-03 — Impact analysis

1. Open **Impact analysis** (or click a field from catalog/mappings).
2. Choose `HRIS.employment_status`.
3. Read counts, blast radius, and interface SLAs.

**Alternate:** Unmapped fields show origin only and an empty contract list.

## User stories (acceptance snapshot)

| ID | Story | Pass when |
|----|-------|-----------|
| US-01 | Systems list for landscape scope | ≥3 systems with owner + status on **Systems** |
| US-02 | Field detail per system | HRIS shows `employee_id` (UUID) and PII on email |
| US-03 | Transforms visible | Mapping table shows status enumeration logic |
| US-04 | Impact for regression scope | `work_email` shows LMS + CRM downstream |
| US-05 | Critical paths obvious | `employment_status` → Payroll marked critical |

## Demo journey

```mermaid
journey
  title 5-minute analyst walkthrough
  section Orient
    Open app: 5: Analyst
    Pick HRIS: 4: Analyst
  section Trace
    Scan mappings: 5: Analyst
    Filter a field: 4: Analyst
  section Decide
    Run impact: 5: Analyst
    Read SLAs: 4: Analyst
```
