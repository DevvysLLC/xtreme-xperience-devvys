import { cwd } from '../process/cwd.js'
import { initExeca } from '../process/execa.js'
import { MINUTE_IN_MS } from '../time/constants.js'

export const clearWorkingCopy = async (): Promise<void> => {
  const { execa } = await initExeca()

  const childProcess = execa(
    'git',
    ['stash', 'push', '--include-untracked', '--quiet'],
    {
      cwd,
      timeout: 5 * MINUTE_IN_MS
    }
  )
  childProcess.stdout?.pipe(process.stdout)
  childProcess.stderr?.pipe(process.stderr)

  await childProcess
}
