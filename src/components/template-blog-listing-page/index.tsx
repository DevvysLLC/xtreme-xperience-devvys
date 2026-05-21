import clsx from 'clsx'
import { getTranslations } from 'next-intl/server'
import { POSTS_PER_PAGE, POSTS_PER_PAGE_FIRST } from '../../config/settings'
import { BlogGrid } from '../blog-grid'
import { BlogHero } from '../blog-hero'
import { CoreCta } from '../core-cta'
import { CorePagination } from '../core-pagination'
import { StructuredData } from '../structured-data'
import type { GetAllCategoriesQuery } from './get-all-categories.typegen'
import type { GetPostsQuery } from './get-posts.typegen'
import style from './style.module.scss'

export type TemplateBlogListingPageProps = {
  data: GetPostsQuery
  categories: GetAllCategoriesQuery
  selectedCategory: GetAllCategoriesQuery['allCategories'][number] | null
  loading?: boolean
  currentPage?: number
  /**
   * SEO data for the blog listing page
   */
  seo?: {
    title?: string | null
    description?: string | null
    image?: {
      url: string
      alt?: string | null
      width?: number | null
      height?: number | null
    } | null
  } | null
}

const BLOG_LISTING_ID = 'blog-listing'

export const TemplateBlogListingPage = async ({
  data,
  categories,
  selectedCategory,
  loading = false,
  currentPage: currentPageProp = 1,
  seo
}: TemplateBlogListingPageProps) => {
  const t = await getTranslations('template_blog_listing_page')
  const { allPosts } = data

  const currentPage = currentPageProp

  // Build pathname for structured data
  const categoryHandle = selectedCategory?.model?.handle
  let pathname = '/blog'
  if (categoryHandle) {
    pathname = `/blog/category/${categoryHandle}`
  }
  if (currentPage > 1) {
    pathname = `${pathname}/page/${currentPage}`
  }

  // Build breadcrumbs
  const breadcrumbs: { name: string; url?: string }[] = [
    { name: 'Home', url: '/' },
    {
      name: 'Blog',
      url: categoryHandle || currentPage > 1 ? '/blog' : undefined
    }
  ]
  if (categoryHandle && selectedCategory?.model?.title) {
    breadcrumbs.push({
      name: selectedCategory.model.title,
      url: currentPage > 1 ? `/blog/category/${categoryHandle}` : undefined
    })
  }

  const featuredPost =
    allPosts.find((post) => post?.model?.featured) || allPosts[0]
  const allPostsExcludingFeatured = allPosts.filter(
    (post) => post?.id !== featuredPost?.id
  )

  const totalPosts = allPostsExcludingFeatured.length
  const remainingAfterFirst = totalPosts - POSTS_PER_PAGE_FIRST
  const totalPages =
    remainingAfterFirst <= 0
      ? 1
      : 1 + Math.ceil(remainingAfterFirst / POSTS_PER_PAGE)

  const paginatedPosts =
    currentPage === 1
      ? allPostsExcludingFeatured.slice(0, POSTS_PER_PAGE_FIRST)
      : allPostsExcludingFeatured.slice(
          POSTS_PER_PAGE_FIRST + (currentPage - 2) * POSTS_PER_PAGE,
          POSTS_PER_PAGE_FIRST + (currentPage - 1) * POSTS_PER_PAGE
        )

  const getPageUrl = (page: number): string => {
    let basePath = '/blog'

    if (selectedCategory?.model?.handle) {
      basePath = `/blog/category/${selectedCategory.model.handle}`
    }

    if (page === 1) {
      return `${basePath}#${BLOG_LISTING_ID}`
    } else {
      return `${basePath}/page/${page}#${BLOG_LISTING_ID}`
    }
  }

  if (allPosts.length === 0) {
    return <div>{t('no_posts')}</div>
  }

  return (
    <>
      <StructuredData
        pathname={pathname}
        seo={{
          title: seo?.title,
          description: seo?.description,
          image: seo?.image ?? null
        }}
        breadcrumbs={breadcrumbs}
      />
      {featuredPost?.model && currentPage === 1 && (
        <BlogHero post={featuredPost} context="listing" />
      )}
      <section id={BLOG_LISTING_ID} className={style.container}>
        <h2 className={style.title}>{t('title')}</h2>
        <ul className={style.categoryList}>
          <li key="category-all-posts">
            <CoreCta
              className={clsx(
                style.categoryLink,
                selectedCategory === null ? style['is-active'] : ''
              )}
              href={`/blog#${BLOG_LISTING_ID}`}
              layoutType="pill"
              sizeType="medium"
              styleType="white"
              type="button"
              aria-disabled={loading}
              text={t('all_posts')}
            />
          </li>
          {categories.allCategories.map((category) => {
            const handle = category.model?.handle
            return (
              <li key={`category-${category.id}`}>
                <CoreCta
                  className={clsx(
                    style.categoryLink,
                    selectedCategory && selectedCategory.id === category.id
                      ? style['is-active']
                      : ''
                  )}
                  href={
                    handle
                      ? `/blog/category/${handle}#${BLOG_LISTING_ID}`
                      : null
                  }
                  layoutType="pill"
                  sizeType="medium"
                  styleType="white"
                  type="button"
                  aria-disabled={loading || !handle}
                  text={category.model?.title}
                />
              </li>
            )
          })}
        </ul>
        {loading ? (
          <div>{t('loading')}</div>
        ) : allPostsExcludingFeatured.length > 0 ? (
          <>
            {paginatedPosts.length > 0 && (
              <BlogGrid
                posts={paginatedPosts}
                featuredLayout={currentPage === 1}
              />
            )}

            <CorePagination
              currentPage={currentPage}
              totalPages={totalPages}
              getPageUrl={getPageUrl}
              className={style.pagination}
            />
          </>
        ) : (
          <div>{t('no_posts')}</div>
        )}
      </section>
    </>
  )
}
