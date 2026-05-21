/**
 * HTML safety validation for CMS-sourced embed content only.
 * Use only when the HTML comes from CMS input (e.g. Dato iframe/embed fields).
 * Do not use for trusted source (e.g. JSON from our own code).
 */

/** Patterns that indicate unsafe HTML (XSS). Reject embed if any match. */
const UNSAFE_HTML_PATTERNS = [
  /<script\b/i,
  /javascript\s*:/i,
  /(?:^|[\s<])on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i,
  /<\s*\/\s*script/i
]

/** HTML entity map for decoding common entities */
const HTML_ENTITY_MAP: Record<string, string> = {
  '&lt;': '<',
  '&gt;': '>',
  '&amp;': '&',
  '&quot;': '"',
  '&#39;': "'"
}

const HTML_ENTITY_PATTERN = /&(?:lt|gt|amp|quot|#39);/g

/**
 * Unwraps DatoCMS markdown-processed embed content.
 * When a text field is returned with markdown processing, DatoCMS wraps
 * the content in <p> tags and escapes HTML entities. This reverses that
 * so the raw HTML embed (e.g. iframe) can be rendered.
 */
const unwrapMarkdownProcessedEmbed = (html: string): string => {
  let result = html

  // Strip wrapping <p> tags (DatoCMS markdown processing)
  const pTagMatch = /^\s*<p>([\s\S]*)<\/p>\s*$/i.exec(result)
  if (pTagMatch?.[1]) {
    result = pTagMatch[1]
  }

  // Decode HTML entities if the content has escaped angle brackets
  if (HTML_ENTITY_PATTERN.test(result)) {
    result = result.replace(
      HTML_ENTITY_PATTERN,
      (entity) => HTML_ENTITY_MAP[entity] ?? entity
    )
  }

  return result.trim()
}

export type ValidateHtmlForEmbedResult =
  | { safe: true; html: string }
  | { safe: false; error: string }

export type ValidateHtmlForEmbedOptions = {
  /** When true, content must be a single iframe element (e.g. form iframeEmbed). */
  requireIframe?: boolean
}

/** Matches content that is (after optional whitespace) an iframe opening tag */
const IFRAME_START_PATTERN = /^\s*<iframe\b/i

/**
 * Validates CMS-sourced HTML before rendering via dangerouslySetInnerHTML.
 * Rejects content that contains script tags, javascript: URLs, or event handlers.
 *
 * Handles DatoCMS markdown-processed content by unwrapping <p> tags and
 * decoding HTML entities before validation.
 *
 * Use only for HTML from CMS input (e.g. form iframeEmbed, section embedCode).
 * Do not use for trusted source such as JSON.stringify or safeJsonStringify.
 *
 * @param html - Raw HTML string from CMS (e.g. iframe embed code from Dato)
 * @param options - Optional: requireIframe to require content to be an iframe
 * @returns Result with safe HTML to render, or an error when unsafe
 */
export const validateHtmlForEmbed = (
  html: string,
  options?: ValidateHtmlForEmbedOptions
): ValidateHtmlForEmbedResult => {
  const unwrapped = unwrapMarkdownProcessedEmbed(html)

  if (unwrapped.length === 0) {
    return { safe: false, error: 'Empty content' }
  }

  const isUnsafe = UNSAFE_HTML_PATTERNS.some((pattern) =>
    pattern.test(unwrapped)
  )

  if (isUnsafe) {
    return {
      safe: false,
      error: 'Unsafe HTML: script or event handler detected'
    }
  }

  if (
    options?.requireIframe === true &&
    !IFRAME_START_PATTERN.test(unwrapped)
  ) {
    return {
      safe: false,
      error: 'Content must be an iframe'
    }
  }

  return { safe: true, html: unwrapped }
}

/**
 * Returns true if the CMS-sourced HTML string is safe to render as embed.
 * Use validateHtmlForEmbed when you need the trimmed HTML or an error message.
 */
export const isHtmlSafeForEmbed = (html: string): boolean => {
  return validateHtmlForEmbed(html).safe
}
