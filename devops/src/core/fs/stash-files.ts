import { mkdir } from 'node:fs/promises'
import Path from 'node:path'
import { DevOpsError } from '../errors'
import type { Logger } from '../logger'
import { gitdir } from '../process/gitdir'
import { tmpdir } from '../process/tmpdir'
import { MINUTE_IN_MS } from '../time/constants'

const stashdir = Path.resolve(tmpdir, `stash-files`)

type StashFilesInput = {
  logger: Logger
  paths: string[]
}

/**
 * Stash files or folders from the workdir to a temporary folder
 */
export const stashFiles = async ({
  logger,
  paths
}: StashFilesInput): Promise<void> => {
  const { execa } = await import('execa')

  await mkdir(stashdir, { recursive: true })

  for (const path of paths) {
    // Preserve directory structure by using relative paths
    const result = await execa('cp', ['--parents', '-Raf', path, stashdir], {
      cwd: gitdir,
      lines: true,
      reject: false,
      timeout: 5 * MINUTE_IN_MS
    })

    const level = result.failed ? 'debug' : 'trace'

    result.stdout.forEach((line) => {
      logger[level](line)
    })

    result.stderr.forEach((line) => {
      logger[level](line)
    })

    if (result.failed) {
      logger.error(result.shortMessage)
      throw new DevOpsError('Failed to stash files', { path })
    }
  }

  logger.info('Files stashed')
}

type RestoreFilesFromStashInput = {
  logger: Logger
  paths: string[]
}

/**
 * Restore stashed files or folders from the temporary folder to the workdir
 */
export const restoreFilesFromStash = async ({
  logger,
  paths
}: RestoreFilesFromStashInput): Promise<void> => {
  const { execa } = await import('execa')

  for (const path of paths) {
    const result = await execa('cp', ['--parents', '-Raf', path, gitdir], {
      cwd: stashdir,
      lines: true,
      reject: false,
      timeout: 5 * MINUTE_IN_MS
    })

    const level = result.failed ? 'debug' : 'trace'

    result.stdout.forEach((line) => {
      logger[level](line)
    })

    result.stderr.forEach((line) => {
      logger[level](line)
    })

    if (result.failed) {
      logger.error(result.shortMessage)
      throw new DevOpsError('Failed to restore files', { path })
    }
  }

  logger.info('Files restored')
}
