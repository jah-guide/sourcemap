import { Layout } from './components/Layout'
import { ImpactView } from './components/ImpactView'
import { InterfaceDrawer } from './components/InterfaceDrawer'
import { MappingTable } from './components/MappingTable'
import { SystemComparePanel } from './components/SystemComparePanel'
import { SystemsCatalog } from './components/SystemsCatalog'
import { useSourceMap } from './hooks/useSourceMap'
import './App.css'

function App() {
  const state = useSourceMap()

  const trackField = (fieldId: string) => {
    state.setSelectedFieldId(fieldId)
    state.recordRecentField(fieldId)
  }

  const goToImpact = (fieldId: string) => {
    trackField(fieldId)
    state.setView('impact')
  }

  return (
    <>
      <Layout
        view={state.view}
        onViewChange={state.setView}
        stats={state.stats}
        pinnedFieldIds={state.pinnedFieldIds}
        recentFieldIds={state.recentFieldIds}
        catalog={state.catalog}
        onSelectField={goToImpact}
      >
        {state.view === 'systems' && (
          <>
            <SystemsCatalog
              catalog={state.catalog}
              selectedSystemId={state.selectedSystemId}
              selectedFieldId={state.selectedFieldId}
              systemSearch={state.systemSearch}
              systemStatusFilter={state.systemStatusFilter}
              fieldSearch={state.fieldSearch}
              pinnedFieldIds={state.pinnedFieldIds}
              onSystemSearchChange={state.setSystemSearch}
              onSystemStatusFilterChange={state.setSystemStatusFilter}
              onFieldSearchChange={state.setFieldSearch}
              onSelectSystem={state.setSelectedSystemId}
              onSelectField={goToImpact}
              onTogglePin={state.togglePin}
            />
            <SystemComparePanel
              catalog={state.catalog}
              systemAId={state.compareSystemAId}
              systemBId={state.compareSystemBId}
              onSystemAChange={state.setCompareSystemAId}
              onSystemBChange={state.setCompareSystemBId}
            />
          </>
        )}
        {state.view === 'mappings' && (
          <MappingTable
            catalog={state.catalog}
            filter={state.mappingFilter}
            criticalOnly={state.mappingCriticalOnly}
            protocol={state.mappingProtocol}
            onFilterChange={state.setMappingFilter}
            onCriticalOnlyChange={state.setMappingCriticalOnly}
            onProtocolChange={state.setMappingProtocol}
            onSelectField={goToImpact}
            onOpenInterface={state.setDrawerInterfaceId}
          />
        )}
        {state.view === 'impact' && (
          <ImpactView
            catalog={state.catalog}
            selectedFieldId={state.selectedFieldId}
            onSelectField={trackField}
            onOpenInterface={state.setDrawerInterfaceId}
          />
        )}
      </Layout>
      <InterfaceDrawer
        catalog={state.catalog}
        interfaceId={state.drawerInterfaceId}
        onClose={() => state.setDrawerInterfaceId(null)}
      />
    </>
  )
}

export default App
