import pino, { type Level, type Logger, type LoggerOptions } from 'pino'
import pretty, { colorizerFactory } from 'pino-pretty'

export type { Level, Logger } from 'pino'

export const shouldBeVerbose = (): boolean => {
  const ci: boolean = process.env.CI === 'true' || process.env.CI === '1'

  if (ci) {
    return true
  }

  const debug: boolean =
    typeof process.env.DEBUG === 'string' &&
    process.env.DEBUG.length > 0 &&
    process.env.DEBUG !== '0' &&
    process.env.DEBUG !== 'false'

  return debug
}

const _makeLogger = (): Logger => {
  const colorizer = colorizerFactory(true)

  const base: LoggerOptions['base'] = {}

  const silent: boolean = process.env.NODE_ENV === 'test'

  const level: Level = silent ? 'fatal' : shouldBeVerbose() ? 'trace' : 'debug'

  const options: LoggerOptions = {
    base,
    level,
    enabled: true,
    name: 'devops'
  }

  const stream = pretty({
    colorize: true,
    // print logs to stderr
    destination: 2,
    sync: true,
    customPrettifiers: {
      time: (_timestamp) => {
        const timestamp = _timestamp.toString()
        const shortTimestamp = timestamp.split('.')[0] || timestamp

        return `[${colorizer.greyMessage(shortTimestamp)}]`
      }
    },
    messageFormat: (log, messageKey) => {
      const message = log[messageKey]
      if (typeof message !== 'string') {
        return ''
      }

      return log.level === 10 ? colorizer.greyMessage(message) : message
    }
  })

  return pino(options, stream)
}

let logger: Logger | null = null

export const initLogger = (): Logger => {
  logger = logger ?? _makeLogger()

  return logger
}
