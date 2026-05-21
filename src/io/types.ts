import type { z } from 'zod'
import type {
  BookingConfigFragment,
  BookingPageFragment
} from '../core/dato/fragments/booking-config.typegen'
import type { EventDataFragment } from '../core/dato/fragments/event-data.typegen'
import type { TrackFragment } from '../core/dato/fragments/track.typegen'
import type { TrackDataFragment } from '../core/dato/fragments/track-data.typegen'
import type {
  // Analytics Schemas
  AnalyticsEcommerceEventSchema,
  AnalyticsFacebookPixelContentSchema,
  AnalyticsFacebookPixelEventDataSchema,
  AnalyticsFacebookPixelEventSchema,
  AnalyticsGA4EventDataSchema,
  AnalyticsGA4EventSchema,
  AnalyticsGA4ItemSchema,
  // API
  ApiBookingConfigGetBookingConfigResponseSchema,
  ApiCartResponseSchema,
  ApiEventsGetEventResponseSchema,
  ApiFormGetFormByHandleResponseSchema,
  ApiTracksGetAllTracksResponseSchema,
  BookingCarLineItemSchema,
  BookingCoverageOptionsSchema,
  BookingLocationSchema,
  // Booking Store Schemas
  BookingMediaPackagesSchema,
  BookingPageChooseDateAndCarFormValueSchema,
  BookingPageCoverageOptionsFormValueSchema,
  BookingPageMediaPackagesFormValueSchema,
  BookingPageRideAlongFormValueSchema,
  BookingReviewSchema,
  BookingRideAlongSchema,
  BookingSelectedCarSchema,
  BookingStateSchema,
  BookingUserSelectionStateSchema,
  BookingWizardPageCoverageOptionsSchema,
  BookingWizardPageDateAndCarSchema,
  BookingWizardPageMediaPackagesSchema,
  BookingWizardPageReviewSchema,
  BookingWizardPageRideAlongSchema,
  // Cart Store Schemas
  CartLineItemMetadataKeySchema,
  CartLineItemMetadataPropertiesSchema,
  CartLineItemMetadataSchema,
  CartLineItemSchema,
  CartStateSchema,
  CartUpdateLineItemInputSchema,
  CheckoutDetailsFormInputSchema,
  // Checkout Store Schemas
  CheckoutStateSchema,
  CheckoutWizardPageDetailsSchema,
  CheckoutWizardPagePaymentSchema,
  // Order API Schemas
  CreateOrderRequestSchema,
  // Dato CMS Schemas
  DatoCoreImageSchema,
  DatoCorePriceSchema,
  DatoSupercarSchema,
  IframeToParentMessageSchema,
  // Location Store Schemas
  LocationCoordinatesSchema,
  LocationInputSchema,
  LocationStateSchema,
  MapboxFeatureSchema,
  // Mapbox schemas
  MapboxGeocodingResponseSchema,
  MapboxMapMarkerSchema,
  MiddlewareCartResponseSchema,
  // Middleware
  MiddlewareEventsGetEventRequestSchema,
  MiddlewareEventsGetEventResponseSchema,
  MiddlewareEventsListEventsInputSchema,
  MiddlewareEventsListEventsResponseSchema,
  // Newsletter Schemas
  NewsletterResponseSchema,
  OrderResponseSchema,
  ParentToIframeMessageSchema,
  PersistedBookingStateSchema,
  PersistedCartStateSchema,
  PersistedCheckoutStateSchema,
  PersistedLocationStateSchema,
  // User Store Schemas
  PersistedUserStateSchema,
  // RocketRez Cart Schemas
  RocketRezAddContactsRequestSchema,
  RocketRezAddContactsResponseSchema,
  RocketRezAddCouponRequestSchema,
  RocketRezAddCouponResponseSchema,
  RocketRezAddLineItemAddonSchema,
  RocketRezAddLineItemCarSchema,
  RocketRezAddLineItemInsuranceSchema,
  RocketRezAddLineItemRequestSchema,
  RocketRezAddLineItemResponseSchema,
  RocketRezAddLineItemSchema,
  // RocketRez Auth Schemas
  RocketRezAuthTokenRequestSchema,
  RocketRezAuthTokenResponseSchema,
  RocketRezBillingAddressSchema,
  RocketRezCartContactSchema,
  RocketRezCartSchema,
  RocketRezCartStatusSchema,
  RocketRezCartTokenSchema,
  RocketRezCouponSchema,
  RocketRezCreateCartResponseSchema,
  RocketRezEventCustomFieldsSchema,
  RocketRezEventRateCategorySchema,
  RocketRezEventRateSchema,
  RocketRezEventRateTypeSchema,
  RocketRezEventRateTypeWithIdSchema,
  RocketRezEventScheduleDateSchema,
  RocketRezEventScheduleItemSchema,
  RocketRezEventScheduleSeatTypeSchema,
  RocketRezEventSchema,
  RocketRezEventSeatTypeSchema,
  RocketRezEventWithSchedulesSchema,
  RocketRezGetCartResponseSchema,
  RocketRezGetEventProductResponseSchema,
  RocketRezGetEventSchedulesRequestSchema,
  // Payment Gateway Schemas
  RocketRezGetPaymentGatewayClientSecretRequestSchema,
  RocketRezGetPaymentGatewayClientSecretResponseSchema,
  RocketRezGetProductRequestSchema,
  RocketRezGetProductResponseSchema,
  // RocketRez Request/Response Schemas
  RocketRezGetProductsRequestSchema,
  RocketRezGetProductsResponseSchema,
  RocketRezGetRetailProductResponseSchema,
  RocketRezHouseServiceChargeSchema,
  RocketRezLineItemSchema,
  RocketRezListEventSchedulesResponseSchema,
  RocketRezListRetailProductsResponseSchema,
  RocketRezPaginationSchema,
  // Checkout Payment Schemas
  RocketRezPaymentRequestSchema,
  RocketRezPaymentStatusSchema,
  RocketRezProductImageSchema,
  RocketRezProductSchema,
  // RocketRez Product Schemas
  RocketRezProductTypeSchema,
  RocketRezRefreshCartTokenRequestSchema,
  RocketRezRefreshCartTokenResponseSchema,
  RocketRezRemoveCouponSchema,
  RocketRezRetailProductSchema,
  RocketRezScheduleStatusSchema,
  RocketRezUpdateLineItemRequestSchema,
  RocketRezUpdateLineItemResponseSchema,
  // Sendlane Schemas
  SendlaneAddContactRequestSchema,
  // Middleware Events Service
  ServiceBookingConfigGetBookingConfigOutputSchema,
  // Track / Event Finder
  TrackWithDistanceSchema,
  typedFormFieldSchema,
  UserStateSchema,
  UsStateSchema
} from './schemas'

