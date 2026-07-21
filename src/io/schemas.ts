import { z } from 'zod'

// =============================================================================
// Dato schemas for parsing
// Ask claude to regenerate these when you make grahql model changes
// =============================================================================

const DatoTrackDataSeoImageSchema = z
  .object({
    __typename: z.literal('FileField'),
    id: z.string(),
    format: z.string(),
    url: z.string(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    alt: z.string().nullable(),
    title: z.string().nullable(),
    focalPoint: z
      .object({
        __typename: z.literal('focalPoint'),
        x: z.number(),
        y: z.number()
      })
      .nullable(),
    responsiveImage: z
      .object({
        __typename: z.literal('ResponsiveImage'),
        src: z.string(),
        srcSet: z.string(),
        sizes: z.string(),
        height: z.number(),
        aspectRatio: z.number(),
        width: z.number(),
        alt: z.string().nullable(),
        title: z.string().nullable(),
        base64: z.string().nullable(),
        bgColor: z.string().nullable()
      })
      .nullable()
  })
  .passthrough()

const DatoTrackDataSeoSchema = z
  .object({
    __typename: z.literal('SeoField'),
    title: z.string().nullable(),
    description: z.string().nullable(),
    noIndex: z.boolean().nullable(),
    twitterCard: z.string().nullable(),
    image: DatoTrackDataSeoImageSchema.nullable()
  })
  .passthrough()

const DatoTrackDataConfigSchema = z
  .object({
    __typename: z.literal('TrackConfigRecord'),
    id: z.string(),
    title: z.string().nullable(),
    handle: z.string().nullable(),
    seo: DatoTrackDataSeoSchema.nullable()
  })
  .passthrough()

const DatoTrackDataEventModelSchema = z
  .object({
    __typename: z.literal('EventModelRecord'),
    id: z.string(),
    title: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    enabled: z.boolean(),
    soldOut: z.boolean(),
    popular: z.boolean(),
    rocketRezId: z.string().nullable(),
    rocketRezType: z.string().nullable(),
    rocketRezRootId: z.string().nullable()
  })
  .passthrough()

const DatoTrackDataEventSchema = z
  .object({
    __typename: z.literal('EventRecord'),
    id: z.string(),
    model: DatoTrackDataEventModelSchema.nullable()
  })
  .passthrough()

const DatoTrackDataBadgeSchema = z
  .object({
    __typename: z.literal('CoreBadgeRecord'),
    id: z.string(),
    label: z.string().nullable(),
    backgroundColor: z
      .object({
        __typename: z.literal('ColorField'),
        hex: z.string()
      })
      .nullable(),
    color: z
      .object({
        __typename: z.literal('ColorField'),
        hex: z.string()
      })
      .nullable()
  })
  .passthrough()

const DatoTrackDataLocationSchema = z
  .object({
    __typename: z.literal('LatLonField'),
    latitude: z.number(),
    longitude: z.number()
  })
  .passthrough()

const DatoTrackDataModelSchema = z
  .object({
    __typename: z.literal('TrackModelRecord'),
    id: z.string(),
    title: z.string().nullable(),
    nickname: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    region: z.string().nullable(),
    highlights: z.string().nullable(),
    lapLength: z.string().nullable(),
    numberOfLaps: z.string().nullable(),
    elevationChange: z.string().nullable(),
    longestStraight: z.string().nullable(),
    numberOfTurns: z.string().nullable(),
    travelTimes: z.string().nullable(),
    specTitle: z.string().nullable(),
    description: z.string().nullable(),
    location: DatoTrackDataLocationSchema.nullable(),
    events: z.array(DatoTrackDataEventSchema),
    badges: z.array(DatoTrackDataBadgeSchema)
  })
  .passthrough()

export const DatoTrackDataFragmentSchema = z
  .object({
    __typename: z.literal('TrackRecord'),
    id: z.string(),
    config: DatoTrackDataConfigSchema,
    model: DatoTrackDataModelSchema.nullable()
  })
  .passthrough()

const DatoEventTrackConfigSchema = z
  .object({
    __typename: z.literal('TrackConfigRecord'),
    id: z.string(),
    title: z.string().nullable(),
    handle: z.string().nullable()
  })
  .passthrough()

const DatoEventTrackModelSchema = z
  .object({
    __typename: z.literal('TrackModelRecord'),
    title: z.string().nullable(),
    nickname: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    location: DatoTrackDataLocationSchema.nullable()
  })
  .passthrough()

const DatoEventTrackSchema = z
  .object({
    __typename: z.literal('TrackRecord'),
    config: DatoEventTrackConfigSchema,
    model: DatoEventTrackModelSchema.nullable()
  })
  .passthrough()

const DatoEventDataModelSchema = z
  .object({
    __typename: z.literal('EventModelRecord'),
    id: z.string(),
    title: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
    enabled: z.boolean(),
    soldOut: z.boolean(),
    popular: z.boolean().default(false),
    rocketRezId: z.string(),
    rocketRezType: z.string(),
    rocketRezRootId: z.string(),
    track: DatoEventTrackSchema
  })
  .passthrough()

export const DatoEventDataFragmentSchema = z
  .object({
    __typename: z.literal('EventRecord'),
    id: z.string(),
    model: DatoEventDataModelSchema.nullable()
  })
  .passthrough()

export const DatoResponsiveImageSchema = z
  .object({
    src: z.string(),
    srcSet: z.string(),
    sizes: z.string(),
    width: z.number(),
    height: z.number(),
    aspectRatio: z.number(),
    alt: z.string().nullable(),
    title: z.string().nullable(),
    base64: z.string().nullable(),
    bgColor: z.string().nullable()
  })
  .passthrough()

export const DatoFileFieldImageSchema = z
  .object({
    id: z.string(),
    format: z.string(),
    url: z.string(),
    width: z.number().nullable(),
    height: z.number().nullable(),
    alt: z.string().nullable(),
    title: z.string().nullable(),
    responsiveImage: DatoResponsiveImageSchema.nullable()
  })
  .passthrough()

export const DatoCoreImageSchema = z
  .object({
    __typename: z.literal('CoreImageRecord'),
    id: z.string(),
    image: DatoFileFieldImageSchema.nullable(),
    desktopImage: DatoFileFieldImageSchema.nullable()
  })
  .passthrough()

export const DatoCorePriceSchema = z
  .object({
    __typename: z.literal('CorePriceRecord'),
    id: z.string(),
    price: z.number().nullable(),
    compareAtPrice: z.number().nullable()
  })
  .passthrough()

export const DatoSupercarModelSchema = z
  .object({
    rocketRezId: z.string().nullable(),
    title: z.string().nullable(),
    displayPrice: DatoCorePriceSchema.nullable().optional(),
    thumbnail: DatoCoreImageSchema.nullable().optional()
  })
  .passthrough()

export const DatoSupercarSchema = z
  .object({
    __typename: z.literal('SupercarRecord'),
    id: z.string(),
    model: DatoSupercarModelSchema.nullable()
  })
  .passthrough()

export const DatoBookingSupercarConfigSchema = z
  .object({
    supercars: z.array(DatoSupercarSchema)
  })
  .passthrough()

export const DatoBookingPageSchema = z
  .object({
    __typename: z.literal('BookingPageRecord'),
    id: z.string(),
    key: z.string().nullable(),
    title: z.string().nullable(),
    description: z.string().nullable()
  })
  .passthrough()

export const DatoBookingConfigSchema = z
  .object({
    pages: z.array(DatoBookingPageSchema)
  })
  .passthrough()

// =============================================================================
// RocketRez Schemas - Product Types
// =============================================================================

export const RocketRezProductType = {
  RETAIL: 'Retail',
  MEMBERSHIP: 'Membership',
  GIFTCARD: 'Giftcard',
  EVENT: 'Event'
} as const

export const RocketRezProductTypeSchema = z.enum([
  RocketRezProductType.RETAIL,
  RocketRezProductType.MEMBERSHIP,
  RocketRezProductType.GIFTCARD,
  RocketRezProductType.EVENT
])

export const RocketRezPaginationSchema = z.object({
  count: z.number(),
  pageIndex: z.number(),
  pageSize: z.number()
})

export const RocketRezProductSchema = z
  .object({
    id: z.number(),
    type: RocketRezProductTypeSchema.optional(),
    name: z.string(),
    category: z.string().nullable().optional()
  })
  .passthrough()
  .transform((data) => ({
    ...data,
    type: data.type || RocketRezProductType.EVENT,
    category: data.category ?? null
  }))

export const RocketRezProductImageSchema = z.object({
  url: z.string(),
  altText: z.string().nullable()
})

export const RocketRezRetailProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  images: z.array(RocketRezProductImageSchema),
  category: z.string().nullable().optional(),
  type: RocketRezProductTypeSchema.optional(),
  price: z.number().optional(),
  displayPrice: z.number().optional(),
  hasPriceOverride: z.boolean().optional(),
  color: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  hasGratuityEnabled: z.boolean().optional(),
  isEnabled: z.boolean(),
  hasPreventNegativeEnabled: z.boolean().optional(),
  hasInventory: z.boolean().optional()
})

