import type { ReactNode } from 'react'
import type { ViewId } from '../types'

const NAV: { id: ViewId; label: string; hint: string }[] = [
  { id: 'systems', label: 'Systems catalog', hint: 'Inventory & fields' },
  { id: 'mappings', label: 'Field mappings', hint: 'Source → target' },
  { id: 'impact', label: 'Impact analysis', hint: 'Change blast radius' },
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
          <div>
            <h1>SourceMap</h1>
            <p className="tagline">Systems inventory & integration lineage</p>
          </div>
        </div>
        <dl className="header-stats">
          <div>
            <dt>Systems</dt>
            <dd>{stats.systems}</dd>
          </div>
          <div>
            <dt>Fields</dt>
            <dd>{stats.fields}</dd>
          </div>
          <div>
            <dt>Mappings</dt>
            <dd>{stats.mappings}</dd>
          </div>
          <div>
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
          >
            <span className="nav-label">{item.label}</span>
            <span className="nav-hint">{item.hint}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        Demo catalog — local JSON seed only. Portfolio artifact for integration analysis.
      </footer>
    </div>
  )
}
