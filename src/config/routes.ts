export const ROUTES = {
  API: {
    BOOKING: {
      ADDONS: '/api/v1/booking/addons',
      CONFIG: '/api/v1/booking/config',
      EVENTS: '/api/v1/booking/events',
      INSURANCE: '/api/v1/booking/insurance',
      MEDIA: '/api/v1/booking/media',
      RIDE_ALONG: '/api/v1/booking/ride-along',
      ORDER: '/api/v1/booking/order'
    },
    CART: {
      GET: '/api/v1/cart',
      ADD: '/api/v1/cart/add',
      REMOVE: '/api/v1/cart/remove',
      CLEAR: '/api/v1/cart/clear',
      UPDATE: '/api/v1/cart/update',
      PAYMENT: '/api/v1/cart/payment',
      COMPLETE: '/api/v1/cart/complete',
      COUPON: {
        ADD: '/api/v1/cart/coupon/add',
        REMOVE: '/api/v1/cart/coupon/remove'
      },
      CONTACT: {
        ADD: '/api/v1/cart/contact/add',
        REMOVE: '/api/v1/cart/contact/remove',
        UPDATE: '/api/v1/cart/contact/update'
      }
    },
    FRONTEND: {
      FORM_BY_HANDLE: (handle: string) => `/api/v1/frontend/form/${handle}`,
      NEWSLETTER: '/api/v1/frontend/newsletter',
      TRACKS: '/api/v1/frontend/tracks',
      TRACK_BY_HANDLE: (handle: string) => `/api/v1/frontend/tracks/${handle}`,
      SEARCH: '/api/v1/frontend/search'
    },
    TYPESENSE: {
      HEALTH_CHECK: '/api/v1/typesense/health-check'
    },
    TOOLS: {
      LOGIN: '/api/v1/tools/login',
      SEARCH: '/api/v1/tools/search'
    }
  },
  BOOKING: {
    HOME: '/booking',
    LOCATION: '/booking/choose-location',
    DATE_AND_CAR: '/booking/choose-date-and-car',
    COVERAGE_OPTIONS: '/booking/coverage-options',
    RIDE_ALONG: '/booking/ride-along',
    MEDIA_PACKAGES: '/booking/media-packages',
    REVIEW: '/booking/review',
    LEGACY: '/booking/legacy'
  },
  CHECKOUT: {
    CONTACTS: '/checkout/contacts',
    PAYMENT: '/checkout/payment',
    COMPLETE: (id: string | number) => `/checkout/complete/${id}`
  },
  ORDER: {
    BY_ID: (id: string | number) => `/order/${id}`
  },
  FRONTEND: {
    HOME: '/',
    ADD_ONS: '/add-ons',
    GIFT_CARDS: '/gift-cards',
    BLOG: {
      LISTING: '/blog'
    },
    SUPERCARS: {
      LISTING: '/supercars'
    },
    TRACKS: {
      LISTING: '/tracks'
    },
    EVENTS: {
      LISTING: '/events'
    }
  },
  TOOLS: {
    LOGIN: '/tools/login',
    SEARCH: '/tools/search'
  },
  ROCKET_REZ: {
    AUTH: {
      TOKEN: '/v1/oauth2/token',
      REFRESH_CART_TOKEN: '/v1/oauth2/token/headless/cart/refresh'
    },
    CART: {
      BASE: '/v1/headless/cart',
      LINE_ITEMS: '/v1/headless/cart/lineitems',
      LINE_ITEM_BY_ID: (id: number) => `/v1/headless/cart/lineitems/${id}`,
      CONTACT: '/v1/headless/cart/contact',
      CONTACT_BY_ID: (id: number) => `/v1/headless/cart/contact/${id}`,
      COUPONS: '/v1/headless/cart/coupons',
      COUPON_BY_ID: (id: number) => `/v1/headless/cart/coupons/${id}`,
      PAYMENT_GATEWAY_CLIENT_SECRET:
        '/v1/headless/payment/gateway-client-secret',
      PROCESS: '/v1/headless/cart/process'
    },
    PRODUCTS: {
      BASE: '/v1/headless/products',
      BY_TYPE_AND_ID: (type: string, id: number) =>
        `/v1/headless/products/${type.toLowerCase()}/${id}`,
      EVENT_SCHEDULES: (eventId: number) =>
        `/v1/headless/products/event/${eventId}/schedules`
    }
  }
} as const
