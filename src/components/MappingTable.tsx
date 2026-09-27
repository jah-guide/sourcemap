import {
  buildMappingExportRows,
  downloadTextFile,
  mappingsToCsv,
  mappingsToJson,
} from '../lib/export'
import { buildIndexes, fieldLabel } from '../lib/catalog'
import type { MappingProtocolFilter } from '../hooks/useSourceMap'
import type { SourceMapCatalog } from '../types'

interface MappingTableProps {
  catalog: SourceMapCatalog
  filter: string
  criticalOnly: boolean
  protocol: MappingProtocolFilter
  onFilterChange: (value: string) => void
  onCriticalOnlyChange: (value: boolean) => void
  onProtocolChange: (value: MappingProtocolFilter) => void
  onSelectField: (fieldId: string) => void
  onOpenInterface: (interfaceId: string) => void
}

export function MappingTable({
  catalog,
  filter,
  criticalOnly,
  protocol,
  onFilterChange,
  onCriticalOnlyChange,
  onProtocolChange,
  onSelectField,
  onOpenInterface,
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
      if (criticalOnly && !mapping.critical) return false
      if (protocol !== 'all' && iface.protocol !== protocol) return false
      if (!q) return true
      const hay = [
        fieldLabel(source, systemById.get(source.systemId)),
        fieldLabel(target, systemById.get(target.systemId)),
        iface.name,
        mapping.transform,
        iface.protocol,
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })

  const criticalCount = rows.filter((r) => r.mapping.critical).length
  const exportRows = buildMappingExportRows(
    catalog,
    rows.map((r) => r.mapping),
  )

  const exportJson = () => {
    downloadTextFile(
      'sourcemap-mappings.json',
      mappingsToJson(exportRows),
      'application/json',
    )
  }

  const exportCsv = () => {
    downloadTextFile(
      'sourcemap-mappings.csv',
      mappingsToCsv(exportRows),
      'text/csv',
    )
  }

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
        <div className="mapping-toolbar-actions">
          <input
            type="search"
            className="search-input"
            placeholder="Filter by system, field, interface…"
            value={filter}
            onChange={(e) => onFilterChange(e.target.value)}
            aria-label="Filter mappings"
          />
          <div className="filter-chips" role="group" aria-label="Mapping filters">
            <label className="chip-toggle">
              <input
                type="checkbox"
                checked={criticalOnly}
                onChange={(e) => onCriticalOnlyChange(e.target.checked)}
              />
              Critical only
            </label>
            <label className="chip-select">
              <span className="visually-hidden">Protocol</span>
              <select
                value={protocol}
                onChange={(e) =>
                  onProtocolChange(e.target.value as MappingProtocolFilter)
                }
                aria-label="Filter by protocol"
              >
                <option value="all">All protocols</option>
                <option value="REST">REST</option>
                <option value="Kafka">Kafka</option>
                <option value="SFTP">SFTP</option>
                <option value="DB sync">DB sync</option>
              </select>
            </label>
          </div>
          <div className="export-actions">
            <button type="button" className="ghost-btn" onClick={exportJson}>
              Export JSON
            </button>
            <button type="button" className="ghost-btn" onClick={exportCsv}>
              Export CSV
            </button>
          </div>
        </div>
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
                  <button
                    type="button"
                    className="linkish iface-link"
                    onClick={() => onOpenInterface(iface.id)}
                  >
                    {iface.name}
                  </button>
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
          No mappings match the current filters — try clearing protocol or critical
          filters.
        </p>
      )}
    </section>
  )
}
