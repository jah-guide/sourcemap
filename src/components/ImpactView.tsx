import {
  buildIndexes,
  computeImpact,
  fieldLabel,
  interfacesForField,
  mappingsForField,
} from '../lib/catalog'
import type { SourceMapCatalog } from '../types'

interface ImpactViewProps {
  catalog: SourceMapCatalog
  selectedFieldId: string | null
  onSelectField: (id: string) => void
}

export function ImpactView({
  catalog,
  selectedFieldId,
  onSelectField,
}: ImpactViewProps) {
  const { systemById, fieldById } = buildIndexes(catalog)

  const fieldOptions = catalog.fields
    .map((f) => ({
      id: f.id,
      label: fieldLabel(f, systemById.get(f.systemId)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const selected = selectedFieldId ? fieldById.get(selectedFieldId) : undefined
  const impact = selectedFieldId ? computeImpact(catalog, selectedFieldId) : []
  const directMappings = selectedFieldId
    ? mappingsForField(catalog, selectedFieldId)
    : []
  const contracts = selectedFieldId
    ? interfacesForField(catalog, selectedFieldId)
    : []

  const downstreamCount = impact.filter((n) => n.role === 'downstream').length
  const upstreamCount = impact.filter((n) => n.role === 'upstream').length
  const criticalMappings = directMappings.filter((m) => m.critical).length

  return (
    <div className="split-panel impact-layout">
      <section className="panel">
        <h2>What breaks if this field changes?</h2>
        <label className="field-picker">
          <span>Select field</span>
          <select
            value={selectedFieldId ?? ''}
            onChange={(e) => onSelectField(e.target.value)}
          >
            <option value="">— Choose a field —</option>
            {fieldOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        {selected && (
          <div className="impact-summary">
            <p>
              Analyzing <code>{selected.name}</code> on{' '}
              <strong>{systemById.get(selected.systemId)?.acronym}</strong>
            </p>
            <ul className="impact-metrics">
              <li>
                <strong>{directMappings.length}</strong> direct mapping
                {directMappings.length === 1 ? '' : 's'}
              </li>
              <li>
                <strong>{criticalMappings}</strong> critical
              </li>
              <li>
                <strong>{downstreamCount}</strong> downstream field
                {downstreamCount === 1 ? '' : 's'}
              </li>
              <li>
                <strong>{upstreamCount}</strong> upstream source
                {upstreamCount === 1 ? '' : 's'}
              </li>
              <li>
                <strong>{contracts.length}</strong> interface
                {contracts.length === 1 ? '' : 's'}
              </li>
            </ul>
          </div>
        )}
      </section>

      <section className="panel panel-grow">
        {!selected ? (
          <div className="empty-state">
            <h2>Impact analysis</h2>
            <p>
              Pick a field to see integration contracts, mappings, and downstream
              targets affected by a schema or semantics change.
            </p>
          </div>
        ) : (
          <>
            <h2>Blast radius</h2>
            <div className="impact-graph">
              {impact.map((node) => (
                <article
                  key={`${node.role}-${node.field.id}`}
                  className={`impact-node role-${node.role}`}
                >
                  <span className="role-tag">{node.role}</span>
                  <strong>
                    {fieldLabel(node.field, node.system)}
                  </strong>
                  <span className="meta">{node.field.description}</span>
                  {node.interface && (
                    <span className="meta">
                      via {node.interface.name} (SLA {node.interface.slaMinutes}m)
                    </span>
                  )}
                  {node.mapping && (
                    <code className="transform">{node.mapping.transform}</code>
                  )}
                </article>
              ))}
            </div>

            <h3 className="subhead">Interface contracts</h3>
            <ul className="contract-list">
              {contracts.map((c) => (
                <li key={c.id}>
                  <strong>{c.name}</strong>
                  <span className="meta">
                    {systemById.get(c.sourceSystemId)?.acronym} →{' '}
                    {systemById.get(c.targetSystemId)?.acronym} · {c.protocol} · SLA{' '}
                    {c.slaMinutes}m
                  </span>
                  <p>{c.notes}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  )
}
