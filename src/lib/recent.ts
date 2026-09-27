import type { FieldId } from '../types'

const STORAGE_KEY = 'sourcemap-recent-fields'
const MAX_RECENT = 6

export function readRecentFieldIds(): FieldId[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((id): id is FieldId => typeof id === 'string')
  } catch {
    return []
  }
}

export function pushRecentFieldId(
  ids: FieldId[],
  fieldId: FieldId,
): FieldId[] {
  const without = ids.filter((id) => id !== fieldId)
  return [fieldId, ...without].slice(0, MAX_RECENT)
}

export function writeRecentFieldIds(ids: FieldId[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}
