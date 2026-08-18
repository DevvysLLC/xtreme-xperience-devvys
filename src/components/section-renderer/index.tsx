import React, { type FC, lazy, Suspense } from 'react'
import type { HeaderSectionsFragment } from '../../core/dato/fragments/header-sections.typegen'
import type { PageSectionsFragment } from '../../core/dato/fragments/page-sections.typegen'
import type { SupercarFragment } from '../../core/dato/fragments/supercar.typegen'
import type { SupercarModelFragment } from '../../core/dato/fragments/supercar-model.typegen'
import type { TrackFragment } from '../../core/dato/fragments/track.typegen'
import type { TrackModelFragment } from '../../core/dato/fragments/track-model.typegen'
import { CoreLoadingSection } from '../core-loading-section'
import { SectionAccordion } from '../section-accordion'
import { SectionAddonsGrid } from '../section-addons-grid'
import { SectionAnnouncementBar } from '../section-announcement-bar'
import { SectionContact } from '../section-contact'
import { SectionCustomHtml } from '../section-custom-html'
import { SectionEventFinder } from '../section-event-finder'
import { SectionEventsFeature } from '../section-events-feature'
import { SectionFaq } from '../section-faq'
import { SectionHeadline } from '../section-headline'
import { SectionHero } from '../section-hero'
import { SectionHighlight } from '../section-highlight'
import { SectionIframe } from '../section-iframe'
import { SectionMediaCardGrid } from '../section-media-card-grid'
import { SectionMediaGallery } from '../section-media-gallery'
import { SectionMediaHero } from '../section-media-hero'
import { SectionPolicy } from '../section-policy'
import { SectionPressBrandGrid } from '../section-press-brand-grid'
import { SectionReview } from '../section-review'
import { SectionSocialGrid } from '../section-social-grid'
import { SectionSplitCallout } from '../section-split-callout'
import { SectionSplitCalloutCollage } from '../section-split-callout-collage'
import { SectionSupercarBrandGrid } from '../section-supercar-brand-grid'
import { SectionSupercarBrandHero } from '../section-supercar-brand-hero'
import { SectionSupercarFleetGrid } from '../section-supercar-fleet-grid'
import { SectionSupercarHero } from '../section-supercar-hero'
import { SectionSupercarShowcase } from '../section-supercar-showcase'
import { SectionSupercarSpec } from '../section-supercar-spec'
import { SectionTrackHero } from '../section-track-hero'
import { SectionTrackMapCallout } from '../section-track-map-callout'
import { SectionTrackSpec } from '../section-track-spec'
import { SectionUsp } from '../section-usp'

const LAZY_SECTION_THRESHOLD = 2

// Hero sections contain interactive video with client-side Zustand state.
// Wrapping them in <Suspense> causes the fallback to flash on every store
// update (useSyncExternalStore triggers a synchronous re-render that
// briefly re-suspends the boundary). Always render these eagerly.
const EAGER_SECTION_TYPES = new Set([
  'SectionSupercarBrandHeroRecord',
  'SectionSupercarHeroRecord',
  'SectionTrackHeroRecord',
  'SectionHeroRecord',
  'SectionMediaHeroRecord'
])

type SectionComponentProps = {
  data:
    | PageSectionsFragment['sections'][number]
    | HeaderSectionsFragment['sections'][number]
  model?: TrackModelFragment | SupercarModelFragment | null
  record?: TrackFragment | SupercarFragment | null
  track?: TrackFragment | null
  isFirstSection?: boolean
}

// Loaders return section-specific types; we assert SectionComponentProps for the registry.
const lazySection = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loader: () => Promise<{ default: React.ComponentType<any> }>
) =>
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- lazy registry needs unified props type
  lazy(loader) as React.LazyExoticComponent<
    React.ComponentType<SectionComponentProps>
  >

