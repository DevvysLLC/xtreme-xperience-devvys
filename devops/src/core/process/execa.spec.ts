import test from 'ava'
import { initExeca } from './execa'

test(`given init call`, async (t) => {
  const result1 = initExeca()
  const result2 = initExeca()

  t.is(result1, result2, 'should memoize the import promise')

  const { execa, execaCommand } = await result1

  t.is(typeof execa, 'function', 'should return execa method')
  t.is(typeof execaCommand, 'function', 'should return execaCommand method')
})
