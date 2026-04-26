import { SECONDS_PER_DAY, type Trade, type VaultDay } from './points'

export type Profile = {
  name: string
  handle: string
  vault: VaultDay[]
  trades: Trade[]
}

const HOUR = 3600

const vaultBalances = [
  1000, 1000, 1000,
  1500, 1500, 1500, 1500,
  1500, 1500, 1500,
  1000,
  2000, 2000, 2000,
  2500, 2500, 2500,
  3000, 3000, 3000,
  1500,
  2500, 2500, 2500,
  3000, 3000, 3000,
  3500, 3500, 3500,
]

export const profile: Profile = {
  name: 'Alex',
  handle: 'alex.eth',
  vault: vaultBalances.map((minBalance, day) => ({ day, minBalance })),
  trades: [
    {
      id: 'trade-1',
      notional: 500,
      openSec: 2 * SECONDS_PER_DAY + 12 * HOUR,
      closeSec: 3 * SECONDS_PER_DAY + 12 * HOUR,
    },
    {
      id: 'trade-2',
      notional: 2000,
      openSec: 5 * SECONDS_PER_DAY + 6 * HOUR,
      closeSec: 5 * SECONDS_PER_DAY + 14 * HOUR,
    },
    {
      id: 'trade-3',
      notional: 1500,
      openSec: 11 * SECONDS_PER_DAY + 9 * HOUR,
      closeSec: 12 * SECONDS_PER_DAY + 9 * HOUR,
    },
    {
      id: 'trade-4',
      notional: 3000,
      openSec: 17 * SECONDS_PER_DAY + 14 * HOUR,
      closeSec: 17 * SECONDS_PER_DAY + 22 * HOUR,
    },
    {
      id: 'trade-5',
      notional: 1000,
      openSec: 23 * SECONDS_PER_DAY + 6 * HOUR,
      closeSec: 25 * SECONDS_PER_DAY + 6 * HOUR,
    },
    {
      id: 'trade-6',
      notional: 5000,
      openSec: 28 * SECONDS_PER_DAY + 10 * HOUR,
      closeSec: 28 * SECONDS_PER_DAY + 18 * HOUR,
    },
  ],
}
