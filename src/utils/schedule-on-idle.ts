export type ScheduleOnIdleOptions = {
  timeoutMs?: number
  fallbackDelayMs?: number
  runImmediately?: boolean
}

export type CancelScheduledTask = () => void

const noop = (): void => {}

export const scheduleOnIdle = (
  task: () => void,
  options: ScheduleOnIdleOptions = {}
): CancelScheduledTask => {
  const { timeoutMs = 0, fallbackDelayMs, runImmediately = false } = options

  if (typeof window === 'undefined') {
    return noop
  }

  if (runImmediately) {
    task()
    return noop
  }

  let isCancelled = false
  let timeoutId: number | null = null
  let idleId: number | null = null

  const runTask = (): void => {
    if (isCancelled) {
      return
    }
    task()
  }

  if (typeof window.requestIdleCallback === 'function') {
    idleId = window.requestIdleCallback(runTask, { timeout: timeoutMs })
  } else {
    const delay = fallbackDelayMs ?? timeoutMs
    timeoutId = window.setTimeout(runTask, delay)
  }

  return () => {
    isCancelled = true

    if (timeoutId != null) {
      window.clearTimeout(timeoutId)
    }

    if (idleId != null && typeof window.cancelIdleCallback === 'function') {
      window.cancelIdleCallback(idleId)
    }
  }
}
