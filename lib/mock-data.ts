import {
  SECONDS_PER_DAY,
  deriveVaultDays,
  type Trade,
  type VaultDay,
  type VaultEvent,
} from './points'

export type Profile = {
  id: string
  name: string
  handle: string
  vault: VaultDay[]
  vaultEvents: VaultEvent[]
  trades: Trade[]
}

const HOUR = 3600
const WINDOW_DAYS = 30

const alexEvents: VaultEvent[] = [
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

const alex: Profile = {
  id: 'alex',
  name: 'Alex',
  handle: 'alex.eth',
  vault: deriveVaultDays(alexEvents, WINDOW_DAYS),
  vaultEvents: alexEvents,
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

// Maya — pure trader. No vault deposits, all Track B.
const mayaEvents: VaultEvent[] = []

const mayaTrades: Trade[] = [
  // Week 1 — warming up, mostly scalps on volatile mornings.
  { id: 'm-01', notional: 2000, openSec: 0 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 0 * SECONDS_PER_DAY + 11 * HOUR },
  { id: 'm-02', notional: 1500, openSec: 0 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 0 * SECONDS_PER_DAY + 15 * HOUR + 30 * 60 },
  { id: 'm-03', notional: 3000, openSec: 1 * SECONDS_PER_DAY + 8 * HOUR, closeSec: 1 * SECONDS_PER_DAY + 12 * HOUR },
  { id: 'm-04', notional: 1000, openSec: 1 * SECONDS_PER_DAY + 20 * HOUR, closeSec: 1 * SECONDS_PER_DAY + 22 * HOUR },
  { id: 'm-05', notional: 2500, openSec: 2 * SECONDS_PER_DAY + 7 * HOUR, closeSec: 2 * SECONDS_PER_DAY + 13 * HOUR },
  { id: 'm-06', notional: 4000, openSec: 3 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 3 * SECONDS_PER_DAY + 17 * HOUR },
  { id: 'm-07', notional: 1500, openSec: 4 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 4 * SECONDS_PER_DAY + 11 * HOUR + 15 * 60 },
  { id: 'm-08', notional: 6000, openSec: 4 * SECONDS_PER_DAY + 15 * HOUR, closeSec: 5 * SECONDS_PER_DAY + 11 * HOUR },

  // Week 2 — swing trade through the weekend, plus afternoon scalps.
  { id: 'm-09', notional: 5000, openSec: 6 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 8 * SECONDS_PER_DAY + 9 * HOUR },
  { id: 'm-10', notional: 2000, openSec: 7 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 7 * SECONDS_PER_DAY + 16 * HOUR },
  { id: 'm-11', notional: 3500, openSec: 9 * SECONDS_PER_DAY + 8 * HOUR, closeSec: 9 * SECONDS_PER_DAY + 19 * HOUR },
  { id: 'm-12', notional: 1500, openSec: 10 * SECONDS_PER_DAY + 11 * HOUR, closeSec: 10 * SECONDS_PER_DAY + 12 * HOUR + 30 * 60 },
  { id: 'm-13', notional: 2500, openSec: 11 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 11 * SECONDS_PER_DAY + 14 * HOUR },
  { id: 'm-14', notional: 4500, openSec: 12 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 12 * SECONDS_PER_DAY + 21 * HOUR },

  // Week 3 — biggest position of the month, ridden across two days.
  { id: 'm-15', notional: 8000, openSec: 13 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 14 * SECONDS_PER_DAY + 17 * HOUR },
  { id: 'm-16', notional: 1500, openSec: 15 * SECONDS_PER_DAY + 8 * HOUR, closeSec: 15 * SECONDS_PER_DAY + 9 * HOUR },
  { id: 'm-17', notional: 2500, openSec: 15 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 15 * SECONDS_PER_DAY + 18 * HOUR },
  { id: 'm-18', notional: 3000, openSec: 16 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 16 * SECONDS_PER_DAY + 13 * HOUR },
  { id: 'm-19', notional: 2000, openSec: 17 * SECONDS_PER_DAY + 11 * HOUR, closeSec: 17 * SECONDS_PER_DAY + 12 * HOUR },
  { id: 'm-20', notional: 5500, openSec: 18 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 18 * SECONDS_PER_DAY + 22 * HOUR },
  { id: 'm-21', notional: 1500, openSec: 19 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 19 * SECONDS_PER_DAY + 10 * HOUR },

  // Week 4 — quieter, two day-off and a final swing.
  { id: 'm-22', notional: 3500, openSec: 22 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 22 * SECONDS_PER_DAY + 16 * HOUR },
  { id: 'm-23', notional: 2000, openSec: 23 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 23 * SECONDS_PER_DAY + 11 * HOUR },
  { id: 'm-24', notional: 4000, openSec: 24 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 25 * SECONDS_PER_DAY + 9 * HOUR },
  { id: 'm-25', notional: 2500, openSec: 26 * SECONDS_PER_DAY + 8 * HOUR, closeSec: 26 * SECONDS_PER_DAY + 17 * HOUR },
  { id: 'm-26', notional: 1500, openSec: 27 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 27 * SECONDS_PER_DAY + 14 * HOUR + 30 * 60 },
  { id: 'm-27', notional: 6500, openSec: 28 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 29 * SECONDS_PER_DAY + 18 * HOUR },
]

const maya: Profile = {
  id: 'maya',
  name: 'Maya',
  handle: 'maya.trades',
  vault: deriveVaultDays(mayaEvents, WINDOW_DAYS),
  vaultEvents: mayaEvents,
  trades: mayaTrades,
}

export const profiles: Profile[] = [alex, maya]
