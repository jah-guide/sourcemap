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

  return (
    <div className="split-panel">
      <section className="panel">
        <h2>Systems</h2>
        <ul className="system-list">
          {catalog.systems.map((system) => (
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
                  <strong>{system.acronym}</strong>
                  <span className={`badge status-${system.status}`}>
                    {system.status}
                  </span>
                </div>
                <span className="muted">{system.name}</span>
                <span className="meta">
                  {system.owner} · {system.domain}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="panel panel-grow">
        {selectedSystemId ? (
          <>
            <h2>{systemById.get(selectedSystemId)?.acronym} — fields</h2>
            <p className="panel-intro">
              {systemById.get(selectedSystemId)?.description}
            </p>
            <div className="table-wrap">
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
                  {fieldsForSystem(catalog, selectedSystemId).map((field) => (
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
                    >
                      <td>
                        <code>{field.name}</code>
                      </td>
                      <td>{field.dataType}</td>
                      <td>{field.pii ? 'Yes' : '—'}</td>
                      <td>{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>Select a system</h2>
            <p>View field inventory and open impact analysis from any row.</p>
          </div>
        )}
      </section>
    </div>
  )
}
