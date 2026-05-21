'use client'

import clsx from 'clsx'
import type { FC } from 'react'
import { useCallback } from 'react'
import { initMainBus } from '../../core/messaging/main'
import { CoreIcon } from '../core-icon'
import { useFormDialog } from '../global-form-dialog/context'
import { Anchor } from './components/anchor'
import { Button } from './components/button'
import type { CoreCtaFragment } from './core-cta.typegen'
import {
  OPEN_FORM_ACTION_NAME,
  sendMessageBusAction
} from './helpers/send-message-bus-action'
import {
  type ButtonType,
  buttonTypeParser,
  type LayoutType,
  layoutTypeParser,
  type SizeType,
  type StyleType,
  sizeTypeParser,
  styleTypeParser,
  type TargetType,
  targetTypeParser
} from './io'
import styles from './style.module.scss'

export type Props = {
  data?: CoreCtaFragment
  layoutType?: LayoutType
  styleType?: StyleType
  sizeType?: SizeType
  text?: string | null
  href?: string | null
  target?: TargetType
  type?: ButtonType
  style?: string | null
  onClick?: () => void
  className?: string
  tabIndex?: number
  ariaLabel?: string | null
  icon?: string | null
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
  disabled?: boolean
  inert?: boolean
}

export const CoreCta: FC<Props> = ({ data, ...props }) => {
  const mainBus = initMainBus()
  const { openFormDialog } = useFormDialog()
  const {
    style: datoLayout,
    size: datoSize,
    title: datoTitle,
    seoTitle: datoSeoTitle,
    colorType: datoColorType,
    target: datoTarget,
    path: datoPath,
    link: datoLink,
    action: datoAction,
    actionDetail: datoActionDetail,
    icon: datoIcon
  } = data ?? {}
  const {
    layoutType,
    styleType,
    sizeType,
    text,
    href,
    target,
    type,
    onClick,
    className,
    tabIndex,
    ariaLabel,
    icon,
    iconPosition,
    children,
    disabled,
    inert = false
  } = props

  const _sizeType: SizeType = sizeTypeParser(sizeType ?? datoSize)
  const _layoutType: LayoutType = layoutTypeParser(layoutType ?? datoLayout)
  const _styleType: StyleType = styleTypeParser(styleType ?? datoColorType)
  const _targetType: TargetType = targetTypeParser(target ?? datoTarget)
  const _buttonType: ButtonType = buttonTypeParser(type)
  const _icon = icon ?? datoIcon
  const _text = text ?? datoTitle
  const _datoHandle = datoLink?.entry?.handle
  const formHandle =
    datoAction === OPEN_FORM_ACTION_NAME ? (datoActionDetail?.trim() ?? '') : ''
  const isOpenFormAction =
    datoAction === OPEN_FORM_ACTION_NAME && formHandle.length > 0
  // If href is set to null, or action is open:form (to avoid dialog + navigation), we render a button
  const isButton = href === null || isOpenFormAction
  const _href = href ?? (_datoHandle ? `/${_datoHandle}` : (datoPath ?? ''))

  // Handle message bus actions
  const handleMessageBusAction = useCallback(() => {
    if (isOpenFormAction) {
      openFormDialog(formHandle)
      return
    }

    sendMessageBusAction(datoAction, datoActionDetail, mainBus)
  }, [
    datoAction,
    datoActionDetail,
    mainBus,
    openFormDialog,
    isOpenFormAction,
    formHandle
  ])

  // Combine onClick handlers
  const handleClick = useCallback(() => {
    handleMessageBusAction()
    onClick?.()
  }, [handleMessageBusAction, onClick])

  if (!_text && !children) {
    return null
  }

  if (inert) {
    return (
      <span
        className={clsx(className, styles[`coreCta--${_layoutType}`])}
        data-layout={_layoutType}
        data-style={_styleType}
        data-size={_sizeType}
        aria-hidden="true"
      >
        {children ?? (
          <>
            {iconPosition === 'left' && _icon && <CoreIcon icon={_icon} />}
            {_text}
            {iconPosition === 'right' && _icon && <CoreIcon icon={_icon} />}
          </>
        )}
      </span>
    )
  }

  if (isButton) {
    return (
      <Button
        {...props}
        text={_text ?? ''}
        type={_buttonType}
        layoutType={_layoutType}
        styleType={_styleType}
        sizeType={_sizeType}
        onClick={handleClick}
        className={className}
        tabIndex={tabIndex}
        icon={_icon}
        iconPosition={iconPosition}
        ariaLabel={ariaLabel || datoSeoTitle}
        disabled={disabled}
      >
        {children}
      </Button>
    )
  }

  return _href ? (
    <Anchor
      {...props}
      text={_text ?? ''}
      href={_href}
      layoutType={_layoutType}
      styleType={_styleType}
      sizeType={_sizeType}
      target={_targetType}
      onClick={handleClick}
      className={className}
      tabIndex={tabIndex}
      icon={_icon}
      iconPosition={iconPosition}
      ariaLabel={ariaLabel || datoSeoTitle}
    >
      {children}
    </Anchor>
  ) : (
    <Button
      {...props}
      text={_text ?? ''}
      type={_buttonType}
      layoutType={_layoutType}
      styleType={_styleType}
      sizeType={_sizeType}
      onClick={handleClick}
      className={className}
      tabIndex={tabIndex}
      icon={_icon}
      iconPosition={iconPosition}
      ariaLabel={ariaLabel || datoSeoTitle}
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
