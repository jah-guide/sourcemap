import { buildIndexes, fieldLabel } from '../lib/catalog'
import type { SourceMapCatalog } from '../types'

interface MappingTableProps {
  catalog: SourceMapCatalog
  filter: string
  onFilterChange: (value: string) => void
  onSelectField: (fieldId: string) => void
}

export function MappingTable({
  catalog,
  filter,
  onFilterChange,
  onSelectField,
}: MappingTableProps) {
  const { systemById, fieldById } = buildIndexes(catalog)
  const q = filter.trim().toLowerCase()

  const rows = catalog.mappings
    .map((mapping) => {
      const source = fieldById.get(mapping.sourceFieldId)!
      const target = fieldById.get(mapping.targetFieldId)!
      const iface = catalog.interfaces.find((i) => i.id === mapping.interfaceId)!
      return { mapping, source, target, iface }
    })
    .filter(({ source, target, iface, mapping }) => {
      if (!q) return true
      const hay = [
        fieldLabel(source, systemById.get(source.systemId)),
        fieldLabel(target, systemById.get(target.systemId)),
        iface.name,
        mapping.transform,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })

  const criticalCount = rows.filter((r) => r.mapping.critical).length

  return (
    <section className="panel panel-full mapping-panel">
      <div className="panel-toolbar mapping-toolbar">
        <div>
          <h2>Field-level mappings</h2>
          <p className="toolbar-meta">
            {rows.length} of {catalog.mappings.length} rows
            {criticalCount > 0 && (
              <span className="toolbar-critical">
                · {criticalCount} critical in view
              </span>
            )}
          </p>
        </div>
        <input
          type="search"
          className="search-input"
          placeholder="Filter by system, field, interface…"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Filter mappings"
        />
      </div>
      <div className="table-wrap mapping-table">
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th aria-hidden></th>
              <th>Target</th>
              <th>Interface</th>
              <th>Transform</th>
              <th>Critical</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ mapping, source, target, iface }) => (
              <tr key={mapping.id} className={mapping.critical ? 'row-critical' : ''}>
                <td>
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => onSelectField(source.id)}
                  >
                    {fieldLabel(source, systemById.get(source.systemId))}
                  </button>
                </td>
                <td className="arrow" aria-hidden>
                  →
                </td>
                <td>
                  <button
                    type="button"
                    className="linkish"
                    onClick={() => onSelectField(target.id)}
                  >
                    {fieldLabel(target, systemById.get(target.systemId))}
                  </button>
                </td>
                <td>
                  <span className="iface-name">{iface.name}</span>
                  <span className="meta">
                    {iface.protocol} · {iface.frequency}
                  </span>
                </td>
                <td>
                  <code className="transform">{mapping.transform}</code>
                </td>
                <td>
                  {mapping.critical ? (
                    <span className="critical-badge">Critical</span>
                  ) : (
                    <span className="meta-inline">No</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="empty-inline">
          No mappings match &ldquo;{filter.trim()}&rdquo; — try payroll, kafka, or a field name.
        </p>
      )}
    </section>
  )
}
