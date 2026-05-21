# Add package seat type ids

## overview
- review @branch
- note new booking config field `rocketRezPackageSeatTypeIds`
- note new corresponding field `rocketRezSeatTypeIdOverrides -> rocketRezPackageSeatTypeIds`
- this is a comma separated list of IDs
- note when an entry has
  - `rocketRezSeatTypeId` & `rocketRezPackageSeatTypeIds`
  - we consider `rocketRezSeatTypeId` the "parent ID"
  - note this is the same for entries with `rocketRezSeatTypeIdOverrides`
    - `rocketRezSeatTypeIdOverrides.rocketRezSeatTypeId` = parent ID
- review: `src/components/booking-wizard/components/supercar-options-card`
  - when the parent ID is added to cart
  - we need to add all `rocketRezPackageSeatTypeIds` as well
  - when a parent ID is removed from cart
    - identify all products with the same `packageId`
    - remove them as well
- review `src/utils/get-add-to-cart-line-item-car-metadata.ts`
- extend `CartLineItemMetadataSchema`
  - add a new field: `isPackageComponent: boolean` (optional in schema)
  - add a new field: `packageId: string` (optional/nullable in schema)
    - this should be a `crypto.randomUUID()` generated at add-to-cart time
    - the same UUID is shared by the parent and all children in one package purchase
    - this is so we can identify all package components via the same key
    - non-package car items will not have this field set
- any cart line items where resolved metadata has `isPackageComponent === true`
  - should not display in the cart
  - should not be processed by `computeContents`
  - `src/features/cart/utils.ts`

## implementation

### resolve the parent id and package ids together
- review the current `rocketRezSeatTypeId` override logic in `src/utils/get-seat-type-id-with-override.ts`
- keep `getSeatTypeIdWithOverride` as-is — it is still used for sorting and rate ID resolution in:
  - `src/components/booking-wizard/components/supercar-options/index.tsx`
  - `src/components/booking-wizard/pages/choose-date-and-car/index.tsx`
- add a NEW sibling function `getSeatTypeIdsWithOverride` that returns:
  ```ts
  { parentId: number; packageSeatTypeIds: number[] }
  ```
  - resolves the active parent ID (same logic as `getSeatTypeIdWithOverride`)
  - also resolves `rocketRezPackageSeatTypeIds` from the matching override or from the default field
  - this should work for:
    - `rocketRezSeatTypeId` + `rocketRezPackageSeatTypeIds`
    - `rocketRezSeatTypeIdOverrides.rocketRezSeatTypeId` + `rocketRezSeatTypeIdOverrides.rocketRezPackageSeatTypeIds`
- the package IDs field is a comma separated list of IDs
- parse the list, trim whitespace, remove empty values, and convert the ids to numbers
  - create a new helper in `src/utils`:
    - `normalizePackageSeatTypeIds(raw: string | null | undefined): number[]`
- use `getSeatTypeIdsWithOverride` in `supercar-options-card` when building the add-to-cart request
- review:
  - `src/utils/get-seat-type-id-with-override.ts`
  - `src/components/booking-wizard/components/supercar-options/index.tsx`
  - `src/components/booking-wizard/pages/choose-date-and-car/index.tsx`
  - `src/components/booking-wizard/components/supercar-options-card/index.tsx`

### when the parent ID is added to cart
- review `src/components/booking-wizard/components/supercar-options-card/index.tsx`
- when the parent ID is added to cart, add all `rocketRezPackageSeatTypeIds` as well
- submit the parent and children in the same `useCartAdd()` request (single HTTP call)
- keep the parent line item as it is today
- for each child, build the line item as follows:
  - use the same selected `scheduleId`
  - use the same selected `quantity`
  - resolve the child `rateId` and `rateType` from the selected schedule:
    - given the child's seat type ID (a number from `packageSeatTypeIds`)
    - find the matching seat type in `schedule.seatTypes` where `seatType.rates` contains a rate whose `id` equals the child seat type ID
    - take `rate.id` as `rateId` and `rateTypes[0].type` as `rateType` from that match
    - do NOT reuse the parent's `rateId`/`rateType`
- if any configured child ID cannot be resolved on the selected schedule:
  - do not partially add the package
  - log the mismatch
  - show the existing add-to-cart error toast

