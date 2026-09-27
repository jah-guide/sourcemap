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
