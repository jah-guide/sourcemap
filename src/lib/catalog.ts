import type {
  FieldId,
  FieldMapping,
  FieldRecord,
  ImpactNode,
  InterfaceContract,
  SourceMapCatalog,
  SystemRecord,
} from '../types'

export function buildIndexes(catalog: SourceMapCatalog) {
  const systemById = new Map(catalog.systems.map((s) => [s.id, s]))
  const fieldById = new Map(catalog.fields.map((f) => [f.id, f]))
  return { systemById, fieldById }
}

export function fieldLabel(
  field: FieldRecord,
  system: SystemRecord | undefined,
): string {
  const sys = system?.acronym ?? field.systemId
  return `${sys}.${field.name}`
}

export function mappingsForField(
  catalog: SourceMapCatalog,
  fieldId: FieldId,
): FieldMapping[] {
  return catalog.mappings.filter(
    (m) => m.sourceFieldId === fieldId || m.targetFieldId === fieldId,
  )
}

export function computeImpact(
  catalog: SourceMapCatalog,
  fieldId: FieldId,
): ImpactNode[] {
  const { systemById, fieldById } = buildIndexes(catalog)
  const origin = fieldById.get(fieldId)
  if (!origin) return []

  const nodes: ImpactNode[] = [
    {
      field: origin,
      system: systemById.get(origin.systemId)!,
      role: 'origin',
    },
  ]

  const visited = new Set<FieldId>([fieldId])

  function walkDownstream(sourceId: FieldId) {
    for (const mapping of catalog.mappings) {
      if (mapping.sourceFieldId !== sourceId) continue
      const target = fieldById.get(mapping.targetFieldId)
      if (!target || visited.has(target.id)) continue
      visited.add(target.id)
      const iface = catalog.interfaces.find((i) => i.id === mapping.interfaceId)
      nodes.push({
        field: target,
        system: systemById.get(target.systemId)!,
        role: 'downstream',
        mapping,
        interface: iface,
      })
      walkDownstream(target.id)
    }
  }

  function walkUpstream(targetId: FieldId) {
    for (const mapping of catalog.mappings) {
      if (mapping.targetFieldId !== targetId) continue
      const source = fieldById.get(mapping.sourceFieldId)
      if (!source || visited.has(source.id)) continue
      visited.add(source.id)
      const iface = catalog.interfaces.find((i) => i.id === mapping.interfaceId)
      nodes.push({
        field: source,
        system: systemById.get(source.systemId)!,
        role: 'upstream',
        mapping,
        interface: iface,
      })
      walkUpstream(source.id)
    }
  }

  walkDownstream(fieldId)
  walkUpstream(fieldId)

  return nodes
}

export function interfacesForField(
  catalog: SourceMapCatalog,
  fieldId: FieldId,
): InterfaceContract[] {
  const mappingIds = new Set(
    mappingsForField(catalog, fieldId).map((m) => m.interfaceId),
  )
  return catalog.interfaces.filter((i) => mappingIds.has(i.id))
}

export function fieldsForSystem(
  catalog: SourceMapCatalog,
  systemId: string,
): FieldRecord[] {
  return catalog.fields.filter((f) => f.systemId === systemId)
}

export type SystemStatusFilter = 'all' | SystemRecord['status']

export function filterSystemsByStatus(
  systems: SystemRecord[],
  status: SystemStatusFilter,
): SystemRecord[] {
  if (status === 'all') return systems
  return systems.filter((system) => system.status === status)
}

export function filterSystemsByQuery(
  catalog: SourceMapCatalog,
  query: string,
): SystemRecord[] {
  const q = query.trim().toLowerCase()
  if (!q) return catalog.systems
  return catalog.systems.filter((system) => {
    const hay = [
      system.name,
      system.acronym,
      system.owner,
      system.domain,
      system.status,
    ]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}

export function filterFieldsByQuery(
  fields: FieldRecord[],
  query: string,
): FieldRecord[] {
  const q = query.trim().toLowerCase()
  if (!q) return fields
  return fields.filter((field) => {
    const hay = [field.name, field.dataType, field.description]
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}

/** Field IDs reachable from origin following only critical downstream hops. */
export function criticalPathFieldIds(
  catalog: SourceMapCatalog,
  fieldId: FieldId,
): Set<FieldId> {
  const { fieldById } = buildIndexes(catalog)
  const onPath = new Set<FieldId>([fieldId])

  function walk(sourceId: FieldId) {
    for (const mapping of catalog.mappings) {
      if (!mapping.critical || mapping.sourceFieldId !== sourceId) continue
      const target = fieldById.get(mapping.targetFieldId)
      if (!target || onPath.has(target.id)) continue
      onPath.add(target.id)
      walk(target.id)
    }
  }

  walk(fieldId)
  return onPath
}

/** Fields in a system with no mapping touching any other system. */
export function unmappedFieldCount(
  catalog: SourceMapCatalog,
  systemId: string,
): number {
  const systemFieldIds = new Set(
    catalog.fields.filter((f) => f.systemId === systemId).map((f) => f.id),
  )
  const linked = new Set<string>()
  for (const mapping of catalog.mappings) {
    const sourceIn = systemFieldIds.has(mapping.sourceFieldId)
    const targetIn = systemFieldIds.has(mapping.targetFieldId)
    if (sourceIn && !targetIn) linked.add(mapping.sourceFieldId)
    if (targetIn && !sourceIn) linked.add(mapping.targetFieldId)
    if (sourceIn && targetIn) {
      linked.add(mapping.sourceFieldId)
      linked.add(mapping.targetFieldId)
    }
  }
  return catalog.fields.filter(
    (f) => f.systemId === systemId && !linked.has(f.id),
  ).length
}
