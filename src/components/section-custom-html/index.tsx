'use client'

import clsx from 'clsx'
import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { getSectionId } from '../../core/string/get-section-id'
import { getSectionConfigClasses } from '../../utils/get-section-config-classes'
import { getSectionConfigStyles } from '../../utils/get-section-config-styles'
import styles from './style.module.scss'

export type SectionCustomHtmlData = {
  id?: string
  title?: string | null
  subtitle?: string | null
  html?: string | null
  css?: string | null
  js?: string | null
  javascript?: string | null
  config?: {
    id?: string
    customId?: string | null
    enabled?: boolean
    mode?: string | null
    highlightColor?: string | null
    contrastColor?: string | null
    addBottomBorder?: boolean
    addFlagPattern?: boolean
  } | null
}

export type SectionCustomHtmlProps = {
  data: SectionCustomHtmlData
  isFirstSection?: boolean
}

export const SectionCustomHtml: FC<SectionCustomHtmlProps> = ({
  data,
  isFirstSection
}) => {
  const HeadingTag = isFirstSection ? 'h1' : 'h2'
  const containerRef = useRef<HTMLDivElement>(null)
  const { config, id, title, subtitle, html, css, js, javascript } = data

  const scriptCode = js || javascript

  useEffect(() => {
    if (!scriptCode || !containerRef.current) {
      return
    }

    try {
      const scriptEl = document.createElement('script')
      scriptEl.type = 'text/javascript'
      scriptEl.textContent = scriptCode
      containerRef.current.appendChild(scriptEl)

      return () => {
        if (scriptEl.parentNode) {
          scriptEl.parentNode.removeChild(scriptEl)
        }
      }
    } catch (err) {
      console.error('Error executing Custom JS in SectionCustomHtml:', err)
    }
  }, [scriptCode])

  return (
    <section
      id={getSectionId(config?.customId, id)}
      className={clsx(
        styles.section,
        'custom-html-section',
        ...getSectionConfigClasses(config, styles)
      )}
      style={getSectionConfigStyles(config)}
      data-ga-section-name="section-custom-html"
    >
      {css && <style>{css}</style>}

      <div className={clsx(styles.container, 'custom-html-container')} ref={containerRef}>
        {(title || subtitle) && (
          <div className={clsx(styles.header, 'custom-html-header')}>
            {title && <HeadingTag className={clsx(styles.title, 'custom-html-title')}>{title}</HeadingTag>}
            {subtitle && <p className={clsx(styles.subtitle, 'custom-html-subtitle')}>{subtitle}</p>}
          </div>
        )}

        {html && (
          <div
            className={clsx(styles.content, 'custom-html-content')}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </section>
  )
}
