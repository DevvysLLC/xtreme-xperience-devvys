export type WizardPagePersistence = {
  pageIsValid?: boolean
  userHasSubmitted?: boolean
  lastSubmittedAt?: string | null
}

export const isSubmittedPageValid = (
  page: WizardPagePersistence | null | undefined
): boolean => {
  return Boolean(page?.pageIsValid && page?.userHasSubmitted)
}
