export const round = (
  value: number,
  precision = 0,
  methodName: 'ceil' | 'floor' | 'round' = 'round'
): number => {
  if (Number.isNaN(value)) {
    return Number.NaN
  }

  const safePrecision: number =
    precision == null
      ? 0
      : Number.isNaN(precision)
        ? 0
        : precision >= 0
          ? Math.min(precision, 292)
          : Math.max(precision, -292)
  const roundedPrecision = Math.floor(safePrecision)

  if (roundedPrecision === 0) {
    return Math[methodName](value)
  }

  const exp = roundedPrecision * -1

  // Compensate for floating point precision errors
  const [magnitude, exponent = 0] = value.toString().split('e')
  const adjustedValue = Math[methodName](
    // @ts-expect-error Math.round accepts exponential notation
    `${magnitude}e${exponent - exp}`
  )
  // Shift back
  const [newMagnitude, newExponent = 0] = adjustedValue.toString().split('e')
  return Number(`${newMagnitude}e${+newExponent + exp}`)
}
