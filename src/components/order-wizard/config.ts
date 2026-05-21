import { ROUTES } from '../../config/routes'

export type OrderWizardPageKey = 'order'

export type OrderWizardPage = {
  id: OrderWizardPageKey
  enabled: boolean
  pathPattern: RegExp
}

export const orderWizardConfig = {
  pages: [
    {
      id: 'order',
      enabled: true,
      pathPattern: /^\/order\/[^/]+$/
    }
  ] satisfies OrderWizardPage[]
} as const

export const getRedirectPathIfNeeded = (
  pathname: string,
  orderId: string
): string | null => {
  const orderPage = orderWizardConfig.pages.find((page) => page.enabled)
  if (!orderPage?.pathPattern.test(pathname)) {
    return ROUTES.FRONTEND.HOME
  }
  if (!orderId.trim()) {
    return ROUTES.FRONTEND.HOME
  }
  return null
}