const lazyRegistry = {
  SectionAccordionRecord: lazySection(() =>
    import('../section-accordion').then((m) => ({
      default: m.SectionAccordion
    }))
  ),
  SectionAddonsGridRecord: lazySection(() =>
    import('../section-addons-grid').then((m) => ({
      default: m.SectionAddonsGrid
    }))
  ),
  SectionAnnouncementBarRecord: lazySection(() =>
    import('../section-announcement-bar').then((m) => ({
      default: m.SectionAnnouncementBar
    }))
  ),
  SectionContactRecord: lazySection(() =>
    import('../section-contact').then((m) => ({ default: m.SectionContact }))
  ),
  SectionCustomHtmlRecord: lazySection(() =>
    import('../section-custom-html').then((m) => ({
      default: m.SectionCustomHtml
    }))
  ),
  SectionEventFinderRecord: lazySection(() =>
    import('../section-event-finder').then((m) => ({
      default: m.SectionEventFinder
    }))
  ),
  SectionEventsFeatureRecord: lazySection(() =>
    import('../section-events-feature').then((m) => ({
      default: m.SectionEventsFeature
    }))
  ),
  SectionFaqRecord: lazySection(() =>
    import('../section-faq').then((m) => ({ default: m.SectionFaq }))
  ),
  SectionHeadlineRecord: lazySection(() =>
    import('../section-headline').then((m) => ({ default: m.SectionHeadline }))
  ),
  SectionHeroRecord: lazySection(() =>
    import('../section-hero').then((m) => ({ default: m.SectionHero }))
  ),
  SectionHighlightRecord: lazySection(() =>
    import('../section-highlight').then((m) => ({
      default: m.SectionHighlight
    }))
  ),
  SectionIframeRecord: lazySection(() =>
    import('../section-iframe').then((m) => ({ default: m.SectionIframe }))
  ),
  SectionMediaCardGridRecord: lazySection(() =>
    import('../section-media-card-grid').then((m) => ({
      default: m.SectionMediaCardGrid
    }))
  ),
  SectionMediaGalleryRecord: lazySection(() =>
    import('../section-media-gallery').then((m) => ({
      default: m.SectionMediaGallery
    }))
  ),
  SectionMediaHeroRecord: lazySection(() =>
    import('../section-media-hero').then((m) => ({
      default: m.SectionMediaHero
    }))
  ),
  SectionPolicyRecord: lazySection(() =>
    import('../section-policy').then((m) => ({ default: m.SectionPolicy }))
  ),
  SectionPressBrandGridRecord: lazySection(() =>
    import('../section-press-brand-grid').then((m) => ({
      default: m.SectionPressBrandGrid
    }))
  ),
  SectionReviewRecord: lazySection(() =>
    import('../section-review').then((m) => ({ default: m.SectionReview }))
  ),
  SectionSocialGridRecord: lazySection(() =>
    import('../section-social-grid').then((m) => ({
      default: m.SectionSocialGrid
    }))
  ),
  SectionSplitCalloutRecord: lazySection(() =>
    import('../section-split-callout').then((m) => ({
      default: m.SectionSplitCallout
    }))
  ),
  SectionSplitCalloutCollageRecord: lazySection(() =>
    import('../section-split-callout-collage').then((m) => ({
      default: m.SectionSplitCalloutCollage
    }))
  ),
  SectionSupercarBrandGridRecord: lazySection(() =>
    import('../section-supercar-brand-grid').then((m) => ({
      default: m.SectionSupercarBrandGrid
    }))
  ),
  SectionSupercarBrandHeroRecord: lazySection(() =>
    import('../section-supercar-brand-hero').then((m) => ({
      default: m.SectionSupercarBrandHero
    }))
  ),
  SectionSupercarFleetGridRecord: lazySection(() =>
    import('../section-supercar-fleet-grid').then((m) => ({
      default: m.SectionSupercarFleetGrid
    }))
  ),
  SectionSupercarHeroRecord: lazySection(() =>
    import('../section-supercar-hero').then((m) => ({
      default: m.SectionSupercarHero
    }))
  ),
  SectionSupercarShowcaseRecord: lazySection(() =>
    import('../section-supercar-showcase').then((m) => ({
      default: m.SectionSupercarShowcase
    }))
  ),
  SectionSupercarSpecRecord: lazySection(() =>
    import('../section-supercar-spec').then((m) => ({
      default: m.SectionSupercarSpec
    }))
  ),
  SectionTrackHeroRecord: lazySection(() =>
    import('../section-track-hero').then((m) => ({
      default: m.SectionTrackHero
    }))
  ),
  SectionTrackMapCalloutRecord: lazySection(() =>
    import('../section-track-map-callout').then((m) => ({
      default: m.SectionTrackMapCallout
    }))
  ),
  SectionTrackSpecRecord: lazySection(() =>
    import('../section-track-spec').then((m) => ({
      default: m.SectionTrackSpec
    }))
  ),
  SectionUspRecord: lazySection(() =>
    import('../section-usp').then((m) => ({ default: m.SectionUsp }))
  )
} as const

