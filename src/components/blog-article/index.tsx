import type { FC } from 'react'
import type { PostFragment } from '../../core/dato/fragments/post.typegen'
import { CoreStructuredText } from '../core-structured-text'
import style from './style.module.scss'

export type BlogArticleProps = {
  post: PostFragment
}

export const BlogArticle: FC<BlogArticleProps> = ({ post }) => {
  const { model } = post

  if (!model) {
    return null
  }

  return (
    <article className={style.BlogArticle}>
      {model.title && (
        <h1 className={style.BlogArticle__title}>{model.title}</h1>
      )}
      {model.body && <CoreStructuredText data={model.body} />}
    </article>
  )
}
