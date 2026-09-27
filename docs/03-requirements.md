# Requirements — SourceMap

## Purpose

Functional and non-functional requirements for the SourceMap catalog prototype.

## Functional requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | Display a list of registered systems with owner, domain, and status | Must |
| FR-02 | Show field inventory for a selected system (name, type, PII, description) | Must |
| FR-03 | Display all field-level mappings as source.system.field → target.system.field | Must |
| FR-04 | Filter mappings by system name, field name, interface, or transform text | Should |
| FR-05 | Link mappings to interface contract metadata (protocol, frequency, SLA) | Must |
| FR-06 | Select any field and compute impact: direct mappings, upstream/downstream fields | Must |
| FR-07 | Surface interface contracts associated with the selected field | Must |
| FR-08 | Flag mappings as critical for change-advisory emphasis | Should |
| FR-09 | Seed demo data locally (no backend) | Must |
| FR-10 | Navigate between catalog, mappings, and impact views | Must |

## Non-functional requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01 | Local startup | `npm run dev` on developer workstation |
| NFR-02 | Browser support | Latest Chrome / Edge / Firefox |
| NFR-03 | Performance | Impact analysis < 100ms on seed dataset |
| NFR-04 | Accessibility | Keyboard-selectable field rows; labeled controls |
| NFR-05 | Maintainability | Typed TypeScript models mirroring analysis data dictionary |
| NFR-06 | Security (demo) | No secrets, no real PII; fictional seed only |

## Constraints

- Vite + React + TypeScript stack (portfolio standard for lightweight UI).
- Analysis documents lead README; code validates the spec.

## Requirements dependency view

```mermaid
flowchart TD
  FR01[FR-01 Systems list] --> FR02[FR-02 Field inventory]
  FR01 --> FR03[FR-03 Mapping table]
  FR03 --> FR04[FR-04 Filter]
  FR03 --> FR05[FR-05 Interface metadata]
  FR02 --> FR06[FR-06 Impact analysis]
  FR03 --> FR06
  FR06 --> FR07[FR-07 Contracts on impact]
  FR09[FR-09 Seed data] --> FR01
  FR10[FR-10 Navigation] --> FR02
  FR10 --> FR03
  FR10 --> FR06
```
