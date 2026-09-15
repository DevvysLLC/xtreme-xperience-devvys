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
  return <HubspotUniversalForm embedForm={embedForm} className={className} />
}
