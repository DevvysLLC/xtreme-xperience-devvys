/**
 * EaseOutCirc easing function
 * Formula: sqrt(1 - (t - 1)^2)
 * @param t Progress from 0 to 1
 * @returns Eased value from 0 to 1
 */
export const easeOutCirc = (t: number): number => {
  return Math.sqrt(1 - (t - 1) ** 2)
}

/**
 * EaseOutQuint easing function
 * Formula: 1 - (1 - t)^5
 * @param t Progress from 0 to 1
 * @returns Eased value from 0 to 1
 */
export const easeOutQuint = (t: number): number => {
  return 1 - (1 - t) ** 5
}

/**
 * EaseOutExpo easing function
 * Formula: t === 1 ? 1 : 1 - 2^(-10 * t)
 * @param t Progress from 0 to 1
 * @returns Eased value from 0 to 1
 */
export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - 2 ** (-10 * t)
}
