# SourceMap

**Systems Analyst portfolio project** — systems inventory, field-level integration mappings, interface contracts, and change impact analysis (“what breaks if field X changes?”).

## Problem

Integration knowledge is scattered across spreadsheets and runbooks. When the system of record changes a field, downstream payroll, provisioning, and reporting systems break before anyone has a complete picture of affected mappings.

## Stakeholders & outcomes

| Stakeholder | Outcome |
|-------------|---------|
| Systems Analyst | Single catalog to scope change requests and regression testing |
| Integration Engineering | Visible transforms and interface SLAs per mapping |
| System Owners | Inventory of fields and critical dependencies |

## Analysis artifacts

| Document | Contents |
|----------|----------|
| [01-context](docs/01-context.md) | Problem, scope, assumptions |
| [02-stakeholders-raci](docs/02-stakeholders-raci.md) | Stakeholders and RACI |
| [03-requirements](docs/03-requirements.md) | Functional / non-functional requirements |
| [04-use-cases-stories](docs/04-use-cases-stories.md) | Use cases and user stories |
| [05-process-as-is-to-be](docs/05-process-as-is-to-be.md) | Process diagrams (Mermaid) |
| [06-data-model](docs/06-data-model.md) | ERD and data dictionary |
| [07-sequence-flows](docs/07-sequence-flows.md) | UI sequence flows |
| [08-traceability-matrix](docs/08-traceability-matrix.md) | Req → design → test mapping |
| [09-acceptance-tests](docs/09-acceptance-tests.md) | Demo acceptance checklist |

## Working demo

Interactive catalog prototype (Vite + React + TypeScript):

- **Systems catalog** — HRIS, Payroll, LMS, CRM, DWH with field inventory
- **Field mappings** — source.system.field → target.system.field with transforms
- **Impact analysis** — blast radius and interface contracts for a selected field

Data is **local seed only** (`src/data/seed.ts`); no backend or live integrations.

### Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (default `http://localhost:5173`).

### Build

```bash
npm run build
npm run preview
```

## Tech stack (prototype validation)

- Vite 8, React 19, TypeScript 6
- In-memory catalog state cloned from typed seed data
- Oxlint for linting

---

*Part of the [jah-guide](https://github.com/jah-guide) Systems Analyst portfolio — specs first, working demo second.*
