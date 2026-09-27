import { buildIndexes } from '../lib/catalog'
import type { InterfaceContract, SourceMapCatalog } from '../types'

interface InterfaceDrawerProps {
  catalog: SourceMapCatalog
  interfaceId: string | null
  onClose: () => void
}

export function InterfaceDrawer({
  catalog,
  interfaceId,
  onClose,
}: InterfaceDrawerProps) {
  if (!interfaceId) return null

  const contract = catalog.interfaces.find((i) => i.id === interfaceId)
  if (!contract) return null

  const { systemById } = buildIndexes(catalog)
  const mappingCount = catalog.mappings.filter(
    (m) => m.interfaceId === interfaceId,
  ).length

  return (
    <div className="drawer-backdrop" role="presentation" onClick={onClose}>
      <aside
        className="interface-drawer"
        role="dialog"
        aria-labelledby="iface-drawer-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="drawer-header">
          <div>
            <p className="drawer-eyebrow">Interface contract</p>
            <h2 id="iface-drawer-title">{contract.name}</h2>
          </div>
          <button type="button" className="drawer-close" onClick={onClose}>
            Close
          </button>
        </header>
        <ContractBody
          contract={contract}
          mappingCount={mappingCount}
          sourceAcronym={
            systemById.get(contract.sourceSystemId)?.acronym ?? '?'
          }
          targetAcronym={
            systemById.get(contract.targetSystemId)?.acronym ?? '?'
          }
        />
      </aside>
    </div>
  )
}

function ContractBody({
  contract,
  mappingCount,
  sourceAcronym,
  targetAcronym,
}: {
  contract: InterfaceContract
  mappingCount: number
  sourceAcronym: string
  targetAcronym: string
}) {
  return (
    <div className="drawer-body">
      <dl className="drawer-facts">
        <div>
          <dt>Route</dt>
          <dd>
            {sourceAcronym} → {targetAcronym}
          </dd>
        </div>
        <div>
          <dt>Protocol</dt>
          <dd>{contract.protocol}</dd>
        </div>
        <div>
          <dt>Frequency</dt>
          <dd>{contract.frequency}</dd>
        </div>
        <div>
          <dt>SLA</dt>
          <dd>{contract.slaMinutes} minutes</dd>
        </div>
        <div>
          <dt>Field mappings</dt>
          <dd>{mappingCount}</dd>
        </div>
      </dl>
      <p className="drawer-notes">{contract.notes}</p>
    </div>
  )
}
