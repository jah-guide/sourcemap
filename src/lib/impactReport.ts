import {
  buildIndexes,
  computeImpact,
  criticalPathFieldIds,
  fieldLabel,
  interfacesForField,
  mappingsForField,
} from './catalog'
import type { FieldId, SourceMapCatalog } from '../types'

export function buildImpactReportMarkdown(
  catalog: SourceMapCatalog,
  fieldId: FieldId,
): string {
  const { systemById, fieldById } = buildIndexes(catalog)
  const field = fieldById.get(fieldId)
  if (!field) return ''

  const system = systemById.get(field.systemId)
  const label = fieldLabel(field, system)
  const impact = computeImpact(catalog, fieldId)
  const criticalPath = criticalPathFieldIds(catalog, fieldId)
  const mappings = mappingsForField(catalog, fieldId)
  const contracts = interfacesForField(catalog, fieldId)

  const lines: string[] = [
    `# SourceMap impact — ${label}`,
    '',
    `**System:** ${system?.name ?? field.systemId} (${system?.status ?? 'unknown'})`,
    `**Description:** ${field.description}`,
    '',
    '## Summary',
    `- Direct mappings: ${mappings.length}`,
    `- Critical mappings: ${mappings.filter((m) => m.critical).length}`,
    `- Blast radius nodes: ${impact.length}`,
    `- On critical path: ${impact.filter((n) => criticalPath.has(n.field.id)).length}`,
    `- Interfaces: ${contracts.length}`,
    '',
    '## Blast radius',
  ]

  for (const node of impact) {
    const nodeLabel = fieldLabel(node.field, node.system)
    const flags = [
      node.role,
      criticalPath.has(node.field.id) ? 'critical-path' : null,
      node.mapping?.critical ? 'critical-edge' : null,
    ]
      .filter(Boolean)
      .join(', ')
    lines.push(`- ${nodeLabel} (${flags})`)
    if (node.interface) {
      lines.push(
        `  - via ${node.interface.name}, SLA ${node.interface.slaMinutes}m`,
      )
    }
    if (node.mapping) {
      lines.push(`  - transform: \`${node.mapping.transform}\``)
    }
  }

  if (contracts.length > 0) {
    lines.push('', '## Interface contracts')
    for (const c of contracts) {
      lines.push(
        `- **${c.name}** — ${systemById.get(c.sourceSystemId)?.acronym} → ${systemById.get(c.targetSystemId)?.acronym}, ${c.protocol}, SLA ${c.slaMinutes}m`,
      )
    }
  }

  lines.push('', '_Generated from SourceMap demo (local seed)._')
  return lines.join('\n')
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
