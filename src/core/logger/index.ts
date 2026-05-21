import type { Level, Logger, LoggerOptions, WriteFn } from 'pino'
import pino from 'pino'
import { isAllowedLoggingDomain } from '../../config/log'

export type { Logger } from 'pino'

const REDACT_PATHS: string[] = []

const SENSITIVE_KEY_SUBSTRINGS = ['key', 'client', 'secret']
const SENSITIVE_PREVIEW_LENGTH = 5
const SENSITIVE_CENSOR_SUFFIX = '...'

const keyIsSensitive = (key: string): boolean => {
  const lower = key.toLowerCase()
  return SENSITIVE_KEY_SUBSTRINGS.some((sub) => lower.includes(sub))
}

const redactSensitiveInObject = (value: unknown): unknown => {
  if (value !== null && typeof value === 'object') {
    return JSON.parse(
      JSON.stringify(value, (key: string, val: unknown) => {
        if (keyIsSensitive(key) && typeof val === 'string') {
          return (
            val.slice(0, SENSITIVE_PREVIEW_LENGTH) + SENSITIVE_CENSOR_SUFFIX
          )
        }
        return val
      })
    )
  }
  return value
}

const redactPayloadSerializer = (value: unknown): unknown =>
  redactSensitiveInObject(value)

// LogDNA requires message key to be 'message'
const messageKey = 'message'

const shouldLogInBrowser = (): boolean => {
  if (typeof window === 'undefined') {
    return true
  }
  return isAllowedLoggingDomain(window.location.hostname)
}

const makeBrowserWrite = (pinoLevel: Level = 'info'): WriteFn => {
  const level =
    pinoLevel === 'fatal'
      ? 'error'
      : pinoLevel === 'trace'
        ? 'debug'
        : pinoLevel

  return (line) => {
    if (!shouldLogInBrowser()) {
      return
    }

    const message: string | null =
      'message' in line && typeof line.message === 'string'
        ? line.message
        : 'msg' in line && typeof line.msg === 'string'
          ? line.msg
          : null

    const printLine = {
      ...line,
      level: undefined,
      message: undefined,
      msg: undefined
    }

    // eslint-disable-next-line no-console
    console[level](level.toUpperCase(), message, printLine)
  }
}

export type LoggerFactoryOptions = {
  appName?: string | null
  gitCommitSha?: string | null
  mode: 'development' | 'production' | 'test'
}

export type MakeLogger = (options: LoggerFactoryOptions) => pino.Logger

export const _makeLogger: MakeLogger = function makeLogger({
  appName,
  gitCommitSha,
  mode = 'development'
}) {
  const enabled = mode !== 'test'

  const level = mode === 'production' ? 'info' : 'trace'

  // LogDNA parses level labels only
  const formatters = {
    level(label: string) {
      return { level: label }
    }
  }

  const base: LoggerOptions['base'] = {
    appName,
    gitCommitSha
  }

  const options: LoggerOptions = {
    base,
    enabled,
    formatters,
    level,
    messageKey,
    name: 'main',
    redact: { censor: '[REDACTED]', paths: REDACT_PATHS },
    serializers: {
      err: pino.stdSerializers.err,
      error: pino.stdSerializers.err,
      responseBody: redactPayloadSerializer,
      errorBody: redactPayloadSerializer,
      errorData: redactPayloadSerializer
    },
    browser: {
      asObject: true,
      write: {
        debug: makeBrowserWrite('debug'),
        error: makeBrowserWrite('error'),
        fatal: makeBrowserWrite('fatal'),
        info: makeBrowserWrite('info'),
        trace: makeBrowserWrite('trace'),
        warn: makeBrowserWrite('warn')
      }
    }
  }

  return pino(options)
}

let logger: Logger | null = null

export const initLogger = (): Logger => {
  logger =
    logger ??
    _makeLogger({
      mode:
        process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
          ? 'production'
          : 'development',
      gitCommitSha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
      appName: process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG
    })

  return logger
}
