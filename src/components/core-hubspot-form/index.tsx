'use client'

import type { FC } from 'react'
import { HubspotUniversalForm } from './components/hubspot-universal-form'

export type Props = {
  embedForm: string
  hubspotVersion?: string | null
  className?: string
}

/**
 * CoreHubspotForm delegates to the HubspotUniversalForm which natively
 * handles both Legacy (v2) and Next-Gen (v4) forms via script injection.
 */
export const CoreHubspotForm: FC<Props> = ({ embedForm, className }) => {
  // TODO: Remove this hardcoded script once the client is done testing
  const REVENUE_HERO_TEST_SCRIPT = `
    <script type="text/javascript" src="https://assets.revenuehero.io/scheduler.min.js"></script>
    <script type="text/javascript">
      window.hero = new RevenueHero({ routerId: '6715' })
      hero.schedule('hsForm_fbbef109-ac09-47e8-8a51-1801a562e0cf')
    </script>
  `

  const shouldInjectTestingScript = embedForm.includes(
    'fbbef109-ac09-47e8-8a51-1801a562e0cf'
  )

  const finalEmbedForm = shouldInjectTestingScript
    ? embedForm + REVENUE_HERO_TEST_SCRIPT
    : embedForm

  return (
    <HubspotUniversalForm
      embedForm={finalEmbedForm}
      className={className}
    />
  )
}
