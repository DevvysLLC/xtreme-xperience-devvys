import Path from 'node:path'
import { parseArgs } from 'node:util'
import { $, argv } from 'bun'
import pm from 'picomatch'
import { unique } from 'remeda'
import { z } from 'zod'
import { DevOpsError } from './core/errors/index.js'
import { safeAwait } from './core/errors/safe-await.js'
import { initLogger } from './core/logger/index.js'
import { makeLogErrorDetails } from './core/logger/log-error-details.js'
import { gitdir } from './core/process/gitdir.js'

const RUN_TASK = 'RUN_TASK'
const SKIP_TASK = 'SKIP_TASK'

const logger = initLogger().child({ name: 'run-with-changed-files' })
const logErrorDetails = makeLogErrorDetails(logger)

const PackageJson = z.object({
  ava: z.object({
    files: z.array(z.string().min(1)).min(1)
  })
})

const Env = z.object({
  COMPARE_TO_REVISION: z.string().min(1).optional().default('origin/main')
})

const Values = z.object({
  task: z.enum([
    'detect-circular-deps',
    'format-json',
    'lint',
    'organize-imports',
    'stylelint',
    'test',
    'themecheck',
    'typecheck'
  ])
})

const matches = (patterns: string[]) => {
  return (file: string) => {
    return pm.isMatch(file, patterns, {
      dot: true,
      cwd: gitdir
    })
  }
}

const matchesByBasename = (pattern: string) => {
  return (file: string) => {
    return pm.matchBase(file, pattern, {
      dot: true,
      cwd: gitdir
    })
  }
}

const extractDirnames = (files: string[]) => {
  return files.map((file) => {
    return Path.dirname(file)
  })
}

const parseRev = async (rev: string) => {
  const revResult = await $`git rev-parse ${rev}`.cwd(gitdir).nothrow().quiet()

  if (revResult.exitCode !== 0) {
    throw new DevOpsError('Failed to parse revision', {
      rev,
      exitCode: revResult.exitCode
    })
  }

  return revResult.stdout.toString().trim()
}

