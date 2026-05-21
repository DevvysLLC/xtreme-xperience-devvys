import type { Level, Logger, LoggerOptions } from 'pino'
import pino from 'pino'
import pretty from 'pino-pretty'

export type { Level, Logger } from 'pino'

export type LoggerFactoryOptions = {
  mode: 'development' | 'production' | 'test'
}

export type MakeLogger = (options: LoggerFactoryOptions) => pino.Logger

export const _makeLogger: MakeLogger = function makeLogger({
  mode = 'development'
}) {
  const enabled = mode !== 'test'

  const level: Level = mode === 'production' ? 'info' : 'trace'

  const base: LoggerOptions['base'] = {}

  const options: LoggerOptions = {
    base,
    enabled,
    level,
    name: 'datocms'
  }

  const stream = pretty({ colorize: true, levelFirst: true, sync: true })

  return pino(options, stream)
}

let logger: Logger | null = null

export const initLogger = (): Logger => {
  logger =
    logger ??
    _makeLogger({
      mode: 'development'
    })

  return logger
}
