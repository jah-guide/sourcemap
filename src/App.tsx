import { Layout } from './components/Layout'
import { ImpactView } from './components/ImpactView'
import { MappingTable } from './components/MappingTable'
import { SystemsCatalog } from './components/SystemsCatalog'
import { useSourceMap } from './hooks/useSourceMap'
import './App.css'

function App() {
  const state = useSourceMap()

  const goToImpact = (fieldId: string) => {
    state.setSelectedFieldId(fieldId)
    state.setView('impact')
  }

  return (
    <Layout
      view={state.view}
      onViewChange={state.setView}
      stats={state.stats}
    >
      {state.view === 'systems' && (
        <SystemsCatalog
          catalog={state.catalog}
          selectedSystemId={state.selectedSystemId}
          selectedFieldId={state.selectedFieldId}
          onSelectSystem={state.setSelectedSystemId}
          onSelectField={goToImpact}
        />
      )}
      {state.view === 'mappings' && (
        <MappingTable
          catalog={state.catalog}
          filter={state.mappingFilter}
          onFilterChange={state.setMappingFilter}
          onSelectField={goToImpact}
        />
      )}
      {state.view === 'impact' && (
        <ImpactView
          catalog={state.catalog}
          selectedFieldId={state.selectedFieldId}
          onSelectField={state.setSelectedFieldId}
        />
      )}
    </Layout>
  )
}

export default App