// =============================================================================
// Track Finder
// =============================================================================

export type TrackWithDistance = z.infer<typeof TrackWithDistanceSchema>
export type UsState = z.infer<typeof UsStateSchema>

// =============================================================================
// RocketRez Types - Products
// =============================================================================

export type RocketRezProductTypeValue = z.infer<
  typeof RocketRezProductTypeSchema
>
export type RocketRezScheduleStatusValue = z.infer<
  typeof RocketRezScheduleStatusSchema
>
export type RocketRezEventRateCategoryValue = z.infer<
  typeof RocketRezEventRateCategorySchema
>
export type RocketRezPagination = z.infer<typeof RocketRezPaginationSchema>
export type RocketRezProduct = z.infer<typeof RocketRezProductSchema>
export type RocketRezProductImage = z.infer<typeof RocketRezProductImageSchema>
export type RocketRezRetailProduct = z.infer<
  typeof RocketRezRetailProductSchema
>

// =============================================================================
// RocketRez Types - Event Products
// =============================================================================

export type RocketRezEventRateType = z.infer<
  typeof RocketRezEventRateTypeSchema
>
export type RocketRezEventRate = z.infer<typeof RocketRezEventRateSchema>

export type RateTypePriceInput = {
  price?: number | null
  overridePrice?: number | null
  dynamicPrice?: number | null
  defaultPrice?: number | null
}
export type RateTypePrice = {
  price: number
  compareAtPrice: number | null
  hasPrice: boolean
  isSoldOut: boolean
  lowestPrice: number
  highestPrice: number
}
export type RocketRezEventRateTypeWithId = z.infer<
  typeof RocketRezEventRateTypeWithIdSchema
>
export type RocketRezEventSeatType = z.infer<
  typeof RocketRezEventSeatTypeSchema
