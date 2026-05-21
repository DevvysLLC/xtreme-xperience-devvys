export const getDprFromWidth = (
  width: number,
  maxWidth: number
): string | null => {
  if (width < 0 || maxWidth <= 0) {
    return null
  }

  if (width >= maxWidth) {
    return null
  }

  const dpr = (width / maxWidth).toFixed(2)
  return dpr
}
