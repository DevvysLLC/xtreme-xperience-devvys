/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import test from 'ava'
import { AppError } from '../../../core/errors/app-error.js'
import { SendlaneClient } from './sendlane-client.js'

// Mock fetch globally
const originalFetch = global.fetch

test.beforeEach(() => {
  // Reset fetch before each test
  global.fetch = originalFetch
})

test('constructor throws AppError when apiToken is missing', (t) => {
  const error = t.throws(
    () => {
      new SendlaneClient({ apiToken: '' })
    },
    {
      instanceOf: AppError
    }
  )

  if (!error) {
    throw new Error('Expected error to be thrown')
  }

  t.is(error.message, 'SENDLANE_API_TOKEN is required')
  t.is(error.details.traceTag, 'sendlane-client.constructor')
})

test('constructor uses default baseUrl when not provided', (t) => {
  const client = new SendlaneClient({ apiToken: 'test-token' })
  t.truthy(client)
})

test('constructor uses custom baseUrl when provided', (t) => {
  const client = new SendlaneClient({
    apiToken: 'test-token',
    baseUrl: 'https://custom.api.com/v2'
  })
  t.truthy(client)
})

test('request throws AppError when fetch fails', async (t) => {
  const client = new SendlaneClient({ apiToken: 'test-token' })

  // Mock fetch to reject

  global.fetch = (async () => {
    throw new Error('Network error')
  }) as any

  const error = await t.throwsAsync(
    async () => {
      await client.request({
        method: 'POST',
        path: '/lists/123/contacts',
        body: { contacts: [{ email: '[email protected]' }] }
      })
    },
    {
      instanceOf: AppError
    }
  )

  if (!error) {
    throw new Error('Expected error to be thrown')
  }

  t.is(error.message, 'Sendlane API request failed')
  t.is(error.details.traceTag, 'sendlane-client.request')
  t.is(error.details.method, 'POST')
  t.is(error.details.path, '/lists/123/contacts')
})

test('request throws AppError when response is not ok', async (t) => {
  const client = new SendlaneClient({ apiToken: 'test-token' })

  // Mock fetch to return error response

  global.fetch = (async () => {
    return {
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({ error: 'Invalid email address' })
    } as unknown as Response
  }) as any

  const error = await t.throwsAsync(
    async () => {
      await client.request({
        method: 'POST',
        path: '/lists/123/contacts',
        body: { contacts: [{ email: 'invalid' }] }
      })
    },
    {
      instanceOf: AppError
    }
  )

  if (!error) {
    throw new Error('Expected error to be thrown')
  }

  t.is(error.message, 'Sendlane API error response')
  t.is(error.details.traceTag, 'sendlane-client.request')
  t.is(error.details.status, 400)
  t.is(error.details.statusText, 'Bad Request')
  t.deepEqual(error.details.errorData, { error: 'Invalid email address' })
})

test('request handles JSON parsing failure gracefully', async (t) => {
  const client = new SendlaneClient({ apiToken: 'test-token' })

  // Mock fetch to return response with invalid JSON

  global.fetch = (async () => {
    return {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => {
        throw new Error('Invalid JSON')
      }
    } as unknown as Response
  }) as any

  const error = await t.throwsAsync(
    async () => {
      await client.request({
        method: 'GET',
        path: '/lists'
      })
    },
    {
      instanceOf: AppError
    }
  )

  if (!error) {
    throw new Error('Expected error to be thrown')
  }

  t.is(error.details.errorData, null)
})

test('request returns response data on success', async (t) => {
  const client = new SendlaneClient({ apiToken: 'test-token' })

  const mockResponseData = {
    success: true,
    data: { id: 123 }
  }

  // Mock fetch to return success response

  global.fetch = (async () => {
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockResponseData
    } as unknown as Response
  }) as any

  const result = await client.request({
    method: 'POST',
    path: '/lists/123/contacts',
    body: { contacts: [{ email: '[email protected]' }] }
  })

  t.deepEqual(result, mockResponseData)
})

test('request includes proper headers', async (t) => {
  const client = new SendlaneClient({ apiToken: 'secret-token-123' })

  let capturedHeaders: HeadersInit | undefined

  // Mock fetch to capture headers

  global.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    capturedHeaders = init?.headers
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    } as unknown as Response
  }) as any

  await client.request({
    method: 'GET',
    path: '/lists'
  })

  t.truthy(capturedHeaders)
  t.deepEqual(capturedHeaders, {
    'Content-Type': 'application/json',
    Authorization: 'Bearer secret-token-123'
  })
})

test('request includes body in fetch call when provided', async (t) => {
  const client = new SendlaneClient({ apiToken: 'test-token' })

  let capturedBody: string | undefined

  // Mock fetch to capture body

  global.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    } as unknown as Response
  }) as any

  const bodyData = { contacts: [{ email: '[email protected]' }] }

  await client.request({
    method: 'POST',
    path: '/lists/123/contacts',
    body: bodyData
  })

  t.is(capturedBody, JSON.stringify(bodyData))
})

test('request does not include body when not provided', async (t) => {
  const client = new SendlaneClient({ apiToken: 'test-token' })

  let capturedBody: string | undefined

  // Mock fetch to capture body

  global.fetch = (async (url: RequestInfo | URL, init?: RequestInit) => {
    capturedBody = init?.body as string
    return {
      ok: true,
      status: 200,
      json: async () => ({ success: true })
    } as unknown as Response
  }) as any

  await client.request({
    method: 'GET',
    path: '/lists'
  })

  t.is(capturedBody, undefined)
})
