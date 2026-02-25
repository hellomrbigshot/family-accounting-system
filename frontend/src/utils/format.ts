/**
 * 将数字格式化为带千位分隔符的字符串（仅数字部分，不含货币符号）
 * 例如：1234567.89 -> "1,234,567.89"
 */
export function formatNumberWithSeparator(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(value)) return '0.00'
  const fixed = Number(value).toFixed(2)
  const [intPart, decPart] = fixed.split('.')
  const withSep = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${withSep}.${decPart}`
}

/**
 * 格式化金额显示（带 ¥ 和千位分隔符）
 * 例如：1234567.89 -> "¥1,234,567.89"
 */
export function formatAmount(value: number | undefined | null): string {
  return `¥${formatNumberWithSeparator(value)}`
}