>
export type RocketRezEventCustomFields = z.infer<
  typeof RocketRezEventCustomFieldsSchema
>
export type RocketRezEvent = z.infer<typeof RocketRezEventSchema>

// =============================================================================
// RocketRez Types - Schedules
// =============================================================================

export type RocketRezEventScheduleItem = z.infer<
  typeof RocketRezEventScheduleItemSchema
>
export type RocketRezEventScheduleSeatType = z.infer<
  typeof RocketRezEventScheduleSeatTypeSchema
>
export type RocketRezEventScheduleDate = z.infer<
  typeof RocketRezEventScheduleDateSchema
>
export type RocketRezEventWithSchedules = z.infer<
  typeof RocketRezEventWithSchedulesSchema
>

// =============================================================================
// RocketRez Types - Data-only aliases (for DB storage)
// =============================================================================

export type RocketRezEventData = RocketRezEvent
export type RocketRezRetailProductData = RocketRezRetailProduct
export type RocketRezSchedulesData = RocketRezEventScheduleDate[]
export type RocketRezEventPayload = RocketRezGetEventProductResponse
export type RocketRezRetailPayload = RocketRezGetRetailProductResponse
export type RocketRezSchedulesPayload = RocketRezListEventSchedulesResponse

// =============================================================================
// RocketRez Types - Request/Response
// =============================================================================

export type RocketRezGetProductsRequest = z.infer<
  typeof RocketRezGetProductsRequestSchema
>
export type RocketRezGetProductRequest = z.infer<
  typeof RocketRezGetProductRequestSchema
>
export type RocketRezGetEventSchedulesRequest = z.infer<
  typeof RocketRezGetEventSchedulesRequestSchema
>
export type RocketRezGetProductsResponse = z.infer<
  typeof RocketRezGetProductsResponseSchema
>
export type RocketRezGetProductResponse = z.infer<
  typeof RocketRezGetProductResponseSchema
>
export type RocketRezGetEventProductResponse = z.infer<
  typeof RocketRezGetEventProductResponseSchema
>
export type RocketRezGetRetailProductResponse = z.infer<
  typeof RocketRezGetRetailProductResponseSchema
>
export type RocketRezListEventSchedulesResponse = z.infer<
  typeof RocketRezListEventSchedulesResponseSchema
>
export type RocketRezListRetailProductsResponse = z.infer<
  typeof RocketRezListRetailProductsResponseSchema
>

// =============================================================================
// RocketRez Types - Cart
// =============================================================================

export type RocketRezCartStatusValue = z.infer<typeof RocketRezCartStatusSchema>
export type RocketRezBillingAddress = z.infer<
  typeof RocketRezBillingAddressSchema
>
export type RocketRezCartContact = z.infer<typeof RocketRezCartContactSchema>
export type RocketRezHouseServiceCharge = z.infer<
  typeof RocketRezHouseServiceChargeSchema
>
export type RocketRezLineItem = z.infer<typeof RocketRezLineItemSchema>
export type RocketRezCart = z.infer<typeof RocketRezCartSchema>
export type RocketRezCartToken = z.infer<typeof RocketRezCartTokenSchema>
export type RocketRezCreateCartResponse = z.infer<
  typeof RocketRezCreateCartResponseSchema
>
export type RocketRezAddLineItem = z.infer<typeof RocketRezAddLineItemSchema>
export type RocketRezAddLineItemCar = z.infer<
  typeof RocketRezAddLineItemCarSchema
>
export type RocketRezAddLineItemAddon = z.infer<
  typeof RocketRezAddLineItemAddonSchema
>
export type RocketRezAddLineItemInsurance = z.infer<
  typeof RocketRezAddLineItemInsuranceSchema
>
export type RocketRezAddLineItemRequest = z.infer<
  typeof RocketRezAddLineItemRequestSchema
>
export type RocketRezUpdateLineItemRequest = z.infer<
  typeof RocketRezUpdateLineItemRequestSchema
>
export type RocketRezAddContactsRequest = z.infer<
  typeof RocketRezAddContactsRequestSchema
>
export type RocketRezAddCouponRequest = z.infer<
  typeof RocketRezAddCouponRequestSchema
>
export type RocketRezGetCartResponse = z.infer<
  typeof RocketRezGetCartResponseSchema
>
export type RocketRezAddLineItemResponse = z.infer<
  typeof RocketRezAddLineItemResponseSchema
