import { pipe } from 'remeda'
import { GitError, GitResponseError } from 'simple-git'
import { ZodError } from 'zod'
import { DevOpsError } from '../errors/index.js'
import type { Logger } from '../logger/index.js'

type JsonValue =
  | null
  | string
  | number
  | boolean
  | { [x: string]: JsonValue }
  | JsonValue[]

type ExecaError = Error & Record<'stderr', Buffer | string>

const isExecaError = (err: unknown): err is ExecaError => {
  return (
    err instanceof Error &&
    'stderr' in err &&
    (typeof err.stderr === 'string' || err.stderr instanceof Buffer)
  )
}

type Result =
  | {
      logged: true
      err: DevOpsError
    }
  | { logged: false; err: unknown }

export type LogErrorDetails = (err: unknown) => DevOpsError

export const makeLogErrorDetails = (logger: Logger): LogErrorDetails => {
  const parseResponseBody = (body: unknown): JsonValue => {
    if (typeof body === 'string') {
      try {
        return JSON.parse(body)
      } catch (err) {
        logger.trace(
          'Error response body is not JSON: %s',
          err instanceof Error ? err.message : 'Unknown error'
        )
        return body
      }
    }

    return Buffer.isBuffer(body) ? body.toString('utf-8', 0, 512) : null
  }

  const logGotRequestError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    const err =
      result.err instanceof Error &&
      result.err.name === 'RequestError' &&
      'code' in result.err &&
      'response' in result.err &&
      typeof result.err.response === 'object'
        ? result.err
        : null

    if (err == null) {
      return result
    }

    const statusCode: string | null =
      typeof err.response === 'object' &&
      err.response != null &&
      'statusCode' in err.response &&
      typeof err.response.statusCode === 'string'
        ? err.response.statusCode
        : null

    const apiResponse =
      typeof err.response === 'object' &&
      err.response != null &&
      'body' in err.response
        ? parseResponseBody(err.response.body)
        : null

    logger.error(
      {
        apiResponse,
        code: err.code,
        statusCode
      },
      err.message
    )

    return {
      logged: true,
      err: new DevOpsError(err.message, {
        details: { source: 'got' }
      })
    }
  }

  const logGotHttpError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    const err =
      result.err instanceof Error && result.err.name === 'HTTPError'
        ? result.err
        : null

    if (err == null) {
      return result
    }

    const statusCode: string | null =
      'response' in err &&
      typeof err.response === 'object' &&
      err.response != null &&
      'statusCode' in err.response &&
      typeof err.response.statusCode === 'string'
        ? err.response.statusCode
        : null

    logger.error({ statusCode }, err.message)

    return {
      logged: true,
      err: new DevOpsError(err.message, {
        details: { source: 'got' }
      })
    }
  }

  const logGitError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    const err =
      result.err instanceof GitResponseError || result.err instanceof GitError
        ? result.err
        : null

    if (err == null) {
      return result
    }

    const git: unknown = err instanceof GitResponseError ? err.git : null

    logger.error(
      {
        git,
        task: err.task
      },
      err.message
    )

    return {
      logged: true,
      err: new DevOpsError(err.message, {
        details: { source: 'simple-git' }
      })
    }
  }

  const unpackDevOpsError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    const err = result.err instanceof DevOpsError ? result.err : null

    if (err == null) {
      return result
    }

    const { err: nestedError, ...details } = err.details

    if (nestedError == null) {
      logger.error(details, err.message)
      return { err, logged: true }
    }

    if (nestedError instanceof DevOpsError) {
      logger.error({ ...details, ...nestedError.details }, err.message)

      return {
        logged: true,
        err: nestedError
      }
    }

    if (nestedError instanceof Error) {
      logger.error(details, err.message)

      return {
        logged: false,
        err: nestedError
      }
    }

    logger.error(details, err.message)

    return {
      err,
      logged: true
    }
  }

  const logExecaError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    const err = isExecaError(result.err) ? result.err : null

    if (err == null) {
      return result
    }

    const message = err.message.split('\n').at(0) ?? 'Unknown error'

    err.stderr
      .toString()
      .split('\n')
      .filter((line) => line)
      .forEach((line) => {
        logger.error(line)
      })

    logger.error(message)

    return {
      logged: true,
      err: new DevOpsError(message, {
        details: { source: 'Child Process' }
      })
    }
  }

  const logZodError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    const err = result.err instanceof ZodError ? result.err : null

    if (err == null) {
      return result
    }

    const message = `${JSON.stringify(err.issues[0]?.path)} ${
      err.issues[0]?.message || 'Unknown error'
    } [${err.issues[0]?.code || 'UNKNOWN'}]`

    logger.error({ type: 'validation_error', issues: err.issues }, message)

    return {
      logged: true,
      err: new DevOpsError(message, {
        details: { source: 'Zod' }
      })
    }
  }

  const logGenericError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    const err = result.err instanceof Error ? result.err : null

    if (err == null) {
      return result
    }

    logger.error(err)

    return {
      logged: true,
      err: new DevOpsError(err.message, {
        details: { source: err.name || 'Unknown' }
      })
    }
  }

  const logUnknownError = (result: Result): Result => {
    if (result.logged) {
      return result
    }

    if (typeof result.err === 'string') {
      logger.error(result.err.trim())
    } else {
      logger.error({ err: result.err }, 'Error of unknown type')
    }

    return {
      logged: true,
      err: new DevOpsError('Error of unknown type', {
        traceTag: '37d79dbb14ba45409556d3f0cae43a4b'
      })
    }
  }

  return (err: unknown): DevOpsError => {
    // Avoid logging the same error twice
    if (err instanceof DevOpsError && err.details.logged) {
      return err
    }

    const result = pipe(
      { err, logged: false },
      unpackDevOpsError,
      logZodError,
      logExecaError,
      logGitError,
      logGotRequestError,
      logGotHttpError,
      logGenericError,
      logUnknownError
    )

    if (result.logged === false) {
      throw new DevOpsError("Error wasn't logged", {
        err,
        traceTag: 'da63cae0ad9f42429ce66625746417a1'
      })
    }

    result.err.details.logged = true

    return result.err
  }
}
