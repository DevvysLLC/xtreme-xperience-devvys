import test from 'ava'
import type { Equal, Expect } from '../test-assertions'

test(`given Promise rejection`, async (t) => {
  Promise.reject('string instead of Error').catch((err) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type tests = [Expect<Equal<unknown, typeof err>>]

    t.false(err instanceof Error)
  })

  Promise.reject('string instead of Error').then(
    () => {},
    (err) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      type tests = [Expect<Equal<unknown, typeof err>>]

      t.false(err instanceof Error)
    }
  )
})
