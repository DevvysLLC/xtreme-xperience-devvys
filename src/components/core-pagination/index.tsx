import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import type { FC } from 'react'
import { CoreCta } from '../core-cta'
import { CoreIcon } from '../core-icon'
import style from './style.module.scss'

export type CorePaginationProps = {
  currentPage: number
  totalPages: number
  getPageUrl: (page: number) => string
  className?: string
}

const getPageNumbers = (
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] => {
  const pages: (number | 'ellipsis')[] = []
  const maxVisible = 5

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1)
      pages.push('ellipsis')
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('ellipsis')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    }
  }

  return pages
}

export const CorePagination: FC<CorePaginationProps> = async ({
  currentPage,
  totalPages,
  getPageUrl,
  className
}) => {
  const t = await getTranslations('core_pagination')

  if (totalPages <= 1) {
    return null
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <nav className={clsx(style.pagination, className)} aria-label={t('label')}>
      <CoreCta
        className={clsx(
          style.button,
          currentPage === 1 && style['is-disabled']
        )}
        href={currentPage === 1 ? null : getPageUrl(currentPage - 1)}
        layoutType="pill"
        sizeType="medium"
        styleType="black-transparent"
        aria-disabled={currentPage === 1}
      >
        <CoreIcon icon="chevron-left" />

        <span className={style.button__text}>{t('previous')}</span>
      </CoreCta>

      <ul className={style.list}>
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <li key={`ellipsis-${index}`} className={style.list__ellipsis}>
                <span>...</span>
              </li>
            )
          }
          return (
            <li key={page}>
              <CoreCta
                className={clsx(
                  style.list__item,
                  currentPage === page && style['is-active']
                )}
                href={currentPage === page ? null : getPageUrl(page)}
                layoutType="pill"
                sizeType="medium"
                styleType="black-transparent"
                type="button"
                aria-current={currentPage === page ? 'page' : undefined}
                text={page.toString()}
              />
            </li>
          )
        })}
      </ul>
      <CoreCta
        className={clsx(
          style.button,
          currentPage === totalPages && style['is-disabled']
        )}
        href={currentPage === totalPages ? null : getPageUrl(currentPage + 1)}
        layoutType="pill"
        sizeType="medium"
        styleType="black-transparent"
        aria-disabled={currentPage === totalPages}
      >
        <span className={style.button__text}>{t('next')}</span>

        <CoreIcon icon="chevron-right" />
      </CoreCta>
    </nav>
  )
}
