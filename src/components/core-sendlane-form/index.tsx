'use client'

import clsx from 'clsx'
import { type FC, useEffect, useMemo, useState } from 'react'
import styles from './style.module.scss'

type SendlaneWindow = Window & {
  _Sendlane?: Record<string, string>[] & {
    lookForInlineForms?: () => void
  }
}

declare let window: SendlaneWindow

export type Props = {
  embedForm: string
  className?: string
}

type ParsedSendlaneEmbed = {
  formKey: string | null
}

/**
 * Parses Sendlane embed HTML to extract the data-form-key.
 * Expected format:
 * <div class="sendlane-form" data-form-key="FORM_KEY"></div>
 */
const parseSendlaneEmbed = (embedHtml: string): ParsedSendlaneEmbed => {
  const formKeyMatch = /data-form-key=["']([^"']+)["']/.exec(embedHtml)
  const formKey = formKeyMatch?.[1] ?? null

  return { formKey }
}

/**
 * CoreSendlaneForm renders a Sendlane form via their embed SDK.
 * Parses the embed HTML for the form key,
 * then renders the data-attribute div and pushes the form_key to
 * window._Sendlane so the SDK initializes the form.
 */
export const CoreSendlaneForm: FC<Props> = ({ embedForm, className }) => {
  const [isClient, setIsClient] = useState(false)

  const { formKey } = useMemo(() => parseSendlaneEmbed(embedForm), [embedForm])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !formKey) {
      return
    }

    window._Sendlane = window._Sendlane ?? []
    window._Sendlane.lookForInlineForms?.()
  }, [isClient, formKey])

  if (!isClient) {
    return null
  }

  if (!formKey) {
    return null
  }

  return (
    <div
      className={clsx('sendlane-form', styles.sendlaneForm, className)}
      data-form-key={formKey}
    />
  )
}
