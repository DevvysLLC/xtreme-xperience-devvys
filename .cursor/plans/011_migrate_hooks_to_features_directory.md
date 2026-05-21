# Migrate Hooks to Features Directory

## Scope

Migrate remaining hook domains from `src/hooks` into `src/features`, following the migration pattern already started for booking/analytics.

In scope:

- `dialog`
- `form`
- `mapbox`
- `newsletter`
- `order`
- `route`
- `scroll`
- `toast`
- `tracks`
- `utils`

Primary source files currently in hooks:

- [`/app/src/hooks/use-dialog/index.ts`](/app/src/hooks/use-dialog/index.ts)
- [`/app/src/hooks/use-form/use-form.ts`](/app/src/hooks/use-form/use-form.ts)
- [`/app/src/hooks/use-mapbox/use-mapbox-geocode.ts`](/app/src/hooks/use-mapbox/use-mapbox-geocode.ts)
- [`/app/src/hooks/use-newsletter/use-newsletter.ts`](/app/src/hooks/use-newsletter/use-newsletter.ts)
- [`/app/src/hooks/use-order/use-order.ts`](/app/src/hooks/use-order/use-order.ts)
- [`/app/src/hooks/use-order/use-order-mark-viewed.ts`](/app/src/hooks/use-order/use-order-mark-viewed.ts)
- [`/app/src/hooks/use-route-change/use-route-change.ts`](/app/src/hooks/use-route-change/use-route-change.ts)
- [`/app/src/hooks/use-scroll/use-scroll-to-bottom.ts`](/app/src/hooks/use-scroll/use-scroll-to-bottom.ts)
- [`/app/src/hooks/use-toast/use-toast.ts`](/app/src/hooks/use-toast/use-toast.ts)
- [`/app/src/hooks/use-tracks/use-tracks.ts`](/app/src/hooks/use-tracks/use-tracks.ts)
- [`/app/src/hooks/use-tracks/use-track-events.ts`](/app/src/hooks/use-tracks/use-track-events.ts)
- [`/app/src/hooks/use-utils/use-utils-debounced-value.ts`](/app/src/hooks/use-utils/use-utils-debounced-value.ts)

## Phase 1: Create New Feature Modules Per Domain

Add feature folders with public barrels and move/copy logic first (no behavior changes):

- `/app/src/features/dialog/`
- `/app/src/features/form/`
- `/app/src/features/mapbox/`
- `/app/src/features/newsletter/`
- `/app/src/features/order/`
- `/app/src/features/route/`
- `/app/src/features/scroll/`
- `/app/src/features/toast/`
- `/app/src/features/tracks/`
- `/app/src/features/utils/`

Structure each domain consistently:

- `index.ts` (public exports)
- hook implementation files
- `config.ts`/`utils.ts` when applicable

## Phase 2: Add Compatibility Re-Exports in Legacy Hook Paths

Keep existing `src/hooks/*` paths temporarily, but make them wrappers that re-export from `src/features/*` (same pattern as booking compatibility path):

- preserves existing imports while we migrate callers
- enables incremental refactor without large breakage

## Phase 3: Migrate Call Sites to Features Imports

Update all current consumers from `src/hooks/...` to `src/features/...`.

Known consumers to update:

- Form: [`/app/src/components/global-form-dialog/index.tsx`](/app/src/components/global-form-dialog/index.tsx)
- Newsletter: [`/app/src/components/core-newsletter-signup-form/index.tsx`](/app/src/components/core-newsletter-signup-form/index.tsx)
- Order: [`/app/src/components/checkout-wizard/pages/complete/index.tsx`](/app/src/components/checkout-wizard/pages/complete/index.tsx), [`/app/src/components/order-wizard/pages/order/index.tsx`](/app/src/components/order-wizard/pages/order/index.tsx)
- Route: [`/app/src/components/global-track-finder/components/drawer.tsx`](/app/src/components/global-track-finder/components/drawer.tsx), [`/app/src/components/global-header/components/navigation-mobile-drawer.tsx`](/app/src/components/global-header/components/navigation-mobile-drawer.tsx), [`/app/src/components/global-header/context/header-context.tsx`](/app/src/components/global-header/context/header-context.tsx)
- Scroll: [`/app/src/components/global-track-finder/components/sticky-bar-content.tsx`](/app/src/components/global-track-finder/components/sticky-bar-content.tsx)
- Toast: multiple booking/checkout/cart components currently importing `hooks/use-toast`
- Tracks: track finder + event-finder + events-feature components currently importing `hooks/use-tracks`

## Phase 4: Remove or Archive Legacy Hook Directories

After all call sites are moved and CI passes:

- delete legacy `src/hooks/use-*` directories for migrated domains
- keep only intentionally transitional wrappers if needed for external compatibility

## Standards and Guardrails

- No behavioral changes during relocation; migration is structural
- Preserve current API signatures for each hook in this pass
- Keep user-facing strings in translations (no new hardcoded UI text)
- Keep logging/error semantics unchanged unless required for type/lint fixes

## Verification

- Run `./run-task ci-ai` after migration batches and after final cleanup
- Run focused manual checks for affected flows:
  - booking wizard steps using toast/tracks
  - newsletter signup submission
  - order load + mark viewed paths
  - route-change driven drawer/header behaviors
- Confirm zero imports from migrated `src/hooks/use-*` paths remain

## Done Criteria

- All ten domains have canonical implementations in `src/features/*`
- Application code imports these hooks from `src/features/*`
- Legacy hook paths are removed (or explicitly retained as temporary wrappers with deprecation comments)
- `./run-task ci-ai` passes cleanly
