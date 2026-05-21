import { CheckoutDetailsFormInputSchema } from '../../io/schemas'
import type {
  CheckoutDetailsFormInput,
  CheckoutWizardPageDetails
} from '../../io/types'
import { DEFAULT_FORM_VALUES } from './config'

export const getDefaultFormValues = (
  details: CheckoutWizardPageDetails | null
): CheckoutDetailsFormInput & { isValid: boolean; isSubmitted: boolean } => {
  const storedValue = details?.value ?? null
  const base =
    storedValue !== null && typeof storedValue === 'object'
      ? (() => {
          const parsed = CheckoutDetailsFormInputSchema.safeParse(storedValue)
          return parsed.success
            ? { ...DEFAULT_FORM_VALUES, ...parsed.data }
            : { ...DEFAULT_FORM_VALUES }
        })()
      : { ...DEFAULT_FORM_VALUES }

  return {
    ...base,
    isValid: details?.pageIsValid ?? false,
    isSubmitted: details?.userHasSubmitted ?? false
  }
}
