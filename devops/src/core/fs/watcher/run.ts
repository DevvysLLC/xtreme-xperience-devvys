import Path from 'node:path'
import { DevOpsError } from '../../errors/index.js'
import { initLogger } from '../../logger/index.js'
import { makeLogErrorDetails } from '../../logger/log-error-details.js'
import { initExeca } from '../../process/execa.js'
import { workdir as cwd } from '../../process/workdir.js'
import { isPresent } from '../../typescript/is-present.js'

export type Params = {
  name: string
  watched: string[]
  taskFile: string
  debounce?: number
  extensions?: string[]
  ignoreGlobs?: string[]
  onBusyAction?: 'do-nothing' | 'queue'
  runOnStart?: boolean
}

const logger = initLogger().child({ name: 'file-watcher' })
const logErrorDetails = makeLogErrorDetails(logger)

export const watchFiles = ({
  name,
  taskFile,
  watched,
  debounce = 250,
  extensions = [],
  ignoreGlobs = [],
  runOnStart = false,
  onBusyAction = 'do-nothing'
}: Params) => {
  if (!name) {
    throw new DevOpsError('Watch task name is invalid', { taskFile })
  }

  const run = async (): Promise<void> => {
    try {
      const { execa } = await initExeca()

      const watchProcess = execa(
        'watchexec',
        [
          '--no-meta',
          '--no-shell',
          '--project-origin',
          cwd,
          '--debounce',
          debounce.toString(),
          '--on-busy-update',
          onBusyAction,
          runOnStart ? null : '--postpone',
          ...extensions.flatMap((ext) => {
            if (!ext) {
              return []
            }

            return ['--exts', ext]
          }),
          ...ignoreGlobs.flatMap((glob) => {
            if (!glob) {
              return []
            }

            return ['--ignore', glob]
          }),
          ...watched.flatMap((path) => {
            if (!path) {
              return []
            }

            return ['--watch', path]
          }),
          '--',
          'node',
          Path.resolve(cwd, taskFile)
        ].filter(isPresent),
        { cwd }
      )

      watchProcess.stdout?.pipe(process.stdout)
      watchProcess.stderr?.pipe(process.stderr)

      await watchProcess
    } catch (_err) {
      const err = logErrorDetails(_err)

      throw err
    }
  }

  Object.defineProperty(run, 'name', {
    value: name,
    enumerable: false,
    configurable: true
  })

  return run
}
