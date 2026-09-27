import type { FieldId } from '../types'

const STORAGE_KEY = 'sourcemap-pinned-fields'

export function readPinnedFieldIds(): FieldId[] {
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

export function writePinnedFieldIds(ids: FieldId[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

export function togglePinnedFieldId(
  ids: FieldId[],
  fieldId: FieldId,
): FieldId[] {
  if (ids.includes(fieldId)) {
    return ids.filter((id) => id !== fieldId)
  }
  return [...ids, fieldId]
}
