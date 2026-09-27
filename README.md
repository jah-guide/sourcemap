# SourceMap

**Systems Analyst portfolio** — inventory, field-level integration mappings, interface contracts, and change impact analysis (*what breaks if field X changes?*).

## Problem

Integration knowledge lives in spreadsheets and wiki pages. When the system of record changes a field, payroll, provisioning, and reporting break before anyone has a complete dependency map.

## Who benefits

| Stakeholder | Outcome |
|-------------|---------|
| Systems Analyst | One catalog to scope change requests and regression testing |
| Integration Engineering | Transforms and interface SLAs visible per mapping |
| System Owners | Field inventory with critical paths highlighted |

## Analysis pack (`docs/`)

| Doc | Focus |
|-----|--------|
| [01-context](docs/01-context.md) | Problem, scope, assumptions |
| [02-stakeholders-raci](docs/02-stakeholders-raci.md) | RACI |
| [03-requirements](docs/03-requirements.md) | Functional / non-functional requirements |
| [04-use-cases-stories](docs/04-use-cases-stories.md) | Use cases + demo journey |
| [05-process-as-is-to-be](docs/05-process-as-is-to-be.md) | As-is vs catalog-driven to-be |
| [06-data-model](docs/06-data-model.md) | ERD + entity cheat sheet |
| [07-sequence-flows](docs/07-sequence-flows.md) | UI read paths (seed, no API) |
| [08-traceability-matrix](docs/08-traceability-matrix.md) | Req → code → tests |
| [09-acceptance-tests](docs/09-acceptance-tests.md) | Manual demo checklist |

## Working demo

Vite + React + TypeScript — **local seed only** (`src/data/seed.ts`), no backend.

| View | What to try |
|------|-------------|
| **Systems catalog** | HRIS → `employment_status` (opens impact) |
| **Field mappings** | Filter `payroll` or `kafka` |
| **Impact analysis** | Blast radius + interface SLAs for selected field |

### Quick start

```bash
npm install
npm run dev
```

Open the URL from the terminal (default `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## Stack

- Vite 8, React 19, TypeScript 6
- Typed in-memory catalog from seed data
- Oxlint

---

*Part of the [jah-guide](https://github.com/jah-guide) Systems Analyst portfolio — specs first, working demo second.*
