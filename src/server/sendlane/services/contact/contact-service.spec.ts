/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import test from 'ava'
import type { SendlaneClient } from '../../client/sendlane-client.js'
import { SendlaneContactService } from './contact-service.js'

// Mock client
const createMockClient = (
  requestImpl?: (options: unknown) => Promise<unknown>
): SendlaneClient => {
  return {
    request: requestImpl ?? (async () => ({ success: true }))
  } as SendlaneClient
}

test('addContact calls client with correct path and method', async (t) => {
  type CapturedOptions = {
    method: string
    path: string
    body?: unknown
  }

  let capturedOptions: CapturedOptions | null = null

  const mockClient = createMockClient(
    async (options: unknown): Promise<unknown> => {
      capturedOptions = options as CapturedOptions
      return { success: true }
    }
  )

  const service = new SendlaneContactService(mockClient)

  await service.addContact({
    email: '[email protected]',
    listId: 123
  })

  t.truthy(capturedOptions)
  t.is(capturedOptions!.method, 'POST')
  t.is(capturedOptions!.path, '/lists/123/contacts')
})

test('addContact wraps contact in contacts array', async (t) => {
  let capturedBody: unknown = null

  const mockClient = createMockClient(async (options) => {
    capturedBody = (
      options as {
        body?: unknown
      }
    ).body
    return { success: true }
  })

  const service = new SendlaneContactService(mockClient)

  await service.addContact({
    email: '[email protected]',
    listId: 123
  })

  t.deepEqual(capturedBody, {
    contacts: [{ email: '[email protected]' }]
  })
})

test('addContact includes optional fields when provided', async (t) => {
  let capturedBody: unknown = null

  const mockClient = createMockClient(async (options) => {
    capturedBody = (
      options as {
        body?: unknown
      }
    ).body
    return { success: true }
  })

  const service = new SendlaneContactService(mockClient)

  await service.addContact({
    email: '[email protected]',
    listId: 123,
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890'
  })

  t.deepEqual(capturedBody, {
    contacts: [
      {
        email: '[email protected]',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1234567890'
      }
    ]
  })
})

test('addContact excludes optional fields when not provided', async (t) => {
  let capturedBody: unknown = null

  const mockClient = createMockClient(async (options) => {
    capturedBody = (
      options as {
        body?: unknown
      }
    ).body
    return { success: true }
  })

  const service = new SendlaneContactService(mockClient)

  await service.addContact({
    email: '[email protected]',
    listId: 456
  })

  t.truthy(capturedBody)
  const body = capturedBody as { contacts: Record<string, unknown>[] }
  const contact = body.contacts[0]

  t.truthy(contact)
  if (contact) {
    t.is(contact.email, '[email protected]')
    t.false('first_name' in contact)
    t.false('last_name' in contact)
    t.false('phone' in contact)
  }
})

test('addContact propagates client errors', async (t) => {
  const expectedError = new Error('API request failed')

  const mockClient = createMockClient(async () => {
    throw expectedError
  })

  const service = new SendlaneContactService(mockClient)

  const error = await t.throwsAsync(
    async () => {
      await service.addContact({
        email: '[email protected]',
        listId: 123
      })
    },
    {
      message: 'API request failed'
    }
  )

  t.is(error, expectedError)
})

test('addContact handles different list IDs correctly', async (t) => {
  const capturedPaths: string[] = []

  const mockClient = createMockClient(async (options) => {
    capturedPaths.push(
      (
        options as {
          path: string
        }
      ).path
    )
    return { success: true }
  })

  const service = new SendlaneContactService(mockClient)

  await service.addContact({
    email: '[email protected]',
    listId: 1
  })

  await service.addContact({
    email: '[email protected]',
    listId: 999999
  })

  t.deepEqual(capturedPaths, ['/lists/1/contacts', '/lists/999999/contacts'])
})
