import test from 'ava'
import { cwd } from './cwd.js'

test('CWD helper', async (t) => {
  if (!process.env.WORKDIR) {
    throw new Error('WORKDIR environment variable not set')
  }

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  t.is(cwd, process.env.WORKDIR)
})
