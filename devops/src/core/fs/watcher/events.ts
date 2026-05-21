import { z } from 'zod'

export const WatchEventType = z.enum(['write', 'rename', 'remove', 'create'])
export type WatchEventType = z.infer<typeof WatchEventType>

export const WatchEvent = z.object({
  type: WatchEventType,
  path: z.string()
})
export type WatchEvent = z.infer<typeof WatchEvent>