>
export type RocketRezUpdateLineItemResponse = z.infer<
  typeof RocketRezUpdateLineItemResponseSchema
>
export type RocketRezAddContactsResponse = z.infer<
  typeof RocketRezAddContactsResponseSchema
>
export type RocketRezAddCouponResponse = z.infer<
  typeof RocketRezAddCouponResponseSchema
>
export type RocketRezCoupon = z.infer<typeof RocketRezCouponSchema>
export type RocketRezRemoveCoupon = z.infer<typeof RocketRezRemoveCouponSchema>

// =============================================================================
// RocketRez Types - Auth
// =============================================================================

export type RocketRezAuthTokenRequest = z.infer<
  typeof RocketRezAuthTokenRequestSchema
>
export type RocketRezRefreshCartTokenRequest = z.infer<
  typeof RocketRezRefreshCartTokenRequestSchema
>
export type RocketRezAuthTokenResponse = z.infer<
  typeof RocketRezAuthTokenResponseSchema
>
export type RocketRezRefreshCartTokenResponse = z.infer<
  typeof RocketRezRefreshCartTokenResponseSchema
>

// =============================================================================
// Middleware
// =============================================================================

export type ServiceBookingConfigGetBookingConfigOutput = z.infer<
  typeof ServiceBookingConfigGetBookingConfigOutputSchema
>
export type MiddlewareEventsListEventsInput = z.infer<
  typeof MiddlewareEventsListEventsInputSchema
>
export type MiddlewareEventsListEventsResponse = z.infer<
  typeof MiddlewareEventsListEventsResponseSchema
>
export type MiddlewareEventsGetEventRequest = z.infer<
  typeof MiddlewareEventsGetEventRequestSchema
>
export type MiddlewareEventsGetEventResponse = z.infer<
  typeof MiddlewareEventsGetEventResponseSchema
>
export type MiddlewareCartResponse = z.infer<
  typeof MiddlewareCartResponseSchema
>

// =============================================================================
// Cart Service
// =============================================================================

// =============================================================================
// API
// =============================================================================

export type ApiBookingConfigGetBookingConfigResponse = z.infer<
  typeof ApiBookingConfigGetBookingConfigResponseSchema
>
export type ApiCartResponse = z.infer<typeof ApiCartResponseSchema>
export type ApiTracksGetAllTracksResponse = z.infer<
  typeof ApiTracksGetAllTracksResponseSchema
>
export type ApiEventsGetEventResponse = z.infer<
  typeof ApiEventsGetEventResponseSchema
>
export type ApiFormGetFormByHandleResponse = z.infer<
  typeof ApiFormGetFormByHandleResponseSchema
>

// Extract the data type from a successful API response
export type ApiTracksGetAllTracksData = Extract<
  ApiTracksGetAllTracksResponse,
  { status: 'success' }
>['data']

export type ApiFormGetFormByHandleData = Extract<
  ApiFormGetFormByHandleResponse,
  { status: 'success' }
>['data']

// =============================================================================
// Booking Types
// =============================================================================

export type BookingUserSelectionState = z.infer<
  typeof BookingUserSelectionStateSchema
>
export type BookingLocation = z.infer<typeof BookingLocationSchema>
export type BookingCarLineItem = z.infer<typeof BookingCarLineItemSchema>
export type BookingSelectedCar = z.infer<typeof BookingSelectedCarSchema>
export type BookingCoverageOptions = z.infer<
  typeof BookingCoverageOptionsSchema
>
export type BookingRideAlong = z.infer<typeof BookingRideAlongSchema>
export type BookingMediaPackages = z.infer<typeof BookingMediaPackagesSchema>
export type BookingReview = z.infer<typeof BookingReviewSchema>

// Booking Wizard Page Types (output types from schemas)
export type BookingPageChooseDateAndCarFormValue = z.infer<
  typeof BookingPageChooseDateAndCarFormValueSchema
>
export type BookingPageCoverageOptionsFormValue = z.infer<
  typeof BookingPageCoverageOptionsFormValueSchema
>
export type BookingPageMediaPackagesFormValue = z.infer<
  typeof BookingPageMediaPackagesFormValueSchema
>
export type BookingPageRideAlongFormValue = z.infer<
  typeof BookingPageRideAlongFormValueSchema
