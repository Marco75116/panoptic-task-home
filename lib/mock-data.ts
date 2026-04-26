import {
  SECONDS_PER_DAY,
  deriveVaultDays,
  type Trade,
  type VaultDay,
  type VaultEvent,
} from './points'

export type Profile = {
  name: string
  handle: string
  vault: VaultDay[]
  vaultEvents: VaultEvent[]
  trades: Trade[]
}

const HOUR = 3600
const WINDOW_DAYS = 30

const vaultEvents: VaultEvent[] = [
  { day: 0, hour: 0, type: 'deposit', amount: 1000 },
  { day: 3, hour: 0, type: 'deposit', amount: 500 },
  // JIT attempt: huge late-day deposit, withdrawn before midnight.
  // Day 7's min balance is unchanged because the rule looks at the daily minimum.
  { day: 7, hour: 18, type: 'deposit', amount: 5000 },
  { day: 7, hour: 23, type: 'withdraw', amount: 5000 },
  { day: 10, hour: 0, type: 'withdraw', amount: 500 },
  { day: 11, hour: 0, type: 'deposit', amount: 1000 },
  { day: 14, hour: 0, type: 'deposit', amount: 500 },
  { day: 17, hour: 0, type: 'deposit', amount: 500 },
  { day: 20, hour: 0, type: 'withdraw', amount: 1500 },
  { day: 21, hour: 0, type: 'deposit', amount: 1000 },
  { day: 24, hour: 0, type: 'deposit', amount: 500 },
  { day: 27, hour: 0, type: 'deposit', amount: 500 },
]

export const profile: Profile = {
  name: 'Alex',
  handle: 'alex.eth',
  vault: deriveVaultDays(vaultEvents, WINDOW_DAYS),
  vaultEvents,
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
