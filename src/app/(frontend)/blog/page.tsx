import { cache } from 'react'
import { ErrorMessage } from '../../../components/error-message'
import { TemplateBlogListingPage } from '../../../components/template-blog-listing-page'
import { initDatoSdk } from '../../../core/dato/sdk'
import { logger } from '../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

const getBlogPostsData = cache(async (categoryId?: string) => {
  const sdk = initDatoSdk()
  if (categoryId && categoryId !== 'all-posts') {
    return await sdk.getPostsByCategory({ categoryId })
  }
  return await sdk.getPosts()
})

const getCategoriesData = cache(async () => {
  const sdk = initDatoSdk()
  return await sdk.getAllCategories()
})

export default async function BlogListingPage() {
  try {
    const response = await getBlogPostsData()
    const categories = await getCategoriesData()
    logger.info(
      {
        response,
        categories: categories
      },
      'Blog listing response:'
    )

    return (
      <TemplateBlogListingPage
        data={response}
        categories={categories}
        selectedCategory={null}
        currentPage={1}
      />
    )
  } catch (err) {
    logger.error({ error: err }, 'Blog listing request failed')
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to load blog listing'
    return <ErrorMessage message={errorMessage} />
  }
}
