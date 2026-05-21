import { ROUTES } from '../../config/routes'
import type { CheckoutState } from '../../io/types'

export type CheckoutWizardPageKey = 'details' | 'payment'

export type CheckoutWizardPage = {
  id: CheckoutWizardPageKey
  enabled: boolean
  path: string
  title?: string
}

export const US_STATES: { code: string; name: string }[] = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
]

export const checkoutWizardConfig = {
  pages: [
    {
      id: 'details',
      enabled: true,
      path: ROUTES.CHECKOUT.CONTACTS
    },
    {
      id: 'payment',
      enabled: true,
      path: ROUTES.CHECKOUT.PAYMENT
    }
  ] satisfies CheckoutWizardPage[]
} as const

export const getNextPagePath = (currentPath: string): string | null => {
  const enabledPages = checkoutWizardConfig.pages.filter((page) => page.enabled)
  const currentIndex = enabledPages.findIndex(
    (page) => page.path === currentPath
  )
  if (currentIndex === -1 || currentIndex === enabledPages.length - 1) {
    return null
  }
  const nextPage = enabledPages[currentIndex + 1]
  return nextPage?.path ?? null
}

export const getPreviousPagePath = (currentPath: string): string | null => {
  const enabledPages = checkoutWizardConfig.pages.filter((page) => page.enabled)
  const currentIndex = enabledPages.findIndex(
    (page) => page.path === currentPath
  )
  if (currentIndex <= 0) {
    return null
  }
  const previousPage = enabledPages[currentIndex - 1]
  return previousPage?.path ?? null
}

type CheckoutStateDataKey = keyof Pick<CheckoutState, 'details' | 'payment'>

const PAGE_TO_STATE_KEY: Record<CheckoutWizardPageKey, CheckoutStateDataKey> = {
  details: 'details',
  payment: 'payment'
}

const getStateKeyForPage = (
  pageId: CheckoutWizardPageKey
): CheckoutStateDataKey => {
  return PAGE_TO_STATE_KEY[pageId]
}

export const isPageDataComplete = (
  pageId: CheckoutWizardPageKey,
  checkout: CheckoutState | null | undefined
): boolean => {
  if (!checkout) {
    return false
  }

  const stateKey = getStateKeyForPage(pageId)
  const value = checkout[stateKey]
  return value !== null && value !== undefined
}

export const getMaxAccessiblePageIndex = (
  checkout: CheckoutState | null | undefined
): number => {
  const enabledPages = checkoutWizardConfig.pages.filter((page) => page.enabled)

  // If no checkout state, only first page is accessible
  if (!checkout) {
    return 0
  }

  for (let i = 1; i < enabledPages.length; i++) {
    // Get the previous page - this is what the current page requires
    const previousPage = enabledPages[i - 1]
    if (!previousPage) {
      continue
    }

    // Map the page ID to the corresponding state key
    const stateKey = getStateKeyForPage(previousPage.id)

    // Check if the requirement (previous page's data) is met
    const requiredValue = checkout[stateKey]
    // If the requirement is not met, the previous page is the max accessible
    if (requiredValue === null || requiredValue === undefined) {
      return i - 1
    }
  }

  // All requirements met, all pages accessible
  return enabledPages.length - 1
}

export const getMaxAccessiblePagePath = (
  checkout: CheckoutState | null | undefined
): string => {
  const enabledPages = checkoutWizardConfig.pages.filter((page) => page.enabled)
  const maxIndex = getMaxAccessiblePageIndex(checkout)
  return enabledPages[maxIndex]?.path ?? ROUTES.CHECKOUT.CONTACTS
}

export const getRedirectPathIfNeeded = (
  currentPath: string,
  checkout: CheckoutState | null | undefined
): string | null => {
  const enabledPages = checkoutWizardConfig.pages.filter((page) => page.enabled)
  const currentIndex = enabledPages.findIndex(
    (page) => page.path === currentPath
  )

  // Path not found in wizard pages, don't redirect
  if (currentIndex === -1) {
    return null
  }

  const maxAccessibleIndex = getMaxAccessiblePageIndex(checkout)

  // Current page is beyond what's accessible
  if (currentIndex > maxAccessibleIndex) {
    return enabledPages[maxAccessibleIndex]?.path ?? ROUTES.CHECKOUT.CONTACTS
  }

  return null
}
