import {
  buildIndexes,
  fieldsForSystem,
  filterFieldsByQuery,
  filterSystemsByQuery,
  filterSystemsByStatus,
  unmappedFieldCount,
  type SystemStatusFilter,
} from '../lib/catalog'
import type { FieldId, SourceMapCatalog } from '../types'

interface SystemsCatalogProps {
  catalog: SourceMapCatalog
  selectedSystemId: string | null
  selectedFieldId: string | null
  systemSearch: string
  systemStatusFilter: SystemStatusFilter
  fieldSearch: string
  pinnedFieldIds: FieldId[]
  onSystemSearchChange: (value: string) => void
  onSystemStatusFilterChange: (value: SystemStatusFilter) => void
  onFieldSearchChange: (value: string) => void
  onSelectSystem: (id: string | null) => void
  onSelectField: (id: string) => void
  onTogglePin: (fieldId: FieldId) => void
}

export function SystemsCatalog({
  catalog,
  selectedSystemId,
  selectedFieldId,
  systemSearch,
  systemStatusFilter,
  fieldSearch,
  pinnedFieldIds,
  onSystemSearchChange,
  onSystemStatusFilterChange,
  onFieldSearchChange,
  onSelectSystem,
  onSelectField,
  onTogglePin,
}: SystemsCatalogProps) {
  const { systemById } = buildIndexes(catalog)
  const visibleSystems = filterSystemsByStatus(
    filterSystemsByQuery(catalog, systemSearch),
    systemStatusFilter,
  )
  const selectedSystem = selectedSystemId
    ? systemById.get(selectedSystemId)
    : undefined
  const fieldRows = selectedSystemId
    ? filterFieldsByQuery(fieldsForSystem(catalog, selectedSystemId), fieldSearch)
    : []

  return (
    <div className="split-panel catalog-layout" data-view="catalog">
      <section className="panel catalog-sidebar">
        <div className="panel-heading-row">
          <h2>Registered systems</h2>
          <span className="count-pill">{visibleSystems.length}</span>
        </div>
        <p className="panel-intro catalog-hint">
          Filter by acronym, owner, or domain — row click opens impact analysis.
        </p>
        <input
          type="search"
          className="search-input search-input-block"
          placeholder="Search systems…"
          value={systemSearch}
          onChange={(e) => onSystemSearchChange(e.target.value)}
          aria-label="Search systems"
        />
        <div className="status-filters" role="group" aria-label="Filter by status">
          {(['all', 'production', 'staging', 'deprecated'] as const).map(
            (status) => (
              <button
                key={status}
                type="button"
                className={
                  systemStatusFilter === status
                    ? 'status-filter active'
                    : 'status-filter'
                }
                onClick={() => onSystemStatusFilterChange(status)}
              >
                {status === 'all' ? 'All statuses' : status}
              </button>
            ),
          )}
        </div>
        <ul className="system-list">
          {visibleSystems.map((system) => {
            const fieldCount = fieldsForSystem(catalog, system.id).length
            const unmapped = unmappedFieldCount(catalog, system.id)
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
                    {unmapped > 0 && (
                      <span className="unmapped-hint"> · {unmapped} unmapped</span>
                    )}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        {visibleSystems.length === 0 && (
          <p className="empty-inline">No systems match &ldquo;{systemSearch.trim()}&rdquo;.</p>
        )}
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
            <input
              type="search"
              className="search-input search-input-block"
              placeholder="Filter fields by name, type, description…"
              value={fieldSearch}
              onChange={(e) => onFieldSearchChange(e.target.value)}
              aria-label="Search fields"
            />
            <div className="table-wrap catalog-table">
              <table>
                <thead>
                  <tr>
                    <th aria-label="Pin field"></th>
                    <th>Field</th>
                    <th>Type</th>
                    <th>PII</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldRows.map((field) => {
                    const pinned = pinnedFieldIds.includes(field.id)
                    return (
                      <tr
                        key={field.id}
                        className={selectedFieldId === field.id ? 'row-selected' : ''}
                      >
                        <td>
                          <button
                            type="button"
                            className={pinned ? 'pin-btn pinned' : 'pin-btn'}
                            aria-pressed={pinned}
                            aria-label={
                              pinned ? `Unpin ${field.name}` : `Pin ${field.name}`
                            }
                            onClick={(e) => {
                              e.stopPropagation()
                              onTogglePin(field.id)
                            }}
                          >
                            {pinned ? '★' : '☆'}
                          </button>
                        </td>
                        <td
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
                    )
                  })}
                </tbody>
              </table>
            </div>
            {fieldRows.length === 0 && (
              <p className="empty-inline">
                No fields match &ldquo;{fieldSearch.trim()}&rdquo; for{' '}
                {selectedSystem.acronym}.
              </p>
            )}
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
