/**
 * CartKey format: "cartId:cartToken"
 * Combines cart ID and token into a single string for simpler storage/transmission
 */
export const CartKeyHelpers = {
  create: (cartId: string, cartToken: string): string => {
    return `${cartId}:${cartToken}`
  },

  parse: (
    cartKey: string | null | undefined
  ): { cartId: string; cartToken: string } | null => {
    if (!cartKey) {
      return null
    }
    const parts = cartKey.split(':')
    if (parts.length !== 2) {
      return null
    }
    const [cartId, cartToken] = parts
    if (!cartId || !cartToken) {
      return null
    }
    return { cartId, cartToken }
  },

  getToken: (cartKey: string | null | undefined): string | null => {
    const parsed = CartKeyHelpers.parse(cartKey)
    return parsed?.cartToken ?? null
  },

  getId: (cartKey: string | null | undefined): string | null => {
    const parsed = CartKeyHelpers.parse(cartKey)
    return parsed?.cartId ?? null
  },

  fromApiResponse: (data: {
    cartToken: string | null
    cart: { id: string }
    tokenExpiry: string | null
  }): { cartKey: string; tokenExpiry: string | null } | null => {
    if (!data.cartToken || !data.cart.id) {
      return null
    }
    return {
      cartKey: CartKeyHelpers.create(data.cart.id, data.cartToken),
      tokenExpiry: data.tokenExpiry
    }
  }
}
