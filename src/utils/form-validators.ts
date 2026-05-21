import type { ZodSchema } from 'zod'

type ValidatorArgs = { value: string }
type ValidatorFn = (args: ValidatorArgs) => string | undefined

export const createRequiredValidator =
  (message: string): ValidatorFn =>
  ({ value }) => {
    if (!value || value.trim() === '') {
      return message
    }
    return undefined
  }

export const createSchemaValidator =
  (
    schema: ZodSchema,
    requiredMessage: string,
    formatMessage: string
  ): ValidatorFn =>
  ({ value }) => {
    if (!value || value.trim() === '') {
      return requiredMessage
    }
    const result = schema.safeParse(value)
    if (!result.success) {
      return formatMessage
    }
    return undefined
  }
