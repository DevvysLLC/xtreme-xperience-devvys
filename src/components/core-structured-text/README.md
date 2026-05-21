# Core Structured Text

Renders DatoCMS structured text content using react-datocms.

## Props

- `data: JSONValue | null | undefined` - The structured text data from DatoCMS (typically from a field like `body.value`)

## Usage

```tsx
import { CoreStructuredText } from '@/components/core-structured-text'
import type { PostModelBaseFragment } from '@/core/dato/fragments/post-model.typegen'

const BlogArticle = ({ model }: { model: PostModelBaseFragment | null }) => {
  return (
    <article>
      <h1>{model?.title}</h1>
      <CoreStructuredText data={model?.body?.value} />
    </article>
  )
}
```

