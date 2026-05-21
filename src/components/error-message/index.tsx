import { getTranslations } from 'next-intl/server'

type Props = {
  message?: string
}

export const ErrorMessage = async ({ message }: Props) => {
  const t = await getTranslations('error_message')
  const errorMessage = message ?? t('general')

  return (
    <div>
      <p>{errorMessage}</p>
    </div>
  )
}
