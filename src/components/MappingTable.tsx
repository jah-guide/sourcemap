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

  return (
    <section className="panel panel-full">
      <div className="panel-toolbar">
        <h2>Field-level mappings</h2>
        <input
          type="search"
          className="search-input"
          placeholder="Filter by system, field, interface…"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          aria-label="Filter mappings"
        />
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Source</th>
              <th></th>
              <th>Target</th>
              <th>Interface</th>
              <th>Transform</th>
              <th>Critical</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ mapping, source, target, iface }) => (
              <tr key={mapping.id}>
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
                <td>{mapping.critical ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="empty-inline">No mappings match your filter.</p>
      )}
    </section>
  )
}
