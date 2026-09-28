import { useState } from 'react'
import {
  buildIndexes,
  computeImpact,
  criticalPathFieldIds,
  fieldLabel,
  interfacesForField,
  mappingsForField,
} from '../lib/catalog'
import { buildImpactReportMarkdown, copyTextToClipboard } from '../lib/impactReport'
import type { SourceMapCatalog } from '../types'

interface ImpactViewProps {
  catalog: SourceMapCatalog
  selectedFieldId: string | null
  onSelectField: (id: string) => void
  onOpenInterface: (interfaceId: string) => void
}

export function ImpactView({
  catalog,
  selectedFieldId,
  onSelectField,
  onOpenInterface,
}: ImpactViewProps) {
  const [copyState, setCopyState] = useState<'idle' | 'ok' | 'fail'>('idle')
  const { systemById, fieldById } = buildIndexes(catalog)

  const fieldOptions = catalog.fields
    .map((f) => ({
      id: f.id,
      label: fieldLabel(f, systemById.get(f.systemId)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const selected = selectedFieldId ? fieldById.get(selectedFieldId) : undefined
  const impact = selectedFieldId ? computeImpact(catalog, selectedFieldId) : []
  const criticalPath = selectedFieldId
    ? criticalPathFieldIds(catalog, selectedFieldId)
    : new Set<string>()
  const directMappings = selectedFieldId
    ? mappingsForField(catalog, selectedFieldId)
    : []
  const contracts = selectedFieldId
    ? interfacesForField(catalog, selectedFieldId)
    : []

  const downstreamCount = impact.filter((n) => n.role === 'downstream').length
  const upstreamCount = impact.filter((n) => n.role === 'upstream').length
  const criticalMappings = directMappings.filter((m) => m.critical).length
  const onCriticalPathCount = impact.filter((n) =>
    criticalPath.has(n.field.id),
  ).length

  return (
    <div className="split-panel impact-layout" data-view="impact">
      <section className="panel impact-controls">
        <p className="impact-eyebrow">Change advisory</p>
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
            <p className="impact-context">
              Analyzing <code>{selected.name}</code> on{' '}
              <strong>{systemById.get(selected.systemId)?.acronym}</strong>
            </p>
            <ul className="impact-metrics impact-metrics-cards">
              <li>
                <span className="metric-label">Direct mappings</span>
                <strong>{directMappings.length}</strong>
              </li>
              <li>
                <span className="metric-label">Critical</span>
                <strong>{criticalMappings}</strong>
              </li>
              <li>
                <span className="metric-label">On critical path</span>
                <strong>{onCriticalPathCount}</strong>
              </li>
              <li>
                <span className="metric-label">Downstream</span>
                <strong>{downstreamCount}</strong>
              </li>
              <li>
                <span className="metric-label">Upstream</span>
                <strong>{upstreamCount}</strong>
              </li>
              <li className="metric-wide">
                <span className="metric-label">Interfaces touched</span>
                <strong>{contracts.length}</strong>
              </li>
            </ul>
            <button
              type="button"
              className="ghost-btn impact-copy-btn"
              onClick={async () => {
                if (!selectedFieldId) return
                const md = buildImpactReportMarkdown(catalog, selectedFieldId)
                const ok = await copyTextToClipboard(md)
                setCopyState(ok ? 'ok' : 'fail')
                window.setTimeout(() => setCopyState('idle'), 2200)
              }}
            >
              {copyState === 'ok'
                ? 'Copied report'
                : copyState === 'fail'
                  ? 'Copy failed'
                  : 'Copy impact report'}
            </button>
          </div>
        )}
      </section>

      <section className="panel panel-grow impact-results">
        {!selected ? (
          <div className="empty-state impact-empty">
            <p className="empty-kicker">Step 3</p>
            <h2>Run impact analysis on a field</h2>
            <p>
              Start with <code>HRIS.employment_status</code> to see payroll, LMS, and
              warehouse dependencies in one view.
            </p>
          </div>
        ) : (
          <>
            <div className="panel-heading-row">
              <h2>Blast radius</h2>
              <span className="count-pill">{impact.length} nodes</span>
            </div>
            <p className="impact-legend">
              <span className="legend-swatch legend-critical-path" />
              Critical downstream path (lime outline)
            </p>
            <div className="impact-graph">
              {impact.map((node, index) => {
                const onPath = criticalPath.has(node.field.id)
                const mappingCritical = node.mapping?.critical ?? false
                return (
                  <article
                    key={`${node.role}-${node.field.id}`}
                    className={[
                      'impact-node',
                      `role-${node.role}`,
                      onPath ? 'on-critical-path' : '',
                      mappingCritical ? 'edge-critical' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <span className="role-tag">{node.role}</span>
                    {onPath && node.role !== 'origin' && (
                      <span className="path-badge">Critical path</span>
                    )}
                    <strong>{fieldLabel(node.field, node.system)}</strong>
                    <span className="meta">{node.field.description}</span>
                    {node.interface && (
                      <button
                        type="button"
                        className="linkish meta iface-link"
                        onClick={() => onOpenInterface(node.interface!.id)}
                      >
                        via {node.interface.name} (SLA {node.interface.slaMinutes}m)
                      </button>
                    )}
                    {node.mapping && (
                      <code className="transform">{node.mapping.transform}</code>
                    )}
                  </article>
                )
              })}
            </div>

            <h3 className="subhead">Interface contracts</h3>
            {contracts.length === 0 ? (
              <p className="empty-inline">No interface contracts linked to this field.</p>
            ) : (
              <ul className="contract-list">
                {contracts.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="linkish"
                      onClick={() => onOpenInterface(c.id)}
                    >
                      <strong>{c.name}</strong>
                    </button>
                    <span className="meta">
                      {systemById.get(c.sourceSystemId)?.acronym} →{' '}
                      {systemById.get(c.targetSystemId)?.acronym} · {c.protocol} · SLA{' '}
                      {c.slaMinutes}m
                    </span>
                    <p>{c.notes}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  )
}
