'use client'

import { type FC, useCallback, useEffect, useId, useRef } from 'react'
import { DRAWER_REQUEST_CLOSE_MESSAGE_NAME } from '../../core/messaging/main/messages/close-drawer'
import { DRAWER_REQUEST_OPEN_MESSAGE_NAME } from '../../core/messaging/main/messages/open-drawer'
import { useMainBus } from '../../core/messaging/main/react'
import { CoreCta } from '../core-cta'
import { CoreTextMarkdown } from '../core-text-markdown'
import { Drawer } from '../global-drawer'
import { useDialog } from './context'
import styles from './style.module.scss'

const DRAWER_ID = 'confirm-dialog'

const defaultTranslations = {
  title: '',
  description: '',
  confirmButton: '',
  cancelButton: ''
}

export const GlobalDialog: FC = () => {
  const { isOpen, handleConfirm, handleCancel, translations } = useDialog()
  const id = useId()
  const titleId = `confirm-dialog-title-${id}`
  const descriptionId = `confirm-dialog-description-${id}`
  const isClosingRef = useRef(false)
  const prevIsOpenRef = useRef(false)

  const bus = useMainBus(
    DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
    useCallback(
      (event) => {
        if (event.details.id === DRAWER_ID || event.details.id === undefined) {
          if (!isClosingRef.current) {
            handleCancel()
          }
        }
      },
      [handleCancel]
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
      isClosingRef.current = false
    }
  }, [isOpen, bus])

  useEffect(() => {
    if (isOpen && translations?.klaviyoFormId) {
      const timer = setTimeout(() => {
        try {
          const w = window as any
          if (w.Klaviyo && typeof w.Klaviyo.push === 'function') {
            w.Klaviyo.push(['refresh'])
          }
        } catch (err) {
          console.error('Error refreshing Klaviyo form:', err)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen, translations?.klaviyoFormId])

  const onConfirm = useCallback(() => {
    handleConfirm().catch((error) => {
      console.error('Error in dialog confirm handler:', error)
    })
  }, [handleConfirm])

  // Always render Drawer so it can properly send close messages
  return (
    <Drawer id={DRAWER_ID} layoutType="dialog" className={styles.dialog}>
      {!translations?.klaviyoFormId && (
        <h2 id={titleId} className={styles.dialog__title}>
          {translations?.title ?? defaultTranslations.title}
        </h2>
      )}
      {translations?.klaviyoFormId ? (
        <div
          className={`klaviyo-form-${translations.klaviyoFormId}`}
          style={{ marginTop: '16px', minHeight: '300px' }}
        />
      ) : (
        <>
          <div id={descriptionId} className={styles.dialog__description}>
            <CoreTextMarkdown type="rte">
              {translations?.description ?? defaultTranslations.description}
            </CoreTextMarkdown>
          </div>
          <div className={styles.dialog__actions}>
            <CoreCta
              className={styles.dialog__submit}
              href={null}
              onClick={onConfirm}
              text={
                translations?.confirmButton ?? defaultTranslations.confirmButton
              }
              layoutType="button"
              styleType="black"
              sizeType="medium"
            />
            <CoreCta
              href={null}
              onClick={handleCancel}
              text={translations?.cancelButton ?? defaultTranslations.cancelButton}
              layoutType="underline"
              styleType="black"
              sizeType="medium"
            />
          </div>
        </>
      )}
    </Drawer>
  )
}

export {
  DialogProvider,
  type DialogTranslations,
  type ShowDialogOptions,
  useDialog
} from './context'
