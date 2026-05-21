import z from 'zod'

export const LayoutType = z.enum([
  'button',
  'underline',
  'pill',
  'transparent',
  'text'
])
export type LayoutType = z.infer<typeof LayoutType>

export const StyleType = z.enum([
  'black',
  'black-transparent',
  'white',
  'highlight',
  'orange',
  'current',
  'white-transparent',
  'border-white'
])
export type StyleType = z.infer<typeof StyleType>

export const SizeType = z.enum(['small', 'medium', 'large'])
export type SizeType = z.infer<typeof SizeType>

export const ButtonType = z.enum(['button', 'submit', 'reset'])
export type ButtonType = z.infer<typeof ButtonType>

export const TargetType = z.enum(['_self', '_blank'])
export type TargetType = z.infer<typeof TargetType>

export const layoutTypeParser = (
  val: string | null | undefined
): LayoutType => {
  if (!val) {
    return 'button'
  }
  const result = LayoutType.safeParse(val)
  if (result.success) {
    return result.data
  }
  return 'button'
}

export const styleTypeParser = (val: string | null | undefined): StyleType => {
  if (!val) {
    return 'black'
  }
  const result = StyleType.safeParse(val)
  if (result.success) {
    return result.data
  }
  return 'black'
}

export const sizeTypeParser = (val: string | null | undefined): SizeType => {
  if (!val) {
    return 'medium'
  }
  const result = SizeType.safeParse(val)
  if (result.success) {
    return result.data
  }
  return 'medium'
}

export const targetTypeParser = (
  val: string | null | undefined
): TargetType => {
  if (!val) {
    return '_self'
  }
  const result = TargetType.safeParse(val)
  if (result.success) {
    return result.data
  }
  return '_self'
}

export const buttonTypeParser = (
  val: string | null | undefined
): ButtonType => {
  if (!val) {
    return 'button'
  }
  const result = ButtonType.safeParse(val)
  if (result.success) {
    return result.data
  }
  return 'button'
}
