import type { InterfaceContract, SourceMapCatalog, SystemId } from '../types'
import { buildIndexes } from './catalog'

export interface SystemComparison {
  systemAId: SystemId
  systemBId: SystemId
  fieldsA: number
  fieldsB: number
  mappingsBetween: number
  sharedInterfaces: InterfaceContract[]
  onlyAFieldNames: string[]
  onlyBFieldNames: string[]
}

export function compareSystems(
  catalog: SourceMapCatalog,
  systemAId: SystemId,
  systemBId: SystemId,
): SystemComparison {
  const { fieldById } = buildIndexes(catalog)
  const fieldsA = catalog.fields.filter((f) => f.systemId === systemAId)
  const fieldsB = catalog.fields.filter((f) => f.systemId === systemBId)
  const idsA = new Set(fieldsA.map((f) => f.id))
  const idsB = new Set(fieldsB.map((f) => f.id))

  const mappingsBetween = catalog.mappings.filter(
    (m) =>
      (idsA.has(m.sourceFieldId) && idsB.has(m.targetFieldId)) ||
      (idsB.has(m.sourceFieldId) && idsA.has(m.targetFieldId)),
  )

  const interfaceIds = new Set(mappingsBetween.map((m) => m.interfaceId))
  const sharedInterfaces = catalog.interfaces.filter((i) =>
    interfaceIds.has(i.id),
  )

  const linkedNamesA = new Set<string>()
  const linkedNamesB = new Set<string>()
  for (const mapping of mappingsBetween) {
    const source = fieldById.get(mapping.sourceFieldId)
    const target = fieldById.get(mapping.targetFieldId)
    if (source?.systemId === systemAId) linkedNamesA.add(source.name)
    if (target?.systemId === systemAId) linkedNamesA.add(target.name)
    if (source?.systemId === systemBId) linkedNamesB.add(source.name)
    if (target?.systemId === systemBId) linkedNamesB.add(target.name)
  }

  const onlyAFieldNames = fieldsA
    .map((f) => f.name)
    .filter((name) => !linkedNamesA.has(name))
    .sort()
  const onlyBFieldNames = fieldsB
    .map((f) => f.name)
    .filter((name) => !linkedNamesB.has(name))
    .sort()

  return {
    systemAId,
    systemBId,
    fieldsA: fieldsA.length,
    fieldsB: fieldsB.length,
    mappingsBetween: mappingsBetween.length,
    sharedInterfaces,
    onlyAFieldNames,
    onlyBFieldNames,
  }
}
