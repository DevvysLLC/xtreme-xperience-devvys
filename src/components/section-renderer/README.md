# SectionRenderer

A dynamic component that renders page sections based on their `__typename` field from DatoCMS.

## Usage

```tsx
import { SectionRenderer } from './section-renderer'

// Pass sections from PageContentRecord
;<SectionRenderer sections={pageContent.sections} />
```

## How it works

1. **Dynamic Mapping**: Uses the `__typename` field to map each section to its corresponding React component
2. **Code Splitting**: Uses `React.lazy()` for dynamic imports, enabling automatic code splitting
3. **Suspense Loading**: Wraps each section in `Suspense` with loading fallback
4. **Helper Function**: Uses `renderSection` helper for clean, maintainable code
5. **Type Safety**: Leverages TypeScript to ensure proper component mapping
6. **Error Handling**: Logs warnings for unknown section types and gracefully skips them
7. **Props Spreading**: Passes the entire section data as `data` prop to each component

## Supported Section Types

- `SectionEventsFeatureRecord` → `SectionEventsFeature`
- `SectionFaqRecord` → `SectionFaq`
- `SectionHeadlineRecord` → `SectionHeadline`
- `SectionHeroRecord` → `SectionHero`
- `SectionMediaCalloutGridRecord` → `SectionMediaCalloutGrid`
- `SectionMediaCardGridRecord` → `SectionMediaCardGrid`
- `SectionMediaHeroRecord` → `SectionMediaHero`
- `SectionPressBrandGridRecord` → `SectionPressBrandGrid`
- `SectionReviewRecord` → `SectionReview`
- `SectionSocialGridRecord` → `SectionSocialGrid`
- `SectionSplitCalloutRecord` → `SectionSplitCallout`
- `SectionSplitCalloutCollageRecord` → `SectionSplitCalloutCollage`
- `SectionSupercarBrandGridRecord` → `SectionSupercarBrandGrid`
- `SectionSupercarFleetGridRecord` → `SectionSupercarFleetGrid`
- `SectionSupercarShowcaseRecord` → `SectionSupercarShowcase`
- `SectionTrackMapCalloutRecord` → `SectionTrackMapCallout`
- `SectionUspRecord` → `SectionUsp`

## Benefits of Dynamic Imports

- **Code Splitting**: Each section component is loaded only when needed
- **Performance**: Reduces initial bundle size by lazy loading components
- **Caching**: Components are cached after first load
- **Loading States**: Built-in loading fallbacks with Suspense

## Adding New Section Types

1. Create the new section component in `/src/components/section-[name]/`
2. Add a lazy import in the SectionRenderer
3. Add the mapping to the `sectionComponents` registry
4. Ensure the component accepts a `data` prop with the section record

## Example

```tsx
// PageContentRecord from DatoCMS
const pageContent = {
  sections: [
    {
      __typename: 'SectionHeroRecord',
      id: 'hero-1',
      title: 'Welcome',
      // ... other hero fields
    },
    {
      __typename: 'SectionFaqRecord',
      id: 'faq-1',
      title: 'Frequently Asked Questions',
      // ... other FAQ fields
    }
  ]
}

// Renders: <SectionHero data={heroSection} /> followed by <SectionFaq data={faqSection} />
<SectionRenderer sections={pageContent.sections} />
```
