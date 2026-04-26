export const SECONDS_PER_DAY = 86_400

export const W_A = 1.0
export const W_B = 5.0
export const BOOST = 1.0
export const SCALE = 100 / SECONDS_PER_DAY

export type VaultDay = {
  day: number
  minBalance: number
}

export type Trade = {
  id: string
  notional: number
  openSec: number
  closeSec: number
}

export function vaultDayPoints(d: VaultDay): number {
  return Math.floor(d.minBalance * W_A * SECONDS_PER_DAY * BOOST * SCALE)
}

export function tradePoints(t: Trade): number {
  const held = t.closeSec - t.openSec
  return Math.floor(t.notional * W_B * held * BOOST * SCALE)
}

export function tradeDayPoints(t: Trade, day: number): number {
  const dayStart = day * SECONDS_PER_DAY
  const dayEnd = dayStart + SECONDS_PER_DAY
  const overlap = Math.max(
    0,
    Math.min(t.closeSec, dayEnd) - Math.max(t.openSec, dayStart),
  )
  return Math.floor(t.notional * W_B * overlap * BOOST * SCALE)
}

export function tradeHeldHours(t: Trade): number {
  return (t.closeSec - t.openSec) / 3600
}
