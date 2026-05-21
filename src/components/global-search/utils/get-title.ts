import type { SearchDocument } from '../io'

type DocumentType = 'supercar' | 'track' | 'page'

type GetTitleOptions = {
  missingTitleFallback?: string
}

type ConfigWithTitle = {
  title?: string | null
}

type ModelWithTitle = {
  title?: string | null
}

const isConfigWithTitle = (
  value: unknown
): value is ConfigWithTitle | null | undefined => {
  if (value === null || value === undefined) {
    return true
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    ('title' in value || Object.keys(value).length === 0)
  )
}

const isModelWithTitle = (
  value: unknown
): value is ModelWithTitle | null | undefined => {
  if (value === null || value === undefined) {
    return true
  }
  return (
    typeof value === 'object' &&
    value !== null &&
    ('title' in value || Object.keys(value).length === 0)
  )
}

export const getTitle = (
  document: SearchDocument,
  type: DocumentType,
  options?: GetTitleOptions
): string => {
  const data = document.data
  const missingTitleFallback = options?.missingTitleFallback || 'Missing title'

  switch (type) {
    case 'supercar': {
      const config = isConfigWithTitle(data.config) ? data.config : null
      const model = isModelWithTitle(data.model) ? data.model : null
      return config?.title || model?.title || missingTitleFallback
    }
    case 'track': {
      const config = isConfigWithTitle(data.config) ? data.config : null
      const model = isModelWithTitle(data.model) ? data.model : null
      return config?.title || model?.title || missingTitleFallback
    }
    case 'page': {
      const config = isConfigWithTitle(data.config) ? data.config : null
      return config?.title || missingTitleFallback
    }
    default:
      return missingTitleFallback
  }
}
