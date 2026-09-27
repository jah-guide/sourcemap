export type SystemId = string
export type FieldId = string
export type MappingId = string
export type InterfaceId = string

export interface SystemRecord {
  id: SystemId
  name: string
  acronym: string
  owner: string
  domain: string
  description: string
  status: 'production' | 'staging' | 'deprecated'
}

export interface FieldRecord {
  id: FieldId
  systemId: SystemId
  name: string
  dataType: string
  description: string
  nullable: boolean
  pii: boolean
}

export interface InterfaceContract {
  id: InterfaceId
  name: string
  sourceSystemId: SystemId
  targetSystemId: SystemId
  protocol: 'REST' | 'SFTP' | 'Kafka' | 'DB sync'
  frequency: string
  slaMinutes: number
  notes: string
}

export interface FieldMapping {
  id: MappingId
  interfaceId: InterfaceId
  sourceFieldId: FieldId
  targetFieldId: FieldId
  transform: string
  critical: boolean
}

export interface SourceMapCatalog {
  systems: SystemRecord[]
  fields: FieldRecord[]
  interfaces: InterfaceContract[]
  mappings: FieldMapping[]
}

export type ViewId = 'systems' | 'mappings' | 'impact'

export interface ImpactNode {
  field: FieldRecord
  system: SystemRecord
  role: 'origin' | 'downstream' | 'upstream'
  mapping?: FieldMapping
  interface?: InterfaceContract
}
