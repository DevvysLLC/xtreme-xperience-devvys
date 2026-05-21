import { z } from 'zod'

export const PackageType = z.enum(['single', 'multi'])
export type PackageType = z.infer<typeof PackageType>

export const LayoutType = z.enum(['tabs', 'stacked'])
export type LayoutType = z.infer<typeof LayoutType>

export const HeaderHorizontalAlignment = z.enum(['left', 'center', 'right'])
export type HeaderHorizontalAlignment = z.infer<
  typeof HeaderHorizontalAlignment
>

export const AvailableTab = z.object({
  id: PackageType,
  label: z.string(),
  cars: z.array(z.unknown())
})
export type AvailableTab = z.infer<typeof AvailableTab>

export const AvailableTabs = z.array(AvailableTab)
export type AvailableTabs = z.infer<typeof AvailableTabs>
