import { DevOpsError } from '../errors/index.js'
import type { Logger } from '../logger/index.js'
import type { SimpleGit } from './index.js'

export type SwitchToBranchInput = {
  git: SimpleGit
  logger: Logger
  baseBranchMode: 'fallback-to-main' | 'fallback-to-initial'
  targetBranchName: string
  baseBranchName?: `origin/${string}`
}

export const switchToBranch = async ({
  git,
  logger,
  baseBranchMode,
  targetBranchName,
  baseBranchName: _baseBranchName
}: SwitchToBranchInput): Promise<void> => {
  if (targetBranchName == null || targetBranchName.length === 0) {
    throw new DevOpsError('Target branch name is invalid', {
      targetBranchName,
      traceTag: '23daa3e3d582483f9e55727b3b00e9f0'
    })
  }

  if (targetBranchName.startsWith('origin/')) {
    throw new DevOpsError('Target branch name should not include remote name', {
      targetBranchName,
      traceTag: '8b5ab23c6d344394ade1881476a62f84'
    })
  }

  if (_baseBranchName != null && _baseBranchName.length === 0) {
    throw new DevOpsError('Base branch name is invalid', {
      targetBranchName,
      baseBranchName: _baseBranchName,
      traceTag: '1f15cd92437f4fc4ab62de3b27b3d4ae'
    })
  }

  logger.trace('Retrieving branch list')
  const { current: initialBranchName, branches } = await git.branch()

  if (initialBranchName === targetBranchName) {
    logger.info(
      {
        initialBranchName,
        targetBranchName
      },
      'Already on %s branch',
      initialBranchName
    )
    return
  }

  const baseBranchName: string | null =
    branches[targetBranchName] != null
      ? targetBranchName
      : branches[`remotes/origin/${targetBranchName}`] != null
        ? `origin/${targetBranchName}`
        : _baseBranchName != null &&
            _baseBranchName.length > 0 &&
            branches[`remotes/${_baseBranchName}`] != null
          ? _baseBranchName
          : baseBranchMode === 'fallback-to-initial'
            ? initialBranchName
            : baseBranchMode === 'fallback-to-main'
              ? 'origin/main'
              : null

  if (baseBranchName == null) {
    throw new DevOpsError('Base branch name is invalid', {
      input: {
        baseBranchMode,
        baseBranchName: _baseBranchName
      },
      baseBranchName,
      traceTag: 'c76f0fb479b943a0bd1d10a37e5c79c9'
    })
  }

  logger.debug(
    {
      allBranches: Object.keys(branches),
      initialBranchName,
      baseBranchName,
      targetBranchName
    },
    'Switching to %s branch',
    targetBranchName
  )

  await git
    .branch(['-f', targetBranchName, baseBranchName])
    .checkout(targetBranchName)

  logger.info('Switched to %s branch', targetBranchName)
}