const run = async () => {
  const { values: _flags } = parseArgs({
    args: argv,
    strict: true,
    options: {
      task: {
        type: 'string',
        short: 't'
      },
      compareWith: {
        type: 'string',
        short: 'c'
      }
    },
    allowPositionals: true
  })

  const [flagsErr, flags] = await safeAwait(Values.parseAsync(_flags))

  if (flagsErr) {
    throw flagsErr
  }

  const [envErr, env] = await safeAwait(Env.parseAsync(process.env))

  if (envErr) {
    throw envErr
  }

  logger.trace({ env, flags })

  const { task } = flags
  const { COMPARE_TO_REVISION: compareWith } = env

  const headRev = await parseRev('HEAD')
  const compareWithRev = await parseRev(compareWith)

  const gitStatus = await $`git status --porcelain`
    .cwd(gitdir)
    .nothrow()
    .quiet()

  const workingCopyIsClean: boolean =
    gitStatus.exitCode === 0 && gitStatus.stdout.toString().trim().length === 0

  const isAtHead = headRev === compareWithRev && workingCopyIsClean

  logger.silent({ headRev, compareWithRev, isAtHead })

  const filesResult = await $`devops/list-changed-files.sh ${compareWith}`
    .cwd(gitdir)
    .nothrow()
    .quiet()

  filesResult.stderr
    .toString()
    .trim()
    .split('\n')
    .forEach((line) => {
      if (line) {
        console.warn(line)
      }
    })

  if (filesResult.exitCode !== 0) {
    logger.error(
      { exitCode: filesResult.exitCode },
      'Failed to list changed files'
    )
    throw new DevOpsError('Failed to list changed files')
  }

  const _allFiles = filesResult.stdout.toString().trim().split('\n')
  const allFiles = _allFiles.flatMap((file) => {
    const dirname = Path.dirname(file)

    if (dirname === '.') {
      logger.trace({ file, dirname }, 'Skipping file in root directory')
      return []
    }

    if (dirname === 'assets') {
      logger.trace({ file, dirname }, 'Skipping file in assets directory')
      return []
    }

    if (dirname.startsWith('datocms/')) {
      logger.trace({ file, dirname }, 'Skipping file in datocms directory')
      return []
    }

    return [file]
  })

  logger.silent({ task, _allFiles })

  if (task === 'test') {
    if (isAtHead) {
      logger.debug('The branch is equal to the comparison branch')

      const packageJson = await PackageJson.parseAsync(
        await Bun.file(Path.resolve(gitdir, 'package.json')).json()
      )
      Bun.stdout.write(packageJson.ava.files.join('\n'))
      return
    }

    const files = allFiles
      .filter(matchesByBasename('*.{js,jsx,ts,tsx}'))
      .filter(matches(['src/**/*', 'devops/src/**/*']))

    logger.silent({ task, files })

    const dirnames = unique(extractDirnames(files))

    if (dirnames.length === 0) {
      logger.debug('No files to test')
      return
    }

    const _testFiles =
      await $`fdfind -t file -e spec.ts ${dirnames.map((d) => `--search-path=${d}`)}`
        .cwd(gitdir)
        .text()

    const testFiles = _testFiles
      .trim()
      .split('\n')
      .filter((line) => line)

    logger.silent({ task, testFiles })

    const testFolders = unique(extractDirnames(testFiles))

    logger.silent({ task, testFolders })

    if (testFolders.length === 0) {
      logger.info('No files to test')
      return
    }

    Bun.stdout.write(testFolders.join('\n'))
    return
  }

  if (task === 'lint') {
    if (isAtHead) {
      logger.debug('The branch is equal to the comparison branch')
      Bun.stdout.write('./')
      return
    }

    const files = allFiles.filter(matchesByBasename('*.{js,jsx,ts,tsx}'))

    logger.silent({ task, files })

    const dirnames = unique(extractDirnames(files))

    if (dirnames.length === 0) {
      logger.info('No files to lint')
      return
    }

    Bun.stdout.write(dirnames.join('\n'))
    return
  }

  if (task === 'stylelint') {
    if (isAtHead) {
      logger.debug('The branch is equal to the comparison branch')
      Bun.stdout.write('**/*.scss')
      return
    }

    const files = allFiles.filter(matchesByBasename('*.scss'))

    logger.silent({ task, files })

    const dirnames = unique(extractDirnames(files))

    if (dirnames.length === 0) {
      logger.info('No files to stylelint')
      return
    }

    const stylelintGlobs = dirnames.map((d) => `${d}/**/*.scss`)

    Bun.stdout.write(stylelintGlobs.join('\n'))
    return
  }

  // Themecheck cannot be run on a subset of files
  if (task === 'themecheck') {
    if (isAtHead) {
      logger.debug(
        'The branch is equal to the comparison branch. Running task.'
      )
      Bun.stdout.write(RUN_TASK)
      return
    }

    const files = allFiles.filter(matchesByBasename('*.liquid'))

    logger.silent({ task, files })

    if (files.length === 0) {
      logger.info('No changes detected. Skipping task')
      Bun.stdout.write(SKIP_TASK)
      return
    }

    logger.debug('Changes detected. Running task')
    Bun.stdout.write(RUN_TASK)
    return
  }

  // Format JSON cannot be run on a subset of files
  if (task === 'format-json') {
    if (isAtHead) {
      logger.debug(
        'The branch is equal to the comparison branch. Running task.'
      )
      Bun.stdout.write(RUN_TASK)
      return
    }

    const files = allFiles.filter(matchesByBasename('*.json'))

    logger.silent({ task, files })

    if (files.length === 0) {
      logger.info('No changes detected. Skipping task')
      Bun.stdout.write(SKIP_TASK)
      return
    }

    logger.debug('Changes detected. Running task')
    Bun.stdout.write(RUN_TASK)
    return
  }

  // Typescript-related tasks cannot be run on a subset of files
  if (
    task === 'typecheck' ||
    task === 'organize-imports' ||
    task === 'detect-circular-deps'
  ) {
    if (isAtHead) {
      logger.debug(
        'The branch is equal to the comparison branch. Running task.'
      )
      Bun.stdout.write(RUN_TASK)
      return
    }

    const files = allFiles.filter(matchesByBasename('*.{js,jsx,ts,tsx}'))

    logger.silent({ task, files })

    if (files.length === 0) {
      logger.info('No changes detected. Skipping task')
      Bun.stdout.write(SKIP_TASK)
      return
    }

    logger.debug('Changes detected. Running task')
    Bun.stdout.write(RUN_TASK)
    return
  }

  task satisfies never
}

run().catch((_err: unknown) => {
  const err = logErrorDetails(_err)

  throw err
})
