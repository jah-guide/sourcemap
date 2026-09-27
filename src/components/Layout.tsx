import type { ReactNode } from 'react'
import type { ViewId } from '../types'

const NAV: { id: ViewId; step: string; label: string; hint: string }[] = [
  { id: 'systems', step: '01', label: 'Systems catalog', hint: 'Inventory & fields' },
  { id: 'mappings', step: '02', label: 'Field mappings', hint: 'Source → target lineage' },
  { id: 'impact', step: '03', label: 'Impact analysis', hint: 'Change blast radius' },
]

interface LayoutProps {
  view: ViewId
  onViewChange: (view: ViewId) => void
  stats: { systems: number; fields: number; mappings: number; interfaces: number }
  children: ReactNode
}

export function Layout({ view, onViewChange, stats, children }: LayoutProps) {
  return (
    <div className="app-shell">
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
        </dl>
      </header>

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

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        Portfolio demo — typed seed data only. No live integrations or PII.
      </footer>
    </div>
  )
}
