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
    <!-- 1. HubSpot Form -->
    <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
    <script>
      hbspt.forms.create({
        portalId: "43829367",
        formId: "809dc90b-b72d-432e-b868-90bccca6a414",
        region: "na1"
      });
    </script>

    <!-- 2. RevenueHero Calendar -->
    <script type="text/javascript" src="https://assets.revenuehero.io/scheduler.min.js"></script>
    <script type="text/javascript">
      window.hero = new window.RevenueHero({ routerId: '6715' });
      window.hero.schedule('hsForm_809dc90b-b72d-432e-b868-90bccca6a414');
    </script>
  `

  const shouldOverrideForTesting = embedForm.includes(
    '809dc90b-b72d-432e-b868-90bccca6a414'
  )

  const finalEmbedForm = shouldOverrideForTesting
    ? REVENUE_HERO_TEST_SCRIPT
    : embedForm

  return <HubspotUniversalForm embedForm={finalEmbedForm} className={className} />
}
