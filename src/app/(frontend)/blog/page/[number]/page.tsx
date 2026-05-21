import { notFound } from 'next/navigation'
import { cache } from 'react'
import { ErrorMessage } from '../../../../../components/error-message'
import { TemplateBlogListingPage } from '../../../../../components/template-blog-listing-page'
import {
  POSTS_PER_PAGE,
  POSTS_PER_PAGE_FIRST
} from '../../../../../config/settings'
import { initDatoSdk } from '../../../../../core/dato/sdk'
import { logger } from '../../../../../core/logger/logger'

// Revalidate page data every 60 seconds for faster server responses
export const revalidate = 60

type Props = {
  params: Promise<{
    number: string
  }>
}

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

export default async function BlogListingPagePaginated({ params }: Props) {
  try {
    const { number } = await params
    const pageNumber = Number.parseInt(number, 10)
    if (Number.isNaN(pageNumber) || pageNumber < 1) {
      notFound()
    }

    const response = await getBlogPostsData()
    const categories = await getCategoriesData()

    const allPostsExcludingFeatured = response.allPosts.filter(
      (post) =>
        post?.id !== response.allPosts.find((p) => p?.model?.featured)?.id
    )
    const remainingAfterFirst =
      allPostsExcludingFeatured.length - POSTS_PER_PAGE_FIRST
    const totalPages =
      remainingAfterFirst <= 0
        ? 1
        : 1 + Math.ceil(remainingAfterFirst / POSTS_PER_PAGE)

    if (pageNumber > totalPages) {
      notFound()
    }

    logger.info(
      {
        response,
        categories: categories,
        pageNumber
      },
      'Blog listing response:'
    )

    return (
      <TemplateBlogListingPage
        data={response}
        categories={categories}
        selectedCategory={null}
        currentPage={pageNumber}
      />
    )
  } catch (err) {
    logger.error({ error: err }, 'Blog listing request failed')
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to load blog listing'
    return <ErrorMessage message={errorMessage} />
  }
}
