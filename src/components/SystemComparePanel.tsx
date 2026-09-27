import { compareSystems } from '../lib/compare'
import type { SourceMapCatalog } from '../types'

interface SystemComparePanelProps {
  catalog: SourceMapCatalog
  systemAId: string | null
  systemBId: string | null
  onSystemAChange: (id: string | null) => void
  onSystemBChange: (id: string | null) => void
}

export function SystemComparePanel({
  catalog,
  systemAId,
  systemBId,
  onSystemAChange,
  onSystemBChange,
}: SystemComparePanelProps) {
  const comparison =
    systemAId && systemBId && systemAId !== systemBId
      ? compareSystems(catalog, systemAId, systemBId)
      : null

  const systemA = catalog.systems.find((s) => s.id === systemAId)
  const systemB = catalog.systems.find((s) => s.id === systemBId)

  return (
    <section className="panel compare-panel">
      <div className="panel-heading-row">
        <h2>Compare two systems</h2>
        <span className="count-pill">Integration overlap</span>
      </div>
      <p className="panel-intro">
        Pick two systems to see shared interfaces, cross-system mappings, and
        fields not yet linked across the boundary.
      </p>
      <div className="compare-pickers">
        <label>
          <span>System A</span>
          <select
            value={systemAId ?? ''}
            onChange={(e) => onSystemAChange(e.target.value || null)}
          >
            <option value="">— Select —</option>
            {catalog.systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.acronym} — {s.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>System B</span>
          <select
            value={systemBId ?? ''}
            onChange={(e) => onSystemBChange(e.target.value || null)}
          >
            <option value="">— Select —</option>
            {catalog.systems.map((s) => (
              <option key={s.id} value={s.id}>
                {s.acronym} — {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!systemAId || !systemBId ? (
        <p className="empty-inline">Select two systems to compare.</p>
      ) : systemAId === systemBId ? (
        <p className="empty-inline">Choose two different systems.</p>
      ) : comparison && systemA && systemB ? (
        <div className="compare-results">
          <ul className="impact-metrics impact-metrics-cards">
            <li>
              <span className="metric-label">{systemA.acronym} fields</span>
              <strong>{comparison.fieldsA}</strong>
            </li>
            <li>
              <span className="metric-label">{systemB.acronym} fields</span>
              <strong>{comparison.fieldsB}</strong>
            </li>
            <li>
              <span className="metric-label">Cross mappings</span>
              <strong>{comparison.mappingsBetween}</strong>
            </li>
            <li className="metric-wide">
              <span className="metric-label">Shared interfaces</span>
              <strong>{comparison.sharedInterfaces.length}</strong>
            </li>
          </ul>
          {comparison.sharedInterfaces.length > 0 && (
            <>
              <h3 className="subhead">Shared interfaces</h3>
              <ul className="contract-list compact">
                {comparison.sharedInterfaces.map((iface) => (
                  <li key={iface.id}>
                    <strong>{iface.name}</strong>
                    <span className="meta">
                      {iface.protocol} · SLA {iface.slaMinutes}m
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          <div className="compare-unlinked">
            <div>
              <h3 className="subhead">Unlinked on {systemA.acronym}</h3>
              <p className="meta">
                Fields with no mapping crossing into {systemB.acronym}.
              </p>
              <UnlinkedList names={comparison.onlyAFieldNames} />
            </div>
            <div>
              <h3 className="subhead">Unlinked on {systemB.acronym}</h3>
              <p className="meta">
                Fields with no mapping crossing into {systemA.acronym}.
              </p>
              <UnlinkedList names={comparison.onlyBFieldNames} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function UnlinkedList({ names }: { names: string[] }) {
  if (names.length === 0) {
    return <p className="empty-inline">All inventoried fields are linked.</p>
  }
  return (
    <ul className="tag-list">
      {names.map((name) => (
        <li key={name}>
          <code>{name}</code>
        </li>
      ))}
    </ul>
  )
}
