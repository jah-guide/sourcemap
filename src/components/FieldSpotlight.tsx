import { useMemo, useState } from 'react'
import { buildIndexes, fieldLabel } from '../lib/catalog'
import type { FieldId, SourceMapCatalog } from '../types'

interface FieldSpotlightProps {
  catalog: SourceMapCatalog
  onSelectField: (fieldId: FieldId) => void
}

export function FieldSpotlight({ catalog, onSelectField }: FieldSpotlightProps) {
  const [query, setQuery] = useState('')
  const { systemById } = buildIndexes(catalog)

  const options = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog.fields
      .map((field) => ({
        id: field.id,
        label: fieldLabel(field, systemById.get(field.systemId)),
        hay: [
          field.name,
          field.description,
          field.dataType,
          systemById.get(field.systemId)?.acronym,
        ]
          .join(' ')
          .toLowerCase(),
      }))
      .filter((opt) => !q || opt.hay.includes(q))
      .slice(0, 8)
  }, [catalog.fields, query, systemById])

  return (
    <div className="field-spotlight">
      <label className="spotlight-label">
        <span className="visually-hidden">Find any field</span>
        <input
          type="search"
          className="search-input spotlight-input"
          placeholder="Spotlight: jump to any field…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-controls="spotlight-results"
          aria-expanded={query.trim().length > 0 && options.length > 0}
        />
      </label>
      {query.trim().length > 0 && (
        <ul id="spotlight-results" className="spotlight-results" role="listbox">
          {options.length === 0 ? (
            <li className="spotlight-empty">No fields match.</li>
          ) : (
            options.map((opt) => (
              <li key={opt.id}>
                <button
                  type="button"
                  role="option"
                  className="spotlight-option"
                  onClick={() => {
                    onSelectField(opt.id)
                    setQuery('')
                  }}
                >
                  {opt.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
