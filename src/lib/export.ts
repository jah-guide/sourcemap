import type { FieldMapping, SourceMapCatalog } from '../types'
import { buildIndexes, fieldLabel } from './catalog'

export type MappingExportRow = {
  mappingId: string
  source: string
  target: string
  interfaceName: string
  protocol: string
  transform: string
  critical: boolean
}

export function buildMappingExportRows(
  catalog: SourceMapCatalog,
  mappings: FieldMapping[],
): MappingExportRow[] {
  const { systemById, fieldById } = buildIndexes(catalog)
  return mappings.map((mapping) => {
    const source = fieldById.get(mapping.sourceFieldId)!
    const target = fieldById.get(mapping.targetFieldId)!
    const iface = catalog.interfaces.find((i) => i.id === mapping.interfaceId)!
    return {
      mappingId: mapping.id,
      source: fieldLabel(source, systemById.get(source.systemId)),
      target: fieldLabel(target, systemById.get(target.systemId)),
      interfaceName: iface.name,
      protocol: iface.protocol,
      transform: mapping.transform,
      critical: mapping.critical,
    }
  })
}

export function mappingsToJson(rows: MappingExportRow[]): string {
  return JSON.stringify(rows, null, 2)
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function mappingsToCsv(rows: MappingExportRow[]): string {
  const header = [
    'mappingId',
    'source',
    'target',
    'interfaceName',
    'protocol',
    'transform',
    'critical',
  ]
  const lines = [
    header.join(','),
    ...rows.map((row) =>
      [
        row.mappingId,
        row.source,
        row.target,
        row.interfaceName,
        row.protocol,
        row.transform,
        row.critical ? 'yes' : 'no',
      ]
        .map(String)
        .map(csvEscape)
        .join(','),
    ),
  ]
  return lines.join('\n')
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
