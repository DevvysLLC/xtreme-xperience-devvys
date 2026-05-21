'use client'

import { useTranslations } from 'next-intl'
import { type FC, useCallback, useEffect, useMemo, useRef } from 'react'
import { DRAWER_REQUEST_CLOSE_MESSAGE_NAME } from '../../core/messaging/main/messages/close-drawer'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../core/messaging/main/react'
import { useForm } from '../../features/form'
import { validateHtmlForEmbed } from '../../utils/is-html-safe-for-embed'
import { CoreForm } from '../core-form'
import { CoreHubspotForm } from '../core-hubspot-form'
import { CoreLoadingSpinner } from '../core-loading-spinner'
import { CoreSendlaneForm } from '../core-sendlane-form'
import { Drawer } from '../global-drawer'
import { useFormDialog } from './context'
import { isFormRecordForDialog } from './form-record-for-dialog'
import styles from './style.module.scss'

const DRAWER_ID = 'form-dialog'

export const GlobalFormDialog: FC = () => {
  const t = useTranslations('global_form_dialog')
  const { isOpen, handle, closeFormDialog } = useFormDialog()
  const { data, isLoading, isError } = useForm(isOpen ? handle : null)
  const isClosingRef = useRef(false)
  const prevIsOpenRef = useRef(false)

  const bus = useMainBus(
    DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
    useCallback(
      (event) => {
        if (event.details.id === DRAWER_ID || event.details.id === undefined) {
          if (!isClosingRef.current) {
            closeFormDialog()
          }
        }
      },
      [closeFormDialog]
    )
  )

  useEffect(() => {
    const wasOpen = prevIsOpenRef.current
    prevIsOpenRef.current = isOpen

    if (isOpen && !wasOpen) {
      bus.send({
        name: DRAWER_REQUEST_OPEN_MESSAGE_NAME,
        details: { id: DRAWER_ID }
      })
    } else if (!isOpen && wasOpen) {
      isClosingRef.current = true
      bus.send({
        name: DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
        details: { id: DRAWER_ID }
      })
      queueMicrotask(() => {
        isClosingRef.current = false
      })
    }
  }, [isOpen, bus])

  const form = data?.form
  const iframeEmbed =
    form && 'iframeEmbed' in form && typeof form.iframeEmbed === 'string'
      ? form.iframeEmbed.trim() || null
      : null
  const hubspotEmbed =
    form && 'hubspotEmbed' in form && typeof form.hubspotEmbed === 'string'
      ? form.hubspotEmbed.trim() || null
      : null
  const hubspotVersion =
    form && 'hubspotVersion' in form && typeof form.hubspotVersion === 'string'
      ? form.hubspotVersion
      : null
  const sendlaneEmbed =
    form && 'sendlaneEmbed' in form && typeof form.sendlaneEmbed === 'string'
      ? form.sendlaneEmbed.trim() || null
      : null

  const iframeEmbedValidation = useMemo(() => {
    if (!iframeEmbed) {
      return null
    }
    return validateHtmlForEmbed(iframeEmbed, { requireIframe: true })
  }, [iframeEmbed])

  return (
    <Drawer
      id={DRAWER_ID}
      layoutType="dialog"
      className={styles.formDialog}
      panelClassName={styles.formDialog__panel}
    >
      {isLoading && (
        <div className={styles.formDialog__loading}>
          <CoreLoadingSpinner aspectRatio="1/1" />
        </div>
      )}
      {!isLoading && isError && (
        <p className={styles.formDialog__error}>{t('error_load_failed')}</p>
      )}
      {!isLoading && !isError && form && (
        <div className={styles.formDialog__content}>
          {iframeEmbed ? (
            iframeEmbedValidation?.safe === false ? (
              <p className={styles.formDialog__error}>
                {t('error_invalid_embed')}
              </p>
            ) : iframeEmbedValidation?.safe === true ? (
              <div
                className={styles.formDialog__iframeWrapper}
                dangerouslySetInnerHTML={{ __html: iframeEmbedValidation.html }}
              />
            ) : null
          ) : hubspotEmbed ? (
            <CoreHubspotForm
              embedForm={hubspotEmbed}
              hubspotVersion={hubspotVersion}
            />
          ) : sendlaneEmbed ? (
            <CoreSendlaneForm embedForm={sendlaneEmbed} />
          ) : isFormRecordForDialog(form) ? (
            <CoreForm data={form} />
          ) : null}
        </div>
      )}
    </Drawer>
  )
}

export { FormDialogProvider, useFormDialog } from './context'
