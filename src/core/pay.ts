export type Money = { amount: number; currency: 'USD'|'EUR'|'RUB'|'CNY'; period: 'm'|'y' }
const FX = { USD: 1, EUR: 1.1, RUB: 0.011, CNY: 0.14 }
const MONTHS = 12

export function parseMoney(input: string): Money | null {
  const s = input.trim().toUpperCase()
  let currency: Money['currency'] | null = null
  if (s.includes('$')) currency = 'USD'
  else if (s.includes('€')) currency = 'EUR'
  else if (s.includes('₽') || s.includes('RUB')) currency = 'RUB'
  else if (s.includes('¥') || s.includes('CNY')) currency = 'CNY'

  const k = /(\d[\d\s,\.]*)(K)?/.exec(s)
  if (!currency || !k) return null
  let amount = Number(k[1].replace(/[\,\s]/g, ''))
  if (k[2]) amount *= 1000

  let period: Money['period'] = s.includes('/M') || /\/МО|МЕС/i.test(input) ? 'm' : 'y'
  return { amount, currency, period }
}

export function toUSDPerMonth(m: Money): number {
  const usd = m.currency === 'USD' ? m.amount : m.amount * FX[m.currency]
  return m.period === 'm' ? usd : usd / MONTHS
}

export function normalizeDisplay(input: string): { usdPerMonth?: number; parsed?: Money } {
  const parsed = parseMoney(input)
  if (!parsed) return {}
  return { parsed, usdPerMonth: Math.round(toUSDPerMonth(parsed)) }
}
