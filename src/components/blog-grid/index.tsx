import clsx from 'clsx'
import type { FC } from 'react'
import type { PostFragment } from '../../core/dato/fragments/post.typegen'
import { BlogCard } from '../blog-card'
import style from './style.module.scss'

export type BlogGridProps = {
  posts: PostFragment[]
  featuredLayout?: boolean
}

export const BlogGrid: FC<BlogGridProps> = (props) => {
  const { posts, featuredLayout } = props

  return (
    <div
      className={clsx(
        style.container,
        featuredLayout && style['container--featured']
      )}
    >
      {posts.map((post) => {
        return <BlogCard key={post.id} post={post} />
      })}
    </div>
  )
}
