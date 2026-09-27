import { useMemo, useState } from 'react'
import { seedCatalog } from '../data/seed'
import type { FieldId, SourceMapCatalog, ViewId } from '../types'

export function useSourceMap() {
  const [catalog] = useState<SourceMapCatalog>(() => structuredClone(seedCatalog))
  const [view, setView] = useState<ViewId>('systems')
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<FieldId | null>(null)
  const [mappingFilter, setMappingFilter] = useState('')

  const stats = useMemo(
    () => ({
      systems: catalog.systems.length,
      fields: catalog.fields.length,
      mappings: catalog.mappings.length,
      interfaces: catalog.interfaces.length,
    }),
    [catalog],
  )

  return {
    catalog,
    view,
    setView,
    selectedSystemId,
    setSelectedSystemId,
    selectedFieldId,
    setSelectedFieldId,
    mappingFilter,
    setMappingFilter,
    stats,
  }
}

export type SourceMapState = ReturnType<typeof useSourceMap>
