import type { ReactNode } from 'react'
import { FieldSpotlight } from './FieldSpotlight'
import { buildIndexes, fieldLabel } from '../lib/catalog'
import type { FieldId, SourceMapCatalog, ViewId } from '../types'

const NAV: { id: ViewId; step: string; label: string; hint: string }[] = [
  { id: 'systems', step: '01', label: 'Systems catalog', hint: 'Inventory & fields' },
  { id: 'mappings', step: '02', label: 'Field mappings', hint: 'Source → target lineage' },
  { id: 'impact', step: '03', label: 'Impact analysis', hint: 'Change blast radius' },
]

interface LayoutProps {
  view: ViewId
  onViewChange: (view: ViewId) => void
  stats: {
    systems: number
    fields: number
    mappings: number
    interfaces: number
    pinned: number
  }
  pinnedFieldIds: FieldId[]
  recentFieldIds: FieldId[]
  catalog: SourceMapCatalog
  onSelectField: (fieldId: FieldId) => void
  children: ReactNode
}

export function Layout({
  view,
  onViewChange,
  stats,
  pinnedFieldIds,
  recentFieldIds,
  catalog,
  onSelectField,
  children,
}: LayoutProps) {
  const { systemById, fieldById } = buildIndexes(catalog)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to analyst views
      </a>
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden>
            SM
          </span>
          <div className="brand-text">
            <h1>SourceMap</h1>
            <p className="tagline">
              Enterprise integration catalog — systems, field mappings, and change impact.
            </p>
            <span className="header-badge">Local seed · read-only demo</span>
          </div>
        </div>
        <dl className="header-stats">
          <div className="stat-chip">
            <dt>Systems</dt>
            <dd>{stats.systems}</dd>
          </div>
          <div className="stat-chip">
            <dt>Fields</dt>
            <dd>{stats.fields}</dd>
          </div>
          <div className="stat-chip">
            <dt>Mappings</dt>
            <dd>{stats.mappings}</dd>
          </div>
          <div className="stat-chip">
            <dt>Interfaces</dt>
            <dd>{stats.interfaces}</dd>
          </div>
          {stats.pinned > 0 && (
            <div className="stat-chip stat-chip-accent">
              <dt>Pinned</dt>
              <dd>{stats.pinned}</dd>
            </div>
          )}
        </dl>
      </header>

      <FieldSpotlight catalog={catalog} onSelectField={onSelectField} />

      {recentFieldIds.length > 0 && (
        <section className="pinned-strip recent-strip" aria-label="Recent fields">
          <span className="pinned-label">Recent</span>
          <ul className="pinned-list">
            {recentFieldIds.map((fieldId) => {
              const field = fieldById.get(fieldId)
              if (!field) return null
              return (
                <li key={fieldId}>
                  <button
                    type="button"
                    className="pinned-chip recent-chip"
                    onClick={() => onSelectField(fieldId)}
                  >
                    {fieldLabel(field, systemById.get(field.systemId))}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {pinnedFieldIds.length > 0 && (
        <section className="pinned-strip" aria-label="Pinned fields">
          <span className="pinned-label">Pinned</span>
          <ul className="pinned-list">
            {pinnedFieldIds.map((fieldId) => {
              const field = fieldById.get(fieldId)
              if (!field) return null
              return (
                <li key={fieldId}>
                  <button
                    type="button"
                    className="pinned-chip"
                    onClick={() => onSelectField(fieldId)}
                  >
                    {fieldLabel(field, systemById.get(field.systemId))}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <nav className="app-nav" aria-label="Primary">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? 'nav-btn active' : 'nav-btn'}
            onClick={() => onViewChange(item.id)}
            aria-current={view === item.id ? 'page' : undefined}
          >
            <span className="nav-step">{item.step}</span>
            <span className="nav-label">{item.label}</span>
            <span className="nav-hint">{item.hint}</span>
          </button>
        ))}
      </nav>

      <main id="main-content" className="app-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="app-footer">
        Portfolio demo — typed seed data only. No live integrations or PII.
      </footer>
    </div>
  )
}
