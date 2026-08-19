'use client'

import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import type { GetGlobalConfigQuery } from '../../../core/dato/sdk/blueprint'
import { useScrollToBottom } from '../../../features/scroll'
import { getHref } from '../../../utils/get-href'
import { CoreCta } from '../../core-cta'
import { useHeaderScroll } from '../../global-header/hooks/use-header-scroll'
import styles from '../style.module.scss'
import { GlobalTrackFinderWidget } from './widget'
import { useStickyBarStore } from '../../../core/sticky-bar/store'
import { CoreCountdown } from '../../core-countdown'

type StickyBarContentProps = {
  hideBookingBarOnPaths: string | null | undefined
  stickyTrackFinderHeading: string | null | undefined
  stickyTrackFinderLinks:
    | NonNullable<
        NonNullable<
          GetGlobalConfigQuery['globalConfig']
        >['stickyTrackFinderLinks']
      >
    | null
    | undefined
}

type NavigationItem = NonNullable<
  NonNullable<
    NonNullable<GetGlobalConfigQuery['globalConfig']>['stickyTrackFinderLinks']
  >['children'][number]
>

const normalizePath = (path: string): string => {
  const trimmedPath = path.trim()

  if (trimmedPath === '' || trimmedPath === '/') {
    return '/'
  }

  const prefixedPath = trimmedPath.startsWith('/')
    ? trimmedPath
    : `/${trimmedPath}`

  return prefixedPath.replace(/\/+$/, '')
}

export const StickyBarContent: React.FC<StickyBarContentProps> = ({
  hideBookingBarOnPaths,
  stickyTrackFinderHeading,
  stickyTrackFinderLinks
}) => {
  const pathname = usePathname()
  const isAtBottom = useScrollToBottom()
  const { isOffscreen, isScrolled } = useHeaderScroll()
  const override = useStickyBarStore((s) => s.override)
  const normalizedPathname = normalizePath(pathname)
  const hiddenPaths = (hideBookingBarOnPaths ?? '')
    .split(',')
    .map((path) => path.trim())
    .filter((path) => path.length > 0)
    .map(normalizePath)

  if (hiddenPaths.includes(normalizedPathname)) {
    return null
  }

  // Show sticky bar if there's a location track AND not at the bottom AND header is offscreen
  const headerIsOffscreen = isScrolled && isOffscreen
  const shouldShowStickyBar = !isAtBottom && headerIsOffscreen

  // Campaign Override Layout
  if (override?.enableCampaignStickyBar) {
    return (
      <div
        className={clsx(
          styles.stickyBar,
          styles['stickyBar--campaign'],
          shouldShowStickyBar && styles['stickyBar--open']
        )}
      >
        <div className={styles.stickyBar__wrapper}>
          <div className={styles.campaignContent}>
            {override.campaignStickyBarHeading && (
              <span className={styles.campaignContent__heading}>
                {override.campaignStickyBarHeading}
              </span>
            )}
            {override.campaignStickyBarTimerEnd && (
              <div className={styles.campaignContent__timer}>
                <CoreCountdown
                  data={{
                    end: override.campaignStickyBarTimerEnd,
                    showDays: true
                  }}
                />
              </div>
            )}
          </div>
          {override.campaignStickyBarCtaTitle && (
            <div className={styles.campaignCta}>
              <CoreCta
                text={override.campaignStickyBarCtaTitle}
                href={override.campaignStickyBarCtaLink ?? '#'}
                layoutType="button"
                styleType="orange"
                sizeType="small"
                className={styles.campaignCta__button}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={clsx(
        styles.stickyBar,
        shouldShowStickyBar && styles['stickyBar--open']
      )}
    >
      <div className={styles.stickyBar__wrapper}>
        <div className={styles.stickyBar__content}>
          {stickyTrackFinderHeading && (
            <span className={styles.stickyBar__title}>
              {stickyTrackFinderHeading}
            </span>
          )}
          {stickyTrackFinderLinks?.children &&
            stickyTrackFinderLinks.children.length > 0 && (
              <ul className={styles.stickyBar__navigation}>
                {stickyTrackFinderLinks.children
                  .filter((link): link is NavigationItem => link !== null)
                  .map((link) => (
                    <li
                      className={styles.stickyBar__navigation__item}
                      key={link?.id}
                    >
                      <CoreCta
                        text={link?.label ?? ''}
                        href={getHref(link)}
                        layoutType="underline"
                        styleType="black"
                        sizeType="small"
                      />
                    </li>
                  ))}
              </ul>
            )}
        </div>
        <GlobalTrackFinderWidget layout="sticky-bar" />
      </div>
    </div>
  )
}