const isTrackModel = (
  model: TrackModelFragment | SupercarModelFragment | null | undefined
): model is TrackModelFragment => {
  return (
    model !== null &&
    model !== undefined &&
    model.__typename === 'TrackModelRecord'
  )
}

const isSupercarModel = (
  model: TrackModelFragment | SupercarModelFragment | null | undefined
): model is SupercarModelFragment => {
  return (
    model !== null &&
    model !== undefined &&
    model.__typename === 'SupercarModelRecord'
  )
}

const isTrackRecord = (
  record: TrackFragment | SupercarFragment | null | undefined
): record is TrackFragment => {
  return (
    record !== null &&
    record !== undefined &&
    record.__typename === 'TrackRecord'
  )
}

type SectionRendererProps = {
  sections:
    | PageSectionsFragment['sections']
    | HeaderSectionsFragment['sections']
  model?: TrackModelFragment | SupercarModelFragment | null
  record?: TrackFragment | SupercarFragment | null
}

const registry = {
  SectionAccordionRecord: SectionAccordion,
  SectionAddonsGridRecord: SectionAddonsGrid,
  SectionContactRecord: SectionContact,
  SectionCustomHtmlRecord: SectionCustomHtml,
  SectionEventsFeatureRecord: SectionEventsFeature,
  SectionFaqRecord: SectionFaq,
  SectionHeadlineRecord: SectionHeadline,
  SectionIframeRecord: SectionIframe,
  SectionHeroRecord: SectionHero,
  SectionHighlightRecord: SectionHighlight,
  SectionMediaCardGridRecord: SectionMediaCardGrid,
  SectionMediaGalleryRecord: SectionMediaGallery,
  SectionMediaHeroRecord: SectionMediaHero,
  SectionPolicyRecord: SectionPolicy,
  SectionPressBrandGridRecord: SectionPressBrandGrid,
  SectionReviewRecord: SectionReview,
  SectionSocialGridRecord: SectionSocialGrid,
  SectionSplitCalloutRecord: SectionSplitCallout,
  SectionSplitCalloutCollageRecord: SectionSplitCalloutCollage,
  SectionSupercarBrandGridRecord: SectionSupercarBrandGrid,
  SectionSupercarBrandHeroRecord: SectionSupercarBrandHero,
  SectionSupercarFleetGridRecord: SectionSupercarFleetGrid,
  SectionSupercarHeroRecord: SectionSupercarHero,
  SectionSupercarShowcaseRecord: SectionSupercarShowcase,
  SectionSupercarSpecRecord: SectionSupercarSpec,
  SectionTrackHeroRecord: SectionTrackHero,
  SectionTrackMapCalloutRecord: SectionTrackMapCallout,
  SectionUspRecord: SectionUsp,
  SectionTrackSpecRecord: SectionTrackSpec,
  SectionAnnouncementBarRecord: SectionAnnouncementBar,
  SectionEventFinderRecord: SectionEventFinder
} as const

