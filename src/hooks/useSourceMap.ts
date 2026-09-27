import { useCallback, useMemo, useState } from 'react'
import { readPinnedFieldIds, togglePinnedFieldId, writePinnedFieldIds } from '../lib/bookmarks'
import {
  pushRecentFieldId,
  readRecentFieldIds,
  writeRecentFieldIds,
} from '../lib/recent'
import type { SystemStatusFilter } from '../lib/catalog'
import { seedCatalog } from '../data/seed'
import type { FieldId, SourceMapCatalog, ViewId } from '../types'

export type MappingProtocolFilter = 'all' | 'REST' | 'SFTP' | 'Kafka' | 'DB sync'

export function useSourceMap() {
  const [catalog] = useState<SourceMapCatalog>(() => structuredClone(seedCatalog))
  const [view, setView] = useState<ViewId>('systems')
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null)
  const [selectedFieldId, setSelectedFieldId] = useState<FieldId | null>(null)
  const [mappingFilter, setMappingFilter] = useState('')
  const [systemSearch, setSystemSearch] = useState('')
  const [systemStatusFilter, setSystemStatusFilter] =
    useState<SystemStatusFilter>('all')
  const [fieldSearch, setFieldSearch] = useState('')
  const [recentFieldIds, setRecentFieldIds] = useState<FieldId[]>(() =>
    readRecentFieldIds(),
  )
  const [mappingCriticalOnly, setMappingCriticalOnly] = useState(false)
  const [mappingProtocol, setMappingProtocol] =
    useState<MappingProtocolFilter>('all')
  const [pinnedFieldIds, setPinnedFieldIds] = useState<FieldId[]>(() =>
    readPinnedFieldIds(),
  )
  const [drawerInterfaceId, setDrawerInterfaceId] = useState<string | null>(
    null,
  )
  const [compareSystemAId, setCompareSystemAId] = useState<string | null>(null)
  const [compareSystemBId, setCompareSystemBId] = useState<string | null>(
    null,
  )

  const togglePin = useCallback((fieldId: FieldId) => {
    setPinnedFieldIds((prev) => {
      const next = togglePinnedFieldId(prev, fieldId)
      writePinnedFieldIds(next)
      return next
    })
  }, [])

  const recordRecentField = useCallback((fieldId: FieldId) => {
    setRecentFieldIds((prev) => {
      const next = pushRecentFieldId(prev, fieldId)
      writeRecentFieldIds(next)
      return next
    })
  }, [])

  const stats = useMemo(
    () => ({
      systems: catalog.systems.length,
      fields: catalog.fields.length,
      mappings: catalog.mappings.length,
      interfaces: catalog.interfaces.length,
      pinned: pinnedFieldIds.length,
    }),
    [catalog, pinnedFieldIds.length],
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
    systemSearch,
    setSystemSearch,
    systemStatusFilter,
    setSystemStatusFilter,
    fieldSearch,
    setFieldSearch,
    recentFieldIds,
    recordRecentField,
    mappingCriticalOnly,
    setMappingCriticalOnly,
    mappingProtocol,
    setMappingProtocol,
    pinnedFieldIds,
    togglePin,
    drawerInterfaceId,
    setDrawerInterfaceId,
    compareSystemAId,
    setCompareSystemAId,
    compareSystemBId,
    setCompareSystemBId,
    stats,
  }
}

export type SourceMapState = ReturnType<typeof useSourceMap>