>
export type BookingWizardPageDateAndCar = z.infer<
  typeof BookingWizardPageDateAndCarSchema
>
export type BookingWizardPageCoverageOptions = z.infer<
  typeof BookingWizardPageCoverageOptionsSchema
>
export type BookingWizardPageRideAlong = z.infer<
  typeof BookingWizardPageRideAlongSchema
>
export type BookingWizardPageMediaPackages = z.infer<
  typeof BookingWizardPageMediaPackagesSchema
>
export type BookingWizardPageReview = z.infer<
  typeof BookingWizardPageReviewSchema
>

export type PersistedBookingState = Omit<
  z.infer<typeof PersistedBookingStateSchema>,
  'track' | 'event'
> & {
  track: TrackDataFragment | null
  event: EventDataFragment | null
}

export type BookingState = Omit<
  z.infer<typeof BookingStateSchema>,
  'track' | 'event'
> & {
  track: TrackDataFragment | null
  event: EventDataFragment | null
}

export type BookingLocationInput = {
  value: string
  title?: string | null
  nickname?: string | null
  startDate?: string | null
  endDate?: string | null
}

export type BookingExperienceInput = string
export type BookingCoverageOptionsInput = {
  value: string | null
  pageIsValid: boolean
  userHasSubmitted: boolean
}
export type BookingRideAlongInput = string
export type BookingMediaPackagesInput = string
export type BookingReviewInput = string

export type BookingWizardPageLocationInput = {
  value: string | null
  pageIsValid: boolean
  userHasSubmitted: boolean
}
export type BookingSetDateAndCarInput = {
  value: BookingPageChooseDateAndCarFormValue | null
  pageIsValid: boolean
  userHasSubmitted: boolean
}
export type BookingWizardPageCoverageOptionsInput = {
  value: BookingPageCoverageOptionsFormValue | null
  pageIsValid: boolean
  userHasSubmitted: boolean
  chooseOnDriveDay?: boolean
}
export type BookingWizardPageRideAlongInput = {
  value: BookingPageRideAlongFormValue | null
  pageIsValid: boolean
  userHasSubmitted: boolean
}
export type BookingWizardPageMediaPackagesInput = {
  value: BookingPageMediaPackagesFormValue | null
  pageIsValid: boolean
  userHasSubmitted: boolean
}
export type BookingWizardPageReviewInput = {
  value: {
    isValid: boolean
    isSubmitted: boolean
  } | null
  pageIsValid: boolean
  userHasSubmitted: boolean
}

export type BookingLapQuantityConfig = {
  label: string
  quantity: number
  laps: number
  description?: string
  booking_config_label_key?: string
  badge?: {
    label: string
  }
  soldOutBadge?: {
    label: string
  }
}

// =============================================================================
// Cart Store Types
// =============================================================================

export type CartLineItemMetadataProperties = z.infer<
  typeof CartLineItemMetadataPropertiesSchema
>
export type CartLineItem = z.infer<typeof CartLineItemSchema>
export type CartLineItemMetadataKey = z.infer<
  typeof CartLineItemMetadataKeySchema
>

export type CartLineItemMetadata = z.infer<typeof CartLineItemMetadataSchema>
export type CartLineItemWithMetadata = {
  lineItem: RocketRezLineItem
  metadata: CartLineItemMetadata | null
}
export type PersistedCartState = z.infer<typeof PersistedCartStateSchema>
export type CartState = z.infer<typeof CartStateSchema>
export type AddItemInput = CartLineItem
export type UpdateItemInput = z.infer<typeof CartUpdateLineItemInputSchema>
export type RemoveItemInput = string

// =============================================================================
// Checkout Store Types
// =============================================================================

export type CheckoutDetailsFormInput = z.infer<
  typeof CheckoutDetailsFormInputSchema
>
export type CheckoutWizardPageDetails = z.infer<
  typeof CheckoutWizardPageDetailsSchema
>
export type CheckoutWizardPageDetailsInput = Omit<
  CheckoutWizardPageDetails,
  'lastSubmittedAt'
>

export type CheckoutWizardPagePayment = z.infer<
  typeof CheckoutWizardPagePaymentSchema
>
export type CheckoutWizardPagePaymentInput = Omit<
  CheckoutWizardPagePayment,
  'lastSubmittedAt'
>

