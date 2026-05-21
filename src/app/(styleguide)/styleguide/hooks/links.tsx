'use client'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'

export type Link = {
  href: string
  label: string
}

export type LinksList = {
  group: string
  links: Link[]
}

export type LinkByPath = {
  group: string
  label: string
}

/**
 * Custom hook that provides styleguide navigation links with translations
 */
export const useStyleguideLinks = () => {
  const t = useTranslations('styleguide')

  const linksList: LinksList[] = useMemo(
    () => [
      {
        group: t('getting_started'),
        links: [{ href: '/styleguide/', label: t('overview') }]
      },
      {
        group: t('styles'),
        links: [
          { href: '/styleguide/typography', label: t('typography.title') },
          { href: '/styleguide/spacing', label: t('spacing.title') },
          { href: '/styleguide/colors', label: t('colors.title') },
          { href: '/styleguide/buttons', label: t('buttons.title') },
          { href: '/styleguide/iconography', label: t('iconography.title') },
          { href: '/styleguide/components', label: t('components.title') }
        ]
      }
    ],
    [t]
  )

  const findLinkByPath = useCallback(
    (pathname: string): LinkByPath | undefined => {
      // Sort by href length descending to match more specific routes first
      // This prevents '/styleguide/' from matching before '/styleguide/typography'
      const sortedLinks = linksList.flatMap((group) =>
        group.links.map((link) => ({
          ...link,
          group: group.group,
          hrefLength: link.href.length
        }))
      )
      sortedLinks.sort((a, b) => b.hrefLength - a.hrefLength)

      for (const linkItem of sortedLinks) {
        if (
          pathname === linkItem.href ||
          pathname.startsWith(linkItem.href + '/')
        ) {
          return {
            group: linkItem.group,
            label: linkItem.label
          }
        }
      }
      return undefined
    },
    [linksList]
  )

  return {
    linksList,
    findLinkByPath
  }
}
