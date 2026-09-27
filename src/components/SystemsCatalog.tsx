import { buildIndexes, fieldsForSystem } from '../lib/catalog'
import type { SourceMapCatalog } from '../types'

interface SystemsCatalogProps {
  catalog: SourceMapCatalog
  selectedSystemId: string | null
  selectedFieldId: string | null
  onSelectSystem: (id: string | null) => void
  onSelectField: (id: string) => void
}

export function SystemsCatalog({
  catalog,
  selectedSystemId,
  selectedFieldId,
  onSelectSystem,
  onSelectField,
}: SystemsCatalogProps) {
  const { systemById } = buildIndexes(catalog)
  const selectedSystem = selectedSystemId
    ? systemById.get(selectedSystemId)
    : undefined
  const fieldRows = selectedSystemId
    ? fieldsForSystem(catalog, selectedSystemId)
    : []

  return (
    <div className="split-panel catalog-layout">
      <section className="panel catalog-sidebar">
        <div className="panel-heading-row">
          <h2>Registered systems</h2>
          <span className="count-pill">{catalog.systems.length}</span>
        </div>
        <p className="panel-intro catalog-hint">
          Select a system to inspect fields — row click opens impact analysis.
        </p>
        <ul className="system-list">
          {catalog.systems.map((system) => {
            const fieldCount = fieldsForSystem(catalog, system.id).length
            return (
              <li key={system.id}>
                <button
                  type="button"
                  className={
                    selectedSystemId === system.id ? 'card-btn selected' : 'card-btn'
                  }
                  onClick={() =>
                    onSelectSystem(selectedSystemId === system.id ? null : system.id)
                  }
                >
                  <div className="card-row">
                    <strong className="system-acronym">{system.acronym}</strong>
                    <span className={`badge status-${system.status}`}>
                      {system.status}
                    </span>
                  </div>
                  <span className="muted">{system.name}</span>
                  <span className="meta">
                    {system.owner} · {system.domain} · {fieldCount} fields
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="panel panel-grow catalog-detail">
        {selectedSystem ? (
          <>
            <div className="panel-heading-row">
              <h2>
                <span className="domain-chip">{selectedSystem.domain}</span>
                {selectedSystem.acronym} — field inventory
              </h2>
              <span className="count-pill">{fieldRows.length} fields</span>
            </div>
            <p className="panel-intro">{selectedSystem.description}</p>
            <div className="table-wrap catalog-table">
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                    <th>PII</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldRows.map((field) => (
                    <tr
                      key={field.id}
                      className={selectedFieldId === field.id ? 'row-selected' : ''}
                      onClick={() => onSelectField(field.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onSelectField(field.id)
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      title="Open impact analysis for this field"
                    >
                      <td>
                        <code className="field-name">{field.name}</code>
                      </td>
                      <td>
                        <span className="type-tag">{field.dataType}</span>
                      </td>
                      <td>
                        {field.pii ? (
                          <span className="pii-flag">PII</span>
                        ) : (
                          <span className="meta-inline">—</span>
                        )}
                      </td>
                      <td>{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="empty-state catalog-empty">
            <p className="empty-kicker">Step 1</p>
            <h2>Choose a system from the catalog</h2>
            <p>
              HRIS is a good starting point — try <code>employment_status</code> for a
              full impact walkthrough.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
