import type { SectionContactFragment } from '../section-contact/section-contact.typegen'

export type FormRecordForDialog = NonNullable<SectionContactFragment['form']>

/**
 * Type guard: form has model with formFields (shape expected by CoreForm).
 */
export const isFormRecordForDialog = (
  form: unknown
): form is FormRecordForDialog => {
  if (typeof form !== 'object' || form === null) {
    return false
  }
  const o = form
  if (!('model' in o) || typeof o.model !== 'object' || o.model === null) {
    return false
  }
  const model = o.model
  return 'formFields' in model && Array.isArray(model.formFields)
}
