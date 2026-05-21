import { addEmptyCommit } from '../core/git/add-empty-commit.js'
import { initGit } from '../core/git/index.js'
import { mergeTheirs } from '../core/git/merge-theirs.js'
import { switchToBranch } from '../core/git/switch-to-branch.js'
import { initLogger } from '../core/logger/index.js'
import { makeHandleRejection } from '../core/process/handle-rejection.js'

const logger = initLogger().child({ name: 'deploy-to-production' })

const run = async (): Promise<void> => {
  const git = await initGit({ logger })

  logger.debug('Switching to production branch')
  await switchToBranch({
    git,
    logger,
    baseBranchMode: 'fallback-to-main',
    baseBranchName: 'origin/main',
    targetBranchName: `production`
  })

  logger.debug('Merging main branch into production')
  await mergeTheirs({
    logger,
    sourceBranch: 'origin/main'
  })

  await addEmptyCommit({
    logger,
    message: 'Deploy to production'
  })

  logger.info('Deployed to production')
}

run().catch(makeHandleRejection({ logger }))