### extend `CartLineItemMetadataSchema` and metadata builder
- extend `CartLineItemMetadataSchema` in `src/io/schemas.ts`:
  - add `isPackageComponent: z.boolean().nullable().optional()`
  - add `packageId: z.string().nullable().optional()`
  - these fields are optional/nullable so existing localStorage data without them parses safely
- the inferred types in `src/io/types.ts` will update automatically
- update `src/utils/get-add-to-cart-line-item-car-metadata.ts`:
  - accept optional `isPackageComponent: boolean` and `packageId: string` in props
  - pass them through to the returned metadata object
  - caller is responsible for generating the UUID and deciding `isPackageComponent`
- in `supercar-options-card`, when building metadata:
  - generate one `packageId = crypto.randomUUID()` per add-to-cart submission (only when there are package children)
  - parent metadata: `isPackageComponent: false`, `packageId: <uuid>`
  - child metadata: `isPackageComponent: true`, `packageId: <uuid>` (same UUID as parent)
  - non-package cars: omit both fields
- keep the existing metadata key logic per line item so each line item still has its own metadata record

### allow `useCartAdd()` to save all package metadata
- review `src/features/cart/use-cart-add.ts`
- change `AddToCartInput.metadata` from `CartLineItemMetadata` to `CartLineItemMetadata | CartLineItemMetadata[]`
- normalize a single object to an array internally so all existing call sites continue to work unchanged
- append any new metadata records that do not already exist in cart state (by key)
- analytics: call `analytics.trackAddToCart` once after all metadata is written, using the parent metadata record only (the first item that has `isPackageComponent !== true`)

### when the parent ID is removed from cart
- review `src/features/cart/use-cart-remove-line-item.ts`
- when any package item is removed (parent or child):
  - read current cart state to find all line items whose resolved metadata shares the same `packageId`
  - remove all of them (not just the one passed to the mutation)
- do this from current cart state, not just the immediate mutation response
- this should work even if removal starts from a child line item
- make sure metadata cleanup removes all metadata entries tied to that `packageId`
- insurance recalculation (`removeInsuranceIfNeeded`):
  - suppress it for all intermediate package-child removals
  - only trigger it after the final package item has been confirmed removed
  - this prevents multiple insurance recalculations on partially-removed carts

### filtering items with `isPackageComponent === true`
- these items should not display in the cart and should not be counted by `computeContents`

#### `src/features/cart/utils.ts`
- in the `computeContents` loop, skip any line item where resolved metadata has `isPackageComponent === true`
- this covers all derived values: `carCount`, `totalSessions`, `totalItems`, `hasOnlyAddons`, etc.

#### `src/components/global-cart/components/items/index.tsx`
- filter the `lineItems` prop before rendering:
  ```ts
  const visibleLineItems = lineItems.filter((lineItem) => {
    const key = getCartLineItemReadMetadataKey({ lineItem })
    const meta = metadata?.find((m) => m.key === key)
    return meta?.isPackageComponent !== true
  })
  ```
- this single filtering point covers all cart layout consumers (`page.tsx`, `aside.tsx`, `drawer.tsx`) without requiring changes in each layout

#### `src/components/booking-wizard/pages/choose-date-and-car/index.tsx`
- when building the `carLineItems` array for the saved form value
- skip items where `itemMetadata.isPackageComponent === true`
- only persist parent car items into the saved `cars` array

#### `src/components/booking-wizard/components/supercar-options-card/index.tsx`
- in `getExistingCartDate`, find the first car metadata entry where `isPackageComponent !== true`:
  ```ts
  const carMetadata = data.metadata.find(
    (meta) => meta.type === 'car' && meta.isPackageComponent !== true
  )
  ```

### no expected behavior changes
- `src/features/cart/use-cart-complete.ts` already passes the full metadata array to the API
- `src/app/api/v1/cart/complete/route.ts` should continue to work once `CartLineItemMetadataSchema` is extended
- `src/features/cart/repository.ts` should not need custom logic beyond persisting the updated schema shape
- `src/features/cart/repository.ts` should not error when loading data from localStorage without the new metadata fields — both new fields are `.nullable().optional()` so `safeParse` will succeed on old data
