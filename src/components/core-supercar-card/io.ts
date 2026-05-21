import { z } from 'zod'

export const CardType = z.enum(['simple', 'stats', 'package'])
export type CardType = z.infer<typeof CardType>

export const CardBackgroundColor = z.enum(['white', 'white-50', 'gray-50'])
export type CardBackgroundColor = z.infer<typeof CardBackgroundColor>
