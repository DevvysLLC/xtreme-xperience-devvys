/**
 * RocketRez IO types - All schemas and types
 */

// ============================================================================
// Authentication Types
// ============================================================================

export type AuthTokenRequest = {
  client_id: string
  client_secret: string
  scope: string
  grant_type: 'client_credentials'
}

export type AuthTokenResponse = {
  access_token: string
  expiry: string
}

export type RefreshCartTokenRequest = AuthTokenRequest & {
  cart_id: string
}

export type RefreshCartTokenResponse = AuthTokenResponse

// ============================================================================
// Products Types
// ============================================================================

export type ProductType = 'Retail' | 'Membership' | 'Giftcard' | 'Event'

export type Product = {
  id: number
  type: ProductType
  name: string
  category: string | null
}

export type GetProductsRequest = {
  pageSize?: number
  pageIndex?: number
  type?: ProductType[]
  category?: string
}

export type Pagination = {
  count: number
  pageIndex: number
  pageSize: number
}

export type GetProductsResponse = {
  data: Product[]
  statusCode: string
  rawContent: unknown | null
  errorMessage: string | null
  pagination: Pagination
}

export type GetProductRequest = {
  id: number
}

export type GetProductResponse = {
  data: Product
  statusCode: string
  rawContent: unknown | null
  errorMessage: string | null
}

// ============================================================================
// Cart Types
// ============================================================================

export type CartStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED'

export type BillingAddress = {
  addressLine1: string
  addressLine2?: string | null
  city: string
  province: string
  postalCode: string
  country: string
}

export type CartContact = {
  id: number
  isPrimary: boolean
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  billingAddress?: BillingAddress | null
}

export type HouseServiceCharge = {
  id: number
  name: string
  amount: number
  sortOrder: number
}

export type LineItem = {
  id: number
  productId: number
  type: string
  scheduleId?: number | null
  rateId?: number | null
  rateType?: string | null
  quantity: number
  price: number
  discountAmount?: number
  subTotal: number
  taxTotal?: number
  houseServiceChargeTotal?: number
  houseServiceCharges?: HouseServiceCharge[] | null
  taxes?: unknown[] | null
  discounts?: unknown[] | null
}

export type CartCoupon = {
  id: number
  code: string | null
  serial: string | null
  description: string | null
  scope: string
  type: string
  value: number
  total: number
  lineItemDiscounts: unknown[]
}

export type Cart = {
  id: string
  orderId?: number | null
  status: CartStatus
  currency: string
  createdDate: string
  expiryDate: string
  discountTotal: number
  subTotal: number
  variableFeeTotal: number
  taxTotal: number
  houseServiceChargeTotal?: number
  total: number
  houseServiceCharges?: HouseServiceCharge[] | null
  taxes?: unknown[] | null
  contacts: CartContact[]
  metadata?: unknown | null
  formResponseIds?: unknown | null
  coupons?: CartCoupon[]
  lineItems: LineItem[]
}

export type GetCartResponse = {
  data: Cart
  statusCode: string
  rawContent: unknown | null
  errorMessage: string | null
}

export type AddLineItemRequest = {
  lineItems: {
    id: number
    type: string
    quantity: number
    scheduleId?: number | null
    rateId?: number | null
    seatTypeId?: number | null
    rateType?: string | null
  }[]
}

export type AddLineItemResponse = {
  data: Cart
  statusCode: string
  rawContent: unknown | null
  errorMessage: string | null
}

export type UpdateLineItemRequest = {
  quantity: number
}

export type UpdateLineItemResponse = {
  data: Cart
  statusCode: string
  rawContent: unknown | null
  errorMessage: string | null
}

export type AddContactsRequest = {
  contacts: {
    id?: number | null
    isPrimary: boolean
    firstName: string
    lastName: string
    email: string
    phone?: string | null
    billingAddress?: BillingAddress | null
  }[]
}

export type AddContactsResponse = {
  data: Cart
  statusCode: string
  rawContent: unknown | null
  errorMessage: string | null
}

export type AddCouponRequest = {
  code?: string | null
  serial?: string | null
}

export type AddCouponResponse = {
  data: Cart
  statusCode: string
  rawContent: unknown | null
  errorMessage: string | null
}