// =============================================================================
// RocketRez Schemas - Event Products
// =============================================================================

export const RocketRezEventRateTypeSchema = z.object({
  type: z.string(),
  price: z.number().nullable().optional(),
  defaultPrice: z.number().nullable().optional(),
  overridePrice: z.number().nullable().optional(),
  dynamicPrice: z.number().nullable().optional(),
  remainingQuantity: z.number().nullable().optional()
})

export const RocketRezEventRateCategory = {
  PREBOOK: 'Prebook',
  AT_TRACK: 'At-Track',
  AVAILABLE: 'Available'
} as const

export const RocketRezEventRateCategorySchema = z
  .union([
    z.enum([
      RocketRezEventRateCategory.PREBOOK,
      RocketRezEventRateCategory.AT_TRACK,
      RocketRezEventRateCategory.AVAILABLE
    ]),
    z.string()
  ])
  .nullable()

export const RocketRezEventRateSchema = z.object({
  id: z.number(),
  name: z.string(),
  count: z.string().nullable().optional(),
  category: RocketRezEventRateCategorySchema,
  rateTypes: z.array(RocketRezEventRateTypeSchema)
})

export const RocketRezEventRateTypeWithIdSchema = z.object({
  id: z.number(),
  rateTypes: z.array(RocketRezEventRateTypeSchema)
})

export const RocketRezEventSeatTypeSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  capacity: z.number(),
  color: z.string().nullable(),
  rates: z.array(RocketRezEventRateSchema)
})

const RocketRezEventCustomFieldSchema = z.object({
  name: z.string(),
  list: z.array(z.string())
})

export const RocketRezEventCustomFieldsSchema = z
  .object({
    customField1: RocketRezEventCustomFieldSchema.nullable().optional(),
    customField2: RocketRezEventCustomFieldSchema.nullable().optional(),
    customField3: RocketRezEventCustomFieldSchema.nullable().optional(),
    customField4: RocketRezEventCustomFieldSchema.nullable().optional()
  })
  .catchall(z.unknown())

export const RocketRezEventSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  images: z.array(RocketRezProductImageSchema),
  category: z.string().nullable().optional(),
  type: RocketRezProductTypeSchema.optional(),
  maxOccupancy: z.number(),
  averageDuration: z.number(),
  color: z.string(),
  thirdPartyEmail: z.string().nullable(),
  customFields: RocketRezEventCustomFieldsSchema,
  canChangeTicketTime: z.boolean(),
  isAvailabilityWarningEnabled: z.boolean(),
  isPassengerInfoRequired: z.boolean(),
  canShareRooms: z.boolean(),
  isEnabled: z.boolean(),
  seatTypes: z.array(RocketRezEventSeatTypeSchema)
})

export const RocketRezScheduleStatus = {
  CLOSED: 'Closed',
  AVAILABLE: 'Available',
  LOCKED: 'Locked'
} as const

