'use client'

import { useTranslations } from 'next-intl'

type Props = {
  query: string
}

export const NoResults = ({ query }: Props) => {
  const t = useTranslations('search.drawer.no_results')

  return (
    <div>
      <p>{t('message', { query })}</p>
    </div>
  )
}
