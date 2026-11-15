export const CART_STORAGE_KEY = 'cart-store'
export const LOG_NAMESPACE = 'cart'
export const CART_HOLD_DURATION_MINUTES = 20
export const CART_HOLD_DURATION_MS = CART_HOLD_DURATION_MINUTES * 60 * 1000

export const CART_ERRORS = {
  NO_CART_KEY: 'No cart key available',
  INVALID_RESPONSE: 'Invalid response format',
  OPERATION_IN_PROGRESS: 'Cart operation already in progress'
} as const
