# CorePagination

A reusable pagination component for navigating through paginated content.

## Usage

```tsx
import { CorePagination } from '../core-pagination'

const getPageUrl = (page: number): string => {
  if (page === 1) {
    return '/blog'
  }
  return `/blog/page/${page}`
}

<CorePagination
  currentPage={currentPage}
  totalPages={totalPages}
  getPageUrl={getPageUrl}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentPage` | `number` | Yes | The current active page (1-indexed) |
| `totalPages` | `number` | Yes | Total number of pages |
| `getPageUrl` | `(page: number) => string` | Yes | Function to generate URL for each page |
| `className` | `string` | No | Additional CSS class for the nav element |

## Features

- Displays page numbers with ellipsis for large page counts
- Previous/Next navigation buttons with chevron icons
- Disables previous button on first page
- Disables next button on last page
- Highlights current page
- Returns null if totalPages <= 1
- Accessible with proper aria-labels and aria-current attributes

## Styling

The component uses `black-transparent` pill-style buttons with the following states:
- **Default**: Transparent background for page numbers and prev/next buttons
- **Active**: Light gray background (`black-10`) for current page
- **Disabled**: Reduced opacity with `pointer-events: none` for prev/next at boundaries
