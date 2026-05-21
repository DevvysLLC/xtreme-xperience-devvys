import type { execa as _execa, execaCommand as _execaCommand } from 'execa'

type Execa = typeof _execa
type ExecaCommand = typeof _execaCommand

type ExecaLibrary = { execa: Execa; execaCommand: ExecaCommand }

let result: Promise<ExecaLibrary> | null = null

const _makeExeca = (): Promise<ExecaLibrary> => {
  return import('execa')
}

export const initExeca = (): Promise<ExecaLibrary> => {
  result = result ?? _makeExeca()

  return result
}
