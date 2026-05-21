import { getTranslations } from 'next-intl/server'
import { cache } from 'react'
import { ErrorMessage } from '../../../../../components/error-message'
import { TemplateBlogListingPage } from '../../../../../components/template-blog-listing-page'
import { initDatoSdk } from '../../../../../core/dato/sdk'
import { logger } from '../../../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

type Props = {
  params: Promise<{
    handle: string
  }>
}

const getAllCategoriesData = cache(async () => {
  const sdk = initDatoSdk()
  return await sdk.getAllCategories()
})

const getPostsByCategoryData = cache(async (categoryId: string) => {
  const sdk = initDatoSdk()
  return await sdk.getPostsByCategory({ categoryId })
})

export default async function BlogCategoryPage({ params }: Props) {
  try {
    const { handle } = await params

    const categoriesResponse = await getAllCategoriesData()
    const category = categoriesResponse.allCategories.find(
      (cat) => cat.model?.handle === handle
    )

    if (!category) {
      logger.warn({ handle }, 'Category not found')
      const t = await getTranslations('error_message')
      return <ErrorMessage message={t('category_not_found', { handle })} />
    }

    const response = await getPostsByCategoryData(category.id)

    logger.info(
      {
        response,
        categoryHandle: handle,
        categoryId: category.id
      },
      'Blog category response:'
    )

    return (
      <TemplateBlogListingPage
        data={response}
        categories={categoriesResponse}
        selectedCategory={category ?? null}
        currentPage={1}
      />
    )
  } catch (err) {
    logger.error({ error: err }, 'Blog category request failed')
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to load blog category'
    return <ErrorMessage message={errorMessage} />
  }
}