const RenderSection = ({
  section,
  model,
  record,
  isFirstSection
}: {
  section:
    | PageSectionsFragment['sections'][number]
    | HeaderSectionsFragment['sections'][number]
  model?: TrackModelFragment | SupercarModelFragment | null
  record?: TrackFragment | SupercarFragment | null
  isFirstSection?: boolean
}) => {
  const firstSectionProps = isFirstSection ? { isFirstSection: true } : {}

  switch (section.__typename) {
    case 'SectionAccordionRecord': {
      const Component = registry.SectionAccordionRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionAddonsGridRecord': {
      const Component = registry.SectionAddonsGridRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionContactRecord': {
      const Component = registry.SectionContactRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionCustomHtmlRecord': {
      const Component = registry.SectionCustomHtmlRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionEventsFeatureRecord': {
      const Component = registry.SectionEventsFeatureRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionFaqRecord': {
      const Component = registry.SectionFaqRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionHeadlineRecord': {
      const Component = registry.SectionHeadlineRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionHeroRecord': {
      const Component = registry.SectionHeroRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionHighlightRecord': {
      const Component = registry.SectionHighlightRecord
      return (
        <Component
          data={section}
          model={isTrackModel(model) || isSupercarModel(model) ? model : null}
          {...firstSectionProps}
        />
      )
    }
    case 'SectionMediaCardGridRecord': {
      const Component = registry.SectionMediaCardGridRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionMediaGalleryRecord': {
      const Component = registry.SectionMediaGalleryRecord
      return (
        <Component
          data={section}
          model={isTrackModel(model) || isSupercarModel(model) ? model : null}
          {...firstSectionProps}
        />
      )
    }
    case 'SectionMediaHeroRecord': {
      const Component = registry.SectionMediaHeroRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionPolicyRecord': {
      const Component = registry.SectionPolicyRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionPressBrandGridRecord': {
      const Component = registry.SectionPressBrandGridRecord
      return <Component data={section} />
    }
    case 'SectionReviewRecord': {
      const Component = registry.SectionReviewRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSocialGridRecord': {
      const Component = registry.SectionSocialGridRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSplitCalloutRecord': {
      const Component = registry.SectionSplitCalloutRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSplitCalloutCollageRecord': {
      const Component = registry.SectionSplitCalloutCollageRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSupercarBrandGridRecord': {
      const Component = registry.SectionSupercarBrandGridRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSupercarBrandHeroRecord': {
      const Component = registry.SectionSupercarBrandHeroRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSupercarFleetGridRecord': {
      const Component = registry.SectionSupercarFleetGridRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSupercarHeroRecord': {
      const Component = registry.SectionSupercarHeroRecord
      return (
        <Component
          data={section}
          model={isSupercarModel(model) ? model : null}
          {...firstSectionProps}
        />
      )
    }
    case 'SectionSupercarShowcaseRecord': {
      const Component = registry.SectionSupercarShowcaseRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionSupercarSpecRecord': {
      const Component = registry.SectionSupercarSpecRecord
      return (
        <Component
          data={section}
          model={isSupercarModel(model) ? model : null}
          {...firstSectionProps}
        />
      )
    }
    case 'SectionTrackHeroRecord': {
      const Component = registry.SectionTrackHeroRecord
      return (
        <Component
          data={section}
          model={isTrackModel(model) ? model : null}
          track={isTrackRecord(record) ? record : null}
          {...firstSectionProps}
        />
      )
    }
    case 'SectionTrackMapCalloutRecord': {
      const Component = registry.SectionTrackMapCalloutRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionTrackSpecRecord': {
      const Component = registry.SectionTrackSpecRecord
      return (
        <Component
          data={section}
          model={isTrackModel(model) ? model : null}
          track={isTrackRecord(record) ? record : null}
          {...firstSectionProps}
        />
      )
    }
    case 'SectionUspRecord': {
      const Component = registry.SectionUspRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionAnnouncementBarRecord': {
      const Component = registry.SectionAnnouncementBarRecord
      return <Component data={section} />
    }
    case 'SectionEventFinderRecord': {
      const Component = registry.SectionEventFinderRecord
      return <Component data={section} {...firstSectionProps} />
    }
    case 'SectionIframeRecord': {
      const Component = registry.SectionIframeRecord
      return <Component data={section} {...firstSectionProps} />
    }
    default:
      return null
  }
}