export type PersistedCheckoutState = z.infer<
  typeof PersistedCheckoutStateSchema
>
export type CheckoutState = z.infer<typeof CheckoutStateSchema>

export type TypedFormField = Omit<
  z.infer<typeof typedFormFieldSchema>,
  'handleChange' | 'handleBlur'
> & {
  handleChange: (value: string) => void
  handleBlur: () => void
}

// =============================================================================
// User Store Types
// =============================================================================

export type PersistedUserState = z.infer<typeof PersistedUserStateSchema>
export type UserState = z.infer<typeof UserStateSchema>

// =============================================================================
// Location Store Types
// =============================================================================

export type LocationCoordinates = z.infer<typeof LocationCoordinatesSchema>
export type PersistedLocationState = z.infer<
  typeof PersistedLocationStateSchema
>

export type LocationState = Omit<
  z.infer<typeof LocationStateSchema>,
  'track'
> & {
  track: TrackDataFragment | null
}

export type LocationInput = z.infer<typeof LocationInputSchema>
export type PersistedLocationStateWithTrack = Omit<
  PersistedLocationState,
  'track'
> & {
  track: TrackFragment | null
}

// =============================================================================
// Mapbox schemas
// =============================================================================

export type MapboxGeocodingResponse = z.infer<
  typeof MapboxGeocodingResponseSchema
>
export type MapboxFeature = z.infer<typeof MapboxFeatureSchema>
export type MapboxMapMarker = z.infer<typeof MapboxMapMarkerSchema>

// =============================================================================
// Re-export Dato CMS Types
// =============================================================================

export type DatoSupercar = z.infer<typeof DatoSupercarSchema>
export type DatoCoreImage = z.infer<typeof DatoCoreImageSchema>
export type DatoCorePrice = z.infer<typeof DatoCorePriceSchema>
export type { BookingPageFragment }
export type BookingSupercarGroup = BookingConfigFragment['supercars'][number]
export type BookingSupercarEntry = BookingSupercarGroup['supercars'][number]
export type BookingSupercarMetadata = {
  id: string
  title: string | null
  thumbnail: DatoCoreImage | null
  displayPrice: DatoCorePrice | null
}

// =============================================================================
// Newsletter Types
// =============================================================================

export type NewsletterResponse = z.infer<typeof NewsletterResponseSchema>

// =============================================================================
// Sendlane Types
// =============================================================================

export type SendlaneAddContactRequest = z.infer<
  typeof SendlaneAddContactRequestSchema
>

// =============================================================================
// Checkout Payment Types
// =============================================================================

export type RocketRezPaymentRequest = z.infer<
  typeof RocketRezPaymentRequestSchema
>
export type ParentToIframeMessage = z.infer<typeof ParentToIframeMessageSchema>
export type IframeToParentMessage = z.infer<typeof IframeToParentMessageSchema>
export type RocketRezPaymentStatus = z.infer<
  typeof RocketRezPaymentStatusSchema
>

// =============================================================================
// Payment Gateway Types
// =============================================================================

export type RocketRezGetPaymentGatewayClientSecretRequest = z.infer<
  typeof RocketRezGetPaymentGatewayClientSecretRequestSchema
>
export type RocketRezGetPaymentGatewayClientSecretResponse = z.infer<
  typeof RocketRezGetPaymentGatewayClientSecretResponseSchema
>

// =============================================================================
// Order API Types
// =============================================================================

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>
export type OrderResponse = z.infer<typeof OrderResponseSchema>

// =============================================================================
// Analytics Types
// =============================================================================

export type AnalyticsFacebookPixelContent = z.infer<
  typeof AnalyticsFacebookPixelContentSchema
>
export type AnalyticsFacebookPixelEventData = z.infer<
  typeof AnalyticsFacebookPixelEventDataSchema
>
export type AnalyticsFacebookPixelEvent = z.infer<
  typeof AnalyticsFacebookPixelEventSchema
>

export type AnalyticsGA4Item = z.infer<typeof AnalyticsGA4ItemSchema>
export type AnalyticsGA4EventData = z.infer<typeof AnalyticsGA4EventDataSchema>
export type AnalyticsGA4Event = z.infer<typeof AnalyticsGA4EventSchema>

export type AnalyticsEcommerceEvent = z.infer<
  typeof AnalyticsEcommerceEventSchema
>
