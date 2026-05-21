'use client'

import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { DRAWER_REQUEST_CLOSE_MESSAGE_NAME } from '../../core/messaging/main/messages/close-drawer'
import { DRAWER_CLOSE_MESSAGE_NAME } from '../../core/messaging/main/messages/drawer-close'
import { DRAWER_OPEN_MESSAGE_NAME } from '../../core/messaging/main/messages/set-active-drawer'
import { useMainBus } from '../../core/messaging/main/react'
import { CoreIcon } from '../core-icon'
import styles from './style.module.scss'

type Props = {
  id: string
  title?: string
  children: React.ReactNode
  className?: string
  panelClassName?: string
  contentClassName?: string
  layoutType?: 'default' | 'search' | 'dialog' | 'cart'
}

export const Drawer = ({
  id,
  title,
  children,
  className,
  panelClassName,
  contentClassName,
  layoutType = 'default'
}: Props) => {
  const t = useTranslations('global_drawer')
  const [isOpen, setIsOpen] = useState(false)
  const [wasOpen, setWasOpen] = useState(false)
  const drawerPanelRef = useRef<HTMLDivElement>(null)

  const bus = useMainBus(
    DRAWER_OPEN_MESSAGE_NAME,
    useCallback(
      (event) => {
        if (event.details.id === id) {
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      },
      [id]
    )
  )

  useEffect(() => {
    if (wasOpen && !isOpen) {
      const drawerPanel = document.querySelector(`[data-drawer-id="${id}"]`)
      if (drawerPanel) {
        const handleTransitionEnd = () => {
          bus.send({
            name: DRAWER_CLOSE_MESSAGE_NAME,
            details: { id }
          })
        }
        drawerPanel.addEventListener('transitionend', handleTransitionEnd, {
          once: true
        })
        return () => {
          drawerPanel.removeEventListener('transitionend', handleTransitionEnd)
        }
      }
    }
    setWasOpen(isOpen)
  }, [isOpen, wasOpen, id, bus])

  const handleClose = useCallback(() => {
    bus.send({
      name: DRAWER_REQUEST_CLOSE_MESSAGE_NAME,
      details: { id }
    })
  }, [id, bus])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleClose])

  useEffect(() => {
    if (isOpen) {
      const body = document.body
      const html = document.documentElement
      const originalBodyOverflow = window.getComputedStyle(body).overflow
      const originalHtmlOverflow = window.getComputedStyle(html).overflow
      body.style.overflow = 'hidden'
      html.style.overflow = 'hidden'
      return () => {
        body.style.overflow = originalBodyOverflow
        html.style.overflow = originalHtmlOverflow
      }
    }
  }, [isOpen])

  return (
    <div
      className={clsx(
        styles.drawer,
        isOpen && styles['drawer--open'],
        styles[`drawer--${layoutType}`],
        className
      )}
      aria-hidden={!isOpen}
    >
      <div
        className={styles.drawer__overlay}
        onClick={handleClose}
        aria-hidden="true"
      />

      {layoutType === 'search' && (
        <button
          type="button"
          className={styles.drawer__close}
          onClick={handleClose}
          aria-label={t('aria.close')}
        >
          <CoreIcon icon="close" />
        </button>
      )}

      <div
        ref={drawerPanelRef}
        className={clsx(styles.drawer__panel, panelClassName)}
        data-drawer-id={id}
        role="dialog"
        aria-modal="true"
      >
        {(layoutType === 'default' || layoutType === 'cart') && (
          <div className={styles.drawer__header}>
            {title && <h2 className={styles.drawer__title}>{title}</h2>}

            <button
              type="button"
              className={styles.drawer__close}
              onClick={handleClose}
              aria-label={t('aria.close')}
            >
              <CoreIcon icon="close" />
            </button>
          </div>
        )}

        <div className={clsx(styles.drawer__content, contentClassName)}>
          {layoutType === 'dialog' && (
            <button
              type="button"
              className={styles.drawer__close}
              onClick={handleClose}
              aria-label={t('aria.close')}
            >
              <CoreIcon icon="close" />
            </button>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