const LazyRenderSection = ({
  section,
  model,
  record,
  isFirstSection
}: {
  section:
    | PageSectionsFragment['sections'][number]
    | HeaderSectionsFragment['sections'][number]
  model?: TrackModelFragment | SupercarModelFragment | null
  record?: TrackFragment | SupercarFragment | null
  isFirstSection?: boolean
}) => {
  const firstSectionProps = isFirstSection ? { isFirstSection: true } : {}

  const renderLazy = () => {
    switch (section.__typename) {
      case 'SectionAccordionRecord': {
        const Component = lazyRegistry.SectionAccordionRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionAddonsGridRecord': {
        const Component = lazyRegistry.SectionAddonsGridRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionAnnouncementBarRecord': {
        const Component = lazyRegistry.SectionAnnouncementBarRecord
        return <Component data={section} />
      }
      case 'SectionContactRecord': {
        const Component = lazyRegistry.SectionContactRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionCustomHtmlRecord': {
        const Component = lazyRegistry.SectionCustomHtmlRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionEventFinderRecord': {
        const Component = lazyRegistry.SectionEventFinderRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionEventsFeatureRecord': {
        const Component = lazyRegistry.SectionEventsFeatureRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionFaqRecord': {
        const Component = lazyRegistry.SectionFaqRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionHeadlineRecord': {
        const Component = lazyRegistry.SectionHeadlineRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionHeroRecord': {
        const Component = lazyRegistry.SectionHeroRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionHighlightRecord': {
        const Component = lazyRegistry.SectionHighlightRecord
        return (
          <Component
            data={section}
            model={isTrackModel(model) || isSupercarModel(model) ? model : null}
            {...firstSectionProps}
          />
        )
      }
      case 'SectionIframeRecord': {
        const Component = lazyRegistry.SectionIframeRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionMediaCardGridRecord': {
        const Component = lazyRegistry.SectionMediaCardGridRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionMediaGalleryRecord': {
        const Component = lazyRegistry.SectionMediaGalleryRecord
        return (
          <Component
            data={section}
            model={isTrackModel(model) || isSupercarModel(model) ? model : null}
            {...firstSectionProps}
          />
        )
      }
      case 'SectionMediaHeroRecord': {
        const Component = lazyRegistry.SectionMediaHeroRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionPolicyRecord': {
        const Component = lazyRegistry.SectionPolicyRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionPressBrandGridRecord': {
        const Component = lazyRegistry.SectionPressBrandGridRecord
        return <Component data={section} />
      }
      case 'SectionReviewRecord': {
        const Component = lazyRegistry.SectionReviewRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSocialGridRecord': {
        const Component = lazyRegistry.SectionSocialGridRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSplitCalloutRecord': {
        const Component = lazyRegistry.SectionSplitCalloutRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSplitCalloutCollageRecord': {
        const Component = lazyRegistry.SectionSplitCalloutCollageRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSupercarBrandGridRecord': {
        const Component = lazyRegistry.SectionSupercarBrandGridRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSupercarBrandHeroRecord': {
        const Component = lazyRegistry.SectionSupercarBrandHeroRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSupercarFleetGridRecord': {
        const Component = lazyRegistry.SectionSupercarFleetGridRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSupercarHeroRecord': {
        const Component = lazyRegistry.SectionSupercarHeroRecord
        return (
          <Component
            data={section}
            model={isSupercarModel(model) ? model : null}
            {...firstSectionProps}
          />
        )
      }
      case 'SectionSupercarShowcaseRecord': {
        const Component = lazyRegistry.SectionSupercarShowcaseRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionSupercarSpecRecord': {
        const Component = lazyRegistry.SectionSupercarSpecRecord
        return (
          <Component
            data={section}
            model={isSupercarModel(model) ? model : null}
            {...firstSectionProps}
          />
        )
      }
      case 'SectionTrackHeroRecord': {
        const Component = lazyRegistry.SectionTrackHeroRecord
        return (
          <Component
            data={section}
            model={isTrackModel(model) ? model : null}
            track={isTrackRecord(record) ? record : null}
            {...firstSectionProps}
          />
        )
      }
      case 'SectionTrackMapCalloutRecord': {
        const Component = lazyRegistry.SectionTrackMapCalloutRecord
        return <Component data={section} {...firstSectionProps} />
      }
      case 'SectionTrackSpecRecord': {
        const Component = lazyRegistry.SectionTrackSpecRecord
        return (
          <Component
            data={section}
            model={isTrackModel(model) ? model : null}
            track={isTrackRecord(record) ? record : null}
            {...firstSectionProps}
          />
        )
      }
      case 'SectionUspRecord': {
        const Component = lazyRegistry.SectionUspRecord
        return <Component data={section} {...firstSectionProps} />
      }
      default:
        return null
    }
  }

  return <Suspense fallback={<CoreLoadingSection />}>{renderLazy()}</Suspense>
}

export const SectionRenderer: FC<SectionRendererProps> = ({
  sections,
  model,
  record
}) => {
  const filtered = sections.filter(
    (section) =>
      !('config' in section) ||
      section.config === null ||
      section.config.enabled !== false
  )

  return (
    <>
      {filtered.map((section, index) => (
        <React.Fragment key={`${section.__typename}-${index}`}>
          {index < LAZY_SECTION_THRESHOLD ||
          EAGER_SECTION_TYPES.has(section.__typename) ? (
            <RenderSection
              section={section}
              model={model}
              record={record}
              isFirstSection={Boolean(index === 0)}
            />
          ) : (
            <LazyRenderSection
              section={section}
              model={model}
              record={record}
              isFirstSection={false}
            />
          )}
        </React.Fragment>
      ))}
    </>
  )
}