export const RocketRezScheduleStatusSchema = z.enum([
  RocketRezScheduleStatus.CLOSED,
  RocketRezScheduleStatus.AVAILABLE,
  RocketRezScheduleStatus.LOCKED
])

export const RocketRezEventScheduleSeatTypeSchema = z.object({
  id: z.number().nullable().optional(),
  name: z.string(),
  capacity: z.number(),
  reserved: z.number().optional(),
  available: z.number().optional(),
  color: z.string().nullable().optional(),
  rates: z.array(RocketRezEventRateSchema).optional()
})

export const RocketRezEventScheduleItemSchema = z.object({
  id: z.number().nullable().optional(),
  siteId: z.number().nullable().optional(),
  scheduleStatus: RocketRezScheduleStatusSchema,
  isAllDay: z.boolean(),
  startTime: z.string(),
  endTime: z.string(),
  notes: z.string().nullable().optional(),
  maxOccupancy: z.number().nullable().optional(),
  reserved: z.number().nullable().optional(),
  available: z.number().nullable().optional(),
  checkedIn: z.number().nullable().optional(),
  customFields: z.record(z.string(), z.unknown()).nullable().optional(),
  rates: z.array(RocketRezEventRateSchema).optional(),
  seatTypes: z.array(RocketRezEventScheduleSeatTypeSchema.nullable()).optional()
})

export const RocketRezEventScheduleDateSchema = z.object({
  date: z.string(),
  schedules: z.array(RocketRezEventScheduleItemSchema)
})

export const RocketRezEventWithSchedulesSchema = RocketRezEventSchema.and(
  z.object({
    schedules: z.array(RocketRezEventScheduleDateSchema)
  })
)

// =============================================================================
// RocketRez Schemas - Data-only aliases (for DB storage)
// =============================================================================

export const RocketRezEventDataSchema = RocketRezEventSchema
export const RocketRezRetailProductDataSchema = RocketRezRetailProductSchema
export const RocketRezSchedulesDataSchema = z.array(
  RocketRezEventScheduleDateSchema
)

// =============================================================================
// RocketRez Schemas - Request/Response
// =============================================================================

export const RocketRezGetProductsRequestSchema = z.object({
  pageSize: z.number().optional(),
  pageIndex: z.number().optional(),
  type: z.array(RocketRezProductTypeSchema).optional(),
  category: z.string().optional()
})

export const RocketRezGetProductRequestSchema = z.object({
  id: z.number(),
  type: RocketRezProductTypeSchema
})

export const RocketRezGetEventSchedulesRequestSchema = z.object({
  pageSize: z.number().optional(),
  pageIndex: z.number().optional(),
  rateId: z.union([z.number(), z.array(z.number())]).optional(),
  siteId: z.number().optional(),
  seatTypeId: z.number().optional(),
  type: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional()
})

export const RocketRezGetProductsResponseSchema = z.object({
  data: z.array(RocketRezProductSchema),
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable(),
  pagination: RocketRezPaginationSchema.optional()
})

