# Acceptance Tests — SourceMap

## Purpose

Manual checklist to confirm the demo matches requirements before a portfolio review.

## Setup

- Node.js 20+
- `npm install` then `npm run dev`
- Latest Chrome or Edge

## Test cases

| ID | Do this | Expect | Req |
|----|---------|--------|-----|
| AT-01 | Open **Systems catalog** | ≥5 systems (HRIS, Payroll, LMS, CRM, DWH) with status | FR-01 |
| AT-02 | Select HRIS | Fields include `employee_id`, `work_email`, `employment_status`; PII on email | FR-02 |
| AT-03 | Open **Field mappings** | ≥10 rows with source → target | FR-03 |
| AT-04 | Filter `payroll` | Payroll-related rows only | FR-04 |
| AT-05 | Any mapping row | Interface name, protocol, frequency visible | FR-05 |
| AT-06 | Impact → `HRIS.employment_status` | Downstream: Payroll, LMS, DWH | FR-06 |
| AT-07 | Same field | Contracts list HRIS→Payroll, LMS, DWH with SLA minutes | FR-07 |
| AT-08 | `employment_status` mappings | Critical on Payroll and LMS paths | FR-08 |
| AT-09 | Offline (optional) | App still loads from local seed | FR-09 |
| AT-10 | Each nav tab | All three views render | FR-10 |
| AT-11 | Fresh clone: install + dev | Vite dev server starts | NFR-01 |
| AT-12 | Keyboard: field row Enter | Navigates to impact | NFR-04 |
| AT-13 | Systems search `hris` | HRIS card only in sidebar | FR-11 |
| AT-14 | HRIS field search `email` | `work_email` row visible | FR-12 |
| AT-15 | Mappings: Critical only + Kafka | Rows match both filters | FR-13 |
| AT-16 | Export CSV with filter active | Downloaded file matches visible rows | FR-14 |
| AT-17 | Compare HRIS vs Payroll | Cross mapping count > 0 | FR-15 |
| AT-18 | Pin field, reload page | Pin persists in header strip | FR-16 |
| AT-19 | Mapping row → interface name | Drawer shows protocol and SLA | FR-17 |
| AT-20 | Impact `employment_status` | Critical path badge on Payroll hop | FR-18 |
| AT-21 | Spotlight `work_email` | Opens impact for HRIS.work_email | FR-19 |
| AT-22 | Visit two fields, reload | Recent strip shows last fields | FR-20 |
| AT-23 | Status **staging** only | Sidebar hides production systems | FR-21 |
| AT-24 | System card meta | Unmapped count when integration gaps exist | FR-22 |
| AT-25 | Copy impact report | Clipboard markdown includes blast radius | FR-23 |

## Recruiter demo script (~3 min)

```mermaid
flowchart LR
  A[dev server] --> B[HRIS fields]
  B --> C[employment_status → impact]
  C --> D[Mappings: filter payroll]
  D --> E[Done]
```

## Sign-off

| Role | Name | Date | Pass |
|------|------|------|------|
| Systems Analyst | Bohlokoa Machaha | | ☐ |
| Reviewer | | | ☐ |
