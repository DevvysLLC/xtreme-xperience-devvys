'use client'

import type { FC } from 'react'
import { HubspotFormV2 } from './components/hubspot-form-v2'
import { HubspotFormV4 } from './components/hubspot-form-v4'

export type Props = {
  embedForm: string
  hubspotVersion?: string | null
  className?: string
}

/**
 * CoreHubspotForm delegates to the appropriate HubSpot form renderer
 * based on the `hubspotVersion` field from the CMS.
 *
 * - "v2" → uses the HubSpot Forms v2 JS SDK (hbspt.forms.create)
 * - "v4" (default) → uses the v4 data-attribute embed approach
 */
export const CoreHubspotForm: FC<Props> = ({
  embedForm,
  hubspotVersion,
  className
}) => {
  if (hubspotVersion === 'v2') {
    return <HubspotFormV2 embedForm={embedForm} className={className} />
  }

  return <HubspotFormV4 embedForm={embedForm} className={className} />
}