export const RocketRezGetProductResponseSchema = z.object({
  data: RocketRezProductSchema, // Already has passthrough() in the schema definition
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezGetEventProductResponseSchema = z.object({
  data: RocketRezEventSchema.passthrough(), // Allow extra fields like type, category
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezGetRetailProductResponseSchema = z.object({
  data: RocketRezRetailProductSchema.passthrough(), // Allow extra fields like type, category
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezGetProductDetailResponseSchema = z.union([
  RocketRezGetEventProductResponseSchema,
  RocketRezGetRetailProductResponseSchema
])

export const RocketRezListEventSchedulesResponseSchema = z.object({
  data: z.array(RocketRezEventScheduleDateSchema),
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable(),
  pagination: RocketRezPaginationSchema.optional()
})

export const RocketRezListRetailProductsResponseSchema = z.object({
  data: z.array(RocketRezRetailProductSchema),
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable(),
  pagination: RocketRezPaginationSchema.optional()
})

// =============================================================================
// RocketRez Schemas - Cart
// =============================================================================

export const CartStatus = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  EXPIRED: 'Expired'
} as const

export const RocketRezCartStatusSchema = z.enum([
  CartStatus.ACTIVE,
  CartStatus.COMPLETED,
  CartStatus.EXPIRED
])

export const RocketRezBillingAddressSchema = z.object({
  addressLine1: z.string(),
  addressLine2: z.string().nullable().optional(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  country: z.string()
})

export const RocketRezCartContactSchema = z.object({
  id: z.number(),
  isPrimary: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  billingAddress: RocketRezBillingAddressSchema.nullable().optional()
})

export const RocketRezHouseServiceChargeSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number(),
  sortOrder: z.number()
})

export const RocketRezTaxSchema = z
  .object({
    id: z.number().nullable().optional(),
    name: z.string().nullable().optional(),
    amount: z.number().nullable().optional(),
    rate: z.number().nullable().optional()
  })
  .passthrough()

export const RocketRezLineItemSchema = z.object({
  id: z.number(),
  productId: z.number(),
  type: z.string(),
  parentLineItemId: z.number().nullable().optional(),
  scheduleId: z.number().nullable().optional(),
  rateId: z.number().nullable().optional(),
  rateType: z.string().nullable().optional(),
  quantity: z.number(),
  price: z.number(),
  discountAmount: z.number().optional(),
  subTotal: z.number(),
  taxTotal: z.number().optional(),
  houseServiceChargeTotal: z.number().optional(),
  houseServiceCharges: z
    .array(RocketRezHouseServiceChargeSchema)
    .nullable()
    .optional(),
  taxes: z.array(RocketRezTaxSchema).nullable().optional(),
  discounts: z.array(z.unknown()).nullable().optional()
})

export const RocketRezCouponSchema = z.object({
  id: z.number(),
  code: z.string().nullable(),
  serial: z.string().nullable(),
  description: z.string().nullable(),
  scope: z.string(),
  type: z.string(),
  value: z.number(),
  total: z.number(),
  lineItemDiscounts: z.array(z.unknown())
})

export const RocketRezCartSchema = z.object({
  id: z.string(),
  orderId: z.number().nullable().optional(),
  status: RocketRezCartStatusSchema,
  currency: z.string(),
  createdDate: z.string(),
  expiryDate: z.string(),
  discountTotal: z.number(),
  subTotal: z.number(),
  variableFeeTotal: z.number(),
  taxTotal: z.number(),
  houseServiceChargeTotal: z.number().optional(),
  total: z.number(),
  houseServiceCharges: z
    .array(RocketRezHouseServiceChargeSchema)
    .nullable()
    .optional(),
  taxes: z.array(RocketRezTaxSchema).nullable().optional(),
  contacts: z.array(RocketRezCartContactSchema),
  metadata: z.unknown().nullable().optional(),
  formResponseIds: z.unknown().nullable().optional(),
  coupons: z.array(RocketRezCouponSchema).optional(),
  lineItems: z.array(RocketRezLineItemSchema)
})

export const RocketRezCartTokenSchema = z.object({
  cartToken: z.string(),
  tokenExpiry: z.string(),
  userGuid: z.string().nullable().optional()
})

export const RocketRezCreateCartResponseSchema = z.object({
  data: z.object({
    cart: RocketRezCartSchema,
    tokenExpiry: z.string(),
    cartToken: z.string()
  }),
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezAddLineItemCarSchema = z.object({
  id: z.number().nullable().optional(),
  type: z.string().nullable().optional(),
  quantity: z.number().nullable().optional(),
  scheduleId: z.number().nullable().optional(),
  rateId: z.number().nullable().optional(),
  rateType: z.string().nullable().optional(),
  parentLineItemId: z.number().nullable().optional()
})

export const RocketRezAddLineItemAddonSchema = z.object({
  id: z.number(),
  type: z.string(),
  quantity: z.number(),
  scheduleId: z.number().nullable().optional(),
  rateId: z.number().nullable().optional(),
  rateType: z.string().nullable().optional(),
  parentLineItemId: z.number().nullable().optional()
})

export const RocketRezAddLineItemInsuranceSchema = z.object({
  id: z.number(),
  type: z.string(),
  quantity: z.number(),
  parentLineItemId: z.number().nullable().optional()
})

export const RocketRezAddLineItemSchema = z.object({
  id: z.number(),
  type: z.string(),
  quantity: z.number(),
  scheduleId: z.number().nullable().optional(),
  rateId: z.number().nullable().optional(),
  seatTypeId: z.number().nullable().optional(),
  rateType: z.string().nullable().optional(),
  parentLineItemId: z.number().nullable().optional()
})

export const RocketRezAddLineItemRequestSchema = z.object({
  lineItems: z.array(RocketRezAddLineItemSchema)
})

export const RocketRezUpdateLineItemRequestSchema = z.object({
  quantity: z.number()
})

export const RocketRezAddContactsRequestSchema = z.object({
  contacts: z.array(
    z.object({
      id: z.number().nullable().optional(),
      isPrimary: z.boolean(),
      firstName: z.string(),
      lastName: z.string(),
      email: z.string(),
      phone: z.string().nullable().optional(),
      billingAddress: RocketRezBillingAddressSchema.nullable().optional()
    })
  )
})

export const RocketRezAddCouponRequestSchema = z.object({
  coupon: z.string().min(1)
})

export const RocketRezGetCartResponseSchema = z.object({
  data: RocketRezCartSchema,
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezAddLineItemResponseSchema = z.object({
  data: RocketRezCartSchema,
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezUpdateLineItemResponseSchema = z.object({
  data: RocketRezCartSchema,
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezAddContactsResponseSchema = z.object({
  data: RocketRezCartSchema,
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezAddCouponResponseSchema = z.object({
  data: RocketRezCartSchema,
  statusCode: z.string(),
  rawContent: z.unknown().nullable(),
  errorMessage: z.string().nullable()
})

export const RocketRezRemoveCouponSchema = z.object({
  id: z.number()
})

// =============================================================================
// RocketRez Schemas - Auth
// =============================================================================

export const RocketRezAuthTokenRequestSchema = z.object({
  client_id: z.string(),
  client_secret: z.string(),
  scope: z.string(),
  grant_type: z.literal('client_credentials')
})

export const RocketRezRefreshCartTokenRequestSchema =
  RocketRezAuthTokenRequestSchema.extend({
    cart_id: z.string()
  })

const RocketRezAuthTokenDataSchema = z.object({
  access_token: z.string(),
  token_type: z.string().optional(),
  expires_in: z.number().optional(),
  expiry: z.string().optional()
})

export const RocketRezAuthTokenResponseSchema = z.object({
  data: RocketRezAuthTokenDataSchema,
  statusCode: z.string(),
  rawContent: z.unknown().nullable().optional(),
  errorMessage: z.string().nullable().optional()
})

export const RocketRezRefreshCartTokenResponseSchema =
  RocketRezAuthTokenResponseSchema

// =============================================================================
// Middleware / Cart
// =============================================================================

export const MiddlewareCartResponseSchema = z.object({
  cart: RocketRezCartSchema,
  cartToken: z.string().nullable(),
  tokenExpiry: z.string().nullable()
})

// =============================================================================
// Middleware / Booking config
// =============================================================================

export const ServiceBookingConfigGetBookingConfigOutputSchema = z.object({
  config: DatoBookingConfigSchema
})

// =============================================================================
// Middleware / Events
// =============================================================================

export const MiddlewareEventsListEventsInputSchema = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional()
})

export const MiddlewareEventsListEventsResponseSchema = z.object({
  events: z.array(RocketRezEventWithSchedulesSchema)
})

export const MiddlewareEventsGetEventRequestSchema = z.object({
  id: z.string()
})

export const MiddlewareEventsGetEventResponseSchema = z.object({
  event: RocketRezEventWithSchedulesSchema
})

// =============================================================================
// API / Base
// =============================================================================

export const ApiPaginationSchema = z.object({
  count: z.number(),
  pageIndex: z.number(),
  pageSize: z.number()
})

const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.discriminatedUnion('status', [
    z
      .object({
        status: z.literal('success'),
        data: dataSchema,
        pagination: ApiPaginationSchema.optional().nullable()
      })
      .strict(),
    z
      .object({
        status: z.literal('error'),
        message: z.string(),
        code: z.string().optional(),
        details: z.unknown().optional()
      })
      .strict()
  ])

// =============================================================================
// API / Events
// =============================================================================

export const ApiEventsListEventsRequestSchema =
  MiddlewareEventsListEventsInputSchema

export const ApiEventsListEventsResponseSchema = ApiResponseSchema(
  MiddlewareEventsListEventsResponseSchema
)

export const ApiEventsGetEventRequestSchema =
  MiddlewareEventsGetEventRequestSchema

export const ApiEventsGetEventResponseSchema = ApiResponseSchema(
  MiddlewareEventsGetEventResponseSchema
)

// =============================================================================
// API / Cart
// =============================================================================

export const ApiCartResponseSchema = ApiResponseSchema(
  MiddlewareCartResponseSchema
)

// =============================================================================
// API Response Schemas / Booking config
// =============================================================================

/**
 * Schema for the booking config response.
 * Uses passthrough to allow all fields from the CMS.
 */
const BookingConfigDataSchema = z.object({}).passthrough().nullable()

export const ApiBookingConfigGetBookingConfigResponseSchema = ApiResponseSchema(
  BookingConfigDataSchema
)

// =============================================================================
// API Response Schemas / Tracks
// =============================================================================

/**
 * Schema for the tracks response.
 * Uses passthrough to allow all fields from the GraphQL query.
 */
const GetAllTracksDataSchema = z.object({}).passthrough()

export const ApiTracksGetAllTracksResponseSchema = ApiResponseSchema(
  GetAllTracksDataSchema
)

// =============================================================================
// API Response Schemas / Form
// =============================================================================

/**
 * Schema for the form response.
 * Uses passthrough to allow all fields from the GraphQL query.
 */
const FormDataSchema = z
  .object({
    form: z.object({}).passthrough().nullable()
  })
  .passthrough()

export const ApiFormGetFormByHandleResponseSchema =
  ApiResponseSchema(FormDataSchema)

// =============================================================================
// Booking Store Schemas
// =============================================================================

export const BookingCarLineItemSchema = z.object({
  id: z.number(),
  type: z.string(),
  quantity: z.number(),
  scheduleId: z.number().nullable(),
  rateId: z.number().nullable(),
  rateType: z.string().nullable()
})

export const BookingPageChooseDateAndCarFormValueSchema = z.object({
  cars: z.array(BookingCarLineItemSchema),
  selectedDate: z.string().nullable(),
  selectedEvent: z.string().nullable(),
  selectedDay: z.string().nullable(),
  activeTabIndex: z.number(),
  isValid: z.boolean(),
  isSubmitted: z.boolean()
})

export const BookingPageCoverageOptionsFormValueSchema = z.object({
  quantity: z.number(),
  id: z.string(),
  type: z.string(),
  isValid: z.boolean(),
  isSubmitted: z.boolean()
})

export const BookingPageRideAlongFormValueSchema = z.object({
  selected: z.boolean(),
  isValid: z.boolean(),
  isSubmitted: z.boolean()
})

export const BookingPageMediaPackagesFormValueSchema = z.object({
  selected: z.boolean(),
  isValid: z.boolean(),
  isSubmitted: z.boolean()
})

export const BookingPageReviewFormValueSchema = z.object({
  isValid: z.boolean(),
  isSubmitted: z.boolean()
})

export const BookingUserSelectionStateSchema = z.object({
  date: z.string(), // ISO 8601 datetime string (e.g., "2024-01-15T10:00:00")
  activeGroupTitle: z.string().optional() // Title of the active supercar group tab
})

export const BookingLocationSchema = z.object({
  value: z.string(),
  title: z.string().nullable().optional(),
  nickname: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional()
})

export const BookingSelectedCarSchema = z.object({
  eventId: z.string(),
  laps: z.number(),
  seatTypeId: z.string(),
  scheduleId: z.string()
})

export const BookingSupercarSeatTypeOverrideEntrySchema = z.object({
  event_id: z.string(),
  seat_type_id: z.string()
})

export const BookingSupercarSeatTypeOverrideSchema = z.array(
  BookingSupercarSeatTypeOverrideEntrySchema
)

export const findSeatTypeOverrideForEvent = ({
  overrideData,
  selectedEventId
}: {
  overrideData: unknown
  selectedEventId: string | null
}) => {
  if (!selectedEventId) {
    return null
  }

  const parsedOverrides =
    BookingSupercarSeatTypeOverrideSchema.safeParse(overrideData)
  if (!parsedOverrides.success) {
    return null
  }

  return (
    parsedOverrides.data.find((entry) => entry.event_id === selectedEventId) ??
    null
  )
}

export const BookingWizardPageLocationSchema = z.object({
  value: z.string().nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

export const BookingWizardPageDateAndCarSchema = z.object({
  value: BookingPageChooseDateAndCarFormValueSchema.nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

export const BookingWizardPageCoverageOptionsSchema = z.object({
  value: BookingPageCoverageOptionsFormValueSchema.nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null),
  chooseOnDriveDay: z.boolean().default(false)
})

export const BookingWizardPageRideAlongSchema = z.object({
  value: BookingPageRideAlongFormValueSchema.nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

export const BookingWizardPageMediaPackagesSchema = z.object({
  value: BookingPageMediaPackagesFormValueSchema.nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

export const BookingWizardPageReviewSchema = z.object({
  value: BookingPageReviewFormValueSchema.nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

// Aliases for store validation (these match BookingWizardPage*Schema structure)
export const BookingCoverageOptionsSchema =
  BookingWizardPageCoverageOptionsSchema
export const BookingRideAlongSchema = BookingWizardPageRideAlongSchema
export const BookingMediaPackagesSchema = BookingWizardPageMediaPackagesSchema
export const BookingReviewSchema = BookingWizardPageReviewSchema

export const PersistedBookingStateSchema = z.object({
  event: DatoEventDataFragmentSchema.nullable(),
  track: DatoTrackDataFragmentSchema.nullable(),
  date_and_car: BookingWizardPageDateAndCarSchema.nullable(),
  coverage_options: BookingWizardPageCoverageOptionsSchema.nullable(),
  ride_along: BookingWizardPageRideAlongSchema.nullable(),
  media_packages: BookingWizardPageMediaPackagesSchema.nullable(),
  review: BookingWizardPageReviewSchema.nullable(),
  intendedPageId: z.string().nullable().default(null)
})

export const BookingStateSchema = PersistedBookingStateSchema.extend({
  currentPage: z.string().nullable(),
  backNavigationFromPath: z.string().nullable(),
  backNavigationRequestedAt: z.string().nullable(),
  error: z.string().nullable(),
  fieldErrors: z.record(z.string(), z.string()).nullable(),
  isLoading: z.boolean()
})

// =============================================================================
// Cart Store Schemas
// =============================================================================

const ResponsiveImageSchema = z.object({
  src: z.string(),
  base64: z.string().nullish(),
  bgColor: z.string().nullish()
})

const ImageDataSchema = z.object({
  format: z.string().optional(),
  url: z.string(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  alt: z.string().nullish(),
  title: z.string().nullish(),
  focalPoint: z.object({ x: z.number(), y: z.number() }).nullish(),
  responsiveImage: ResponsiveImageSchema.nullable()
})

export const CartKeySchema = z.string().regex(/^[^:]+:[^:]+$/)

export const CartLineItemSchema = z.object({
  id: z.string(),
  type: z.enum([
    'experience',
    'car',
    'addon',
    'media_package',
    'ride_along',
    'insurance'
  ]),
  name: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  quantity: z.number().min(1).default(1),
  price: z.number(),
  compareAtPrice: z.number().nullable().optional(),
  date: z.string().optional(),
  image: z
    .object({
      id: z.string(),
      image: ImageDataSchema.nullable(),
      desktopImage: ImageDataSchema.nullable()
    })
    .optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
})

export const CartLineItemMetadataKeySchema = z
  .string()
  .regex(/^[A-Za-z0-9+/]+=*$/)

export const CartLineItemMetadataPropertiesTypeSchema = z.enum([
  'car',
  'addon',
  'insurance'
])

export const CartLineItemMetadataPropertiesSchema = z
  .object({
    date: z.string().nullable().optional(),
    laps: z.number().nullable().optional(),
    lapsPerSession: z.number().nullable().optional()
  })
  .passthrough()

export const CartLineItemMetadataSchema = z.object({
  type: CartLineItemMetadataPropertiesTypeSchema,
  key: CartLineItemMetadataKeySchema.optional(),
  title: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  isMulticar: z.boolean().nullable().optional(),
  isRideAlong: z.boolean().nullable().optional(),
  multicarCount: z.number().nullable().optional(),
  properties: CartLineItemMetadataPropertiesSchema.nullable().optional()
})

export const PersistedCartStateSchema = z.object({
  cartKey: z.string().nullable().optional(),
  tokenExpiry: z.string().nullable().optional(),
  cartData: RocketRezCartSchema.nullable().optional(),
  metadata: z.array(CartLineItemMetadataSchema).default([]),
  chooseOnDriveDay: z.boolean().default(false),
  timerStartedAt: z.string().nullable().optional()
})

// =============================================================================
// Order API schemas
// =============================================================================

const OrderLocationSchema = z.object({
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  accuracy: z.number().positive().nullable(),
  timestamp: z.number().positive().nullable(),
  label: z.string().nullable(),
  track: DatoTrackDataFragmentSchema.nullable()
})

export const CreateOrderRequestSchema = z.object({
  orderId: z.number(),
  userGuid: z.string(),
  order: RocketRezCartSchema,
  metadata: z.array(CartLineItemMetadataSchema).nullable().optional(),
  location: OrderLocationSchema.nullable().optional()
})

export const OrderResponseSchema = z.object({
  uid: z.string().uuid(),
  externalId: z.number(),
  userGuid: z.string(),
  email: z.string(),
  order: RocketRezCartSchema,
  metadata: z.array(CartLineItemMetadataSchema).nullable().optional(),
  location: OrderLocationSchema.nullable().optional(),
  viewedAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export const CartStateSchema = PersistedCartStateSchema.extend({
  isOpen: z.boolean(),
  isLoading: z.boolean(),
  isMutating: z.boolean(),
  isInitializing: z.boolean(),
  error: z.string().nullable(),
  chooseOnDriveDay: z.boolean().default(false),
  timerStartedAt: z.string().nullable().optional()
})

export const CartUpdateLineItemInputSchema = z.object({
  id: z.string(),
  quantity: z.number().min(1).optional()
})

// =============================================================================
// Track Finder Schemas
// =============================================================================

export const TrackWithDistanceSchema = z.object({
  track: DatoTrackDataFragmentSchema,
  distance: z.number()
})

export const UsStateSchema = z.object({
  id: z.number(),
  label: z.string(),
  code: z.string(),
  iso_3166_2: z.string(),
  fips: z.string(),
  lat: z.number(),
  long: z.number()
})

// =============================================================================
// Checkout Store Schemas
// =============================================================================

export const CheckoutStringEmailSchema = z.string().email()
export const CheckoutStringUsPhoneNumberSchema = z.string().regex(/^\d{10}$/)

export const CheckoutDetailsFormInputSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: CheckoutStringEmailSchema,
  phone: CheckoutStringUsPhoneNumberSchema,
  addressLine1: z.string(),
  addressLine2: z.string().optional(),
  city: z.string(),
  province: z.string(),
  postalCode: z.string(),
  country: z.string()
})

export const CheckoutWizardPageDetailsSchema = z.object({
  value: CheckoutDetailsFormInputSchema.nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

export const CheckoutWizardPagePaymentSchema = z.object({
  value: z.string().nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

export const CheckoutWizardPageCompleteSchema = z.object({
  value: z.string().nullable().optional(),
  pageIsValid: z.boolean().default(false),
  userHasSubmitted: z.boolean().default(false),
  lastSubmittedAt: z.string().nullable().default(null)
})

export const PersistedCheckoutStateSchema = z.object({
  details: CheckoutWizardPageDetailsSchema.nullable(),
  payment: CheckoutWizardPagePaymentSchema.nullable()
})

export const CheckoutStateSchema = PersistedCheckoutStateSchema.extend({
  error: z.string().nullable()
})

// =============================================================================
// Checkout Payment Schemas
// =============================================================================

export const RocketRezPaymentRequestBillingAddressSchema = z
  .object({
    Address1: z.string().nullable().optional(),
    Address2: z.string().nullable().optional(),
    City: z.string().nullable().optional(),
    CountryShortName2: z.string().nullable().optional(),
    ProvinceId: z.number().nullable().optional(),
    PostalCode: z.string().nullable().optional()
  })
  .nullable()
  .optional()

export const RocketRezPaymentRequestCreditCardSchema = z
  .object({
    Type: z.string().nullable().optional(),
    Cvv: z.string().nullable().optional(),
    Expiry: z.string().nullable().optional(),
    Name: z.string().nullable().optional(),
    Number: z.string().nullable().optional()
  })
  .nullable()
  .optional()

export const RocketRezPaymentRequestSchema = z.object({
  PaymentMethodId: z.number(),
  CartId: z.union([z.number(), z.string()]),
  PaymentTotal: z.number(),
  returnUrl: z.string().optional(),
  RecaptchaToken: z.string().nullable().optional(),
  FirstName: z.string().nullable().optional(),
  LastName: z.string().nullable().optional(),
  Email: z.string().nullable().optional(),
  CompanyName: z.string().nullable().optional(),
  MobilePhoneNumber: z.string().nullable().optional(),
  HomePhoneNumber: z.string().nullable().optional(),
  BillingAddress: RocketRezPaymentRequestBillingAddressSchema,
  SMSConsent: z.boolean().optional(),
  CreditCard: RocketRezPaymentRequestCreditCardSchema,
  allowSecondaryPayments: z.boolean().optional(),
  SecondaryPayments: z.array(z.unknown()).optional()
})

export const ParentToIframeMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('INIT'),
    cartId: z.union([z.number(), z.string()]),
    paymentMethodId: z.number().optional()
  }),
  z.object({
    type: z.literal('PROCESS_PAYMENT'),
    clientSecret: z.string(),
    cartToken: z.string(),
    userGuid: z.string(),
    paymentRequest: RocketRezPaymentRequestSchema
  }),
  z.object({
    type: z.literal('RESUME_PAYMENT'),
    clientSecret: z.string(),
    redirectStatus: z.string().optional(),
    cartId: z.union([z.number(), z.string()]),
    cartToken: z.string(),
    userGuid: z.string(),
    paymentMethodId: z.number(),
    paymentRequest: RocketRezPaymentRequestSchema
  })
])

export const IframeToParentMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('READY')
  }),
  z.object({
    type: z.literal('PAYMENT_AUTH_SUCCESS'),
    paymentIntentId: z.string().optional(),
    status: z.string().optional()
  }),
  z.object({
    type: z.literal('PAYMENT_AUTH_ERROR'),
    error: z.string().optional()
  }),
  z.object({
    type: z.literal('PAYMENT_SUCCESS'),
    paymentIntentId: z.string().optional(),
    orderId: z.union([z.string(), z.number()]).optional(),
    status: z.string().optional()
  }),
  z.object({
    type: z.literal('PAYMENT_ERROR'),
    error: z.string().optional()
  }),
  z.object({
    type: z.literal('UNKNOWN_MESSAGE_TYPE')
  })
])

export const RocketRezPaymentStatusSchema = z.enum([
  'idle',
  'loading_iframe',
  'ready',
  'processing_payment',
  'authorizing',
  'success',
  'error'
])

// =============================================================================
// Payment Gateway Schemas
// =============================================================================

export const RocketRezGetPaymentGatewayClientSecretRequestSchema = z.object({})

export const RocketRezGetPaymentGatewayClientSecretResponseSchema = z.object({
  result: z.object({
    data: z
      .object({
        clientSecret: z.string()
      })
      .nullable(),
    statusCode: z.string().optional(),
    errorMessage: z.string().nullable().optional()
  })
})

// =============================================================================
// Location Store Schemas
// =============================================================================

export const LocationCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive().nullable(),
  timestamp: z.number().positive().nullable()
})

export const PersistedLocationStateSchema = OrderLocationSchema

export const LocationStateSchema = PersistedLocationStateSchema.extend({
  error: z.string().nullable(),
  isLoading: z.boolean()
})

export const LocationInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive().optional(),
  label: z.string().optional()
})

// =============================================================================
// Mapbox schemas
// =============================================================================

export const MapboxFeatureSchema = z.object({
  id: z.string(),
  type: z.literal('Feature'),
  place_type: z.array(z.string()),
  relevance: z.number(),
  properties: z.record(z.string(), z.unknown()),
  text: z.string(),
  place_name: z.string(),
  center: z.tuple([z.number(), z.number()]),
  geometry: z.object({
    type: z.literal('Point'),
    coordinates: z.tuple([z.number(), z.number()])
  }),
  context: z.array(z.unknown()).optional()
})

export const MapboxGeocodingResponseSchema = z.object({
  type: z.literal('FeatureCollection'),
  query: z.array(z.string()),
  features: z.array(MapboxFeatureSchema),
  attribution: z.string()
})

export const MapboxMapMarkerSchema = z.object({
  id: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  label: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  trackHandle: z.string().optional()
})

// =============================================================================
// Newsletter Schemas
// =============================================================================

export const NewsletterSubscribeRequestSchema = z.object({
  email: z.email({ message: 'Invalid email address' })
})

export const NewsletterResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    message: z.string()
  }),
  z.object({
    status: z.literal('error'),
    message: z.string(),
    errors: z
      .array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string()
        })
      )
      .optional()
  }),
  z.object({
    status: z.literal('internal_error'),
    message: z.string()
  })
])

// =============================================================================
// Sendlane Schemas
// =============================================================================

export const SendlaneAddContactRequestSchema = z.object({
  email: z.email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional()
})

// =============================================================================
// Form Submission Schemas
// =============================================================================

export const FormProviderTypeSchema = z.enum(['hubspot', 'zendesk'])

export const FormFieldSchema = z.object({
  name: z.string().min(1),
  value: z.string()
})

export const FormProviderConfigSchema = z.object({
  // HubSpot-specific
  formGuid: z.string().optional(),
  pageUri: z.string().optional(),
  pageName: z.string().optional(),

  // Zendesk-specific (for future implementation)
  ticketSubject: z.string().optional(),
  ticketPriority: z.string().optional()
})

export const FormSubmissionRequestSchema = z.object({
  provider: FormProviderTypeSchema,
  fields: z.array(FormFieldSchema).min(1),
  config: FormProviderConfigSchema.optional()
})

export const FormSubmissionResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('success'),
    message: z.string()
  }),
  z.object({
    status: z.literal('error'),
    message: z.string(),
    errors: z
      .array(
        z.object({
          path: z.array(z.union([z.string(), z.number()])),
          message: z.string()
        })
      )
      .optional()
  })
])

// =============================================================================
// User Store Schemas
// =============================================================================

export const PersistedUserStateSchema = z.object({
  guid: z.string().nullable()
})

export const UserStateSchema = z.object({
  guid: z.string().nullable()
})

// =============================================================================
// Contacts form (checkout details)
// =============================================================================

export const ContactEmailSchema = z.string().min(1, 'required').email('invalid')

export const ContactPhoneSchema = z
  .string()
  .refine(
    (val) => val.trim() === '' || /^\d{10}$/.test(val.replace(/\D/g, '')),
    'invalid'
  )

export const ContactPostalCodeSchema = z
  .string()
  .refine(
    (val) => val.trim() === '' || /^\d{5}(-\d{4})?$/.test(val.trim()),
    'invalid'
  )

export const ContactsFormSchema = z.object({
  firstName: z.string().min(1, 'required'),
  lastName: z.string().min(1, 'required'),
  email: ContactEmailSchema,
  phone: z.string(),
  addressLine1: z.string().min(1, 'required'),
  addressLine2: z.string(),
  city: z.string().min(1, 'required'),
  province: z.string().min(1, 'required'),
  postalCode: z.string().min(1, 'required'),
  country: z.string().min(1, 'required')
})

export type ContactsFormValues = z.infer<typeof ContactsFormSchema>

/** Form field API shape (e.g. TanStack Form field render prop) – name, state, handlers */
export const typedFormFieldSchema = z.object({
  name: ContactsFormSchema.keyof(),
  state: z.object({
    value: z.string(),
    meta: z.object({
      errors: z.array(z.string().optional())
    })
  }),
  handleChange: z.function({ input: [z.string()], output: z.void() }),
  handleBlur: z.function({ output: z.void() })
})

// =============================================================================
// Analytics - Facebook Pixel
// =============================================================================

export const AnalyticsFacebookPixelContentSchema = z.object({
  id: z.string(),
  quantity: z.number(),
  item_price: z.number().optional()
})

export const AnalyticsFacebookPixelEventDataSchema = z.object({
  content_name: z.string().optional(),
  content_category: z.string().optional(),
  content_ids: z.array(z.string()).optional(),
  contents: z.array(AnalyticsFacebookPixelContentSchema).optional(),
  content_type: z.enum(['product', 'product_group']).optional(),
  value: z.number().optional(),
  currency: z.string().optional(),
  num_items: z.number().optional()
})

export const AnalyticsFacebookPixelEventSchema = z.object({
  event: z.enum([
    'AddToCart',
    'InitiateCheckout',
    'Purchase',
    'ViewContent',
    'AddPaymentInfo'
  ]),
  data: AnalyticsFacebookPixelEventDataSchema
})

// =============================================================================
// Analytics - GA4 (Google Analytics 4)
// =============================================================================

export const AnalyticsGA4ItemSchema = z.object({
  item_id: z.string(),
  item_name: z.string(),
  item_category: z.string().optional(),
  item_category2: z.string().optional(),
  item_category3: z.string().optional(),
  item_category4: z.string().optional(),
  item_category5: z.string().optional(),
  item_brand: z.string().optional(),
  item_variant: z.string().optional(),
  price: z.number().optional(),
  quantity: z.number().optional(),
  index: z.number().optional(),
  discount: z.number().optional(),
  affiliation: z.string().optional(),
  coupon: z.string().optional(),
  currency: z.string().optional(),
  location_id: z.string().optional(),
  item_list_id: z.string().optional(),
  item_list_name: z.string().optional()
})

export const AnalyticsGA4EventDataSchema = z.object({
  currency: z.string().optional(),
  value: z.number().optional(),
  items: z.array(AnalyticsGA4ItemSchema).optional(),
  transaction_id: z.string().optional(),
  affiliation: z.string().optional(),
  coupon: z.string().optional(),
  payment_type: z.string().optional(),
  shipping_tier: z.string().optional(),
  shipping: z.number().optional(),
  tax: z.number().optional(),
  item_list_id: z.string().optional(),
  item_list_name: z.string().optional()
})

export const AnalyticsGA4EventSchema = z.object({
  event: z.enum([
    'add_to_cart',
    'remove_from_cart',
    'view_cart',
    'begin_checkout',
    'add_shipping_info',
    'add_payment_info',
    'purchase',
    'view_item'
  ]),
  ecommerce: AnalyticsGA4EventDataSchema
})

// =============================================================================
// Analytics - Unified Ecommerce Event
// =============================================================================

export const AnalyticsEcommerceEventSchema = z.object({
  type: z.enum([
    'add_to_cart',
    'remove_from_cart',
    'view_cart',
    'begin_checkout',
    'add_shipping_info',
    'add_payment_info',
    'purchase'
  ]),
  cart: z.unknown(), // RocketRezCart type
  metadata: z.array(z.unknown()).optional(), // CartLineItemMetadata array
  input: z.unknown().optional() // Original mutation input
})
