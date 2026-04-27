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
  address: `0x${string}`
  vault: VaultDay[]
  vaultEvents: VaultEvent[]
  trades: Trade[]
}

export const shortAddress = (addr: string) =>
  `${addr.slice(0, 6)}…${addr.slice(-6)}`

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
  address: '0xA1ec0f3b8d2a9e4f5c1d8b7a6e3f9c2d1b4a5e6f',
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
  address: '0x9d4b2e7c1a8f3e5d6c2b9a7f4e1d8c5b3a6f2e9d',
  vault: deriveVaultDays(mayaEvents, WINDOW_DAYS),
  vaultEvents: mayaEvents,
  trades: mayaTrades,
}

// Sora — balanced LP/trader. Steady vault growth + a handful of mid-size trades.
const soraEvents: VaultEvent[] = [
  { day: 0, hour: 0, type: 'deposit', amount: 4000 },
  { day: 5, hour: 0, type: 'deposit', amount: 2000 },
  { day: 8, hour: 0, type: 'withdraw', amount: 1000 },
  { day: 12, hour: 0, type: 'deposit', amount: 2500 },
  { day: 16, hour: 0, type: 'deposit', amount: 1500 },
  { day: 19, hour: 0, type: 'withdraw', amount: 500 },
  { day: 23, hour: 0, type: 'deposit', amount: 2000 },
  { day: 28, hour: 0, type: 'deposit', amount: 1000 },
]

const sora: Profile = {
  id: 'sora',
  name: 'Sora',
  handle: 'sora.lens',
  address: '0x4f2a1b5c7d8e9f0a3b2c1d4e5f6a7b8c9d0e1f2a',
  vault: deriveVaultDays(soraEvents, WINDOW_DAYS),
  vaultEvents: soraEvents,
  trades: [
    { id: 's-01', notional: 1500, openSec: 1 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 2 * SECONDS_PER_DAY + 10 * HOUR },
    { id: 's-02', notional: 3000, openSec: 6 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 7 * SECONDS_PER_DAY + 17 * HOUR },
    { id: 's-03', notional: 2000, openSec: 10 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 10 * SECONDS_PER_DAY + 19 * HOUR },
    { id: 's-04', notional: 4500, openSec: 14 * SECONDS_PER_DAY + 8 * HOUR, closeSec: 15 * SECONDS_PER_DAY + 14 * HOUR },
    { id: 's-05', notional: 2500, openSec: 20 * SECONDS_PER_DAY + 11 * HOUR, closeSec: 20 * SECONDS_PER_DAY + 18 * HOUR },
    { id: 's-06', notional: 3500, openSec: 25 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 26 * SECONDS_PER_DAY + 9 * HOUR },
    { id: 's-07', notional: 2000, openSec: 29 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 29 * SECONDS_PER_DAY + 16 * HOUR },
  ],
}

// Ravi — whale LP. One big day-0 deposit, holds untouched, no trades.
const raviEvents: VaultEvent[] = [
  { day: 0, hour: 0, type: 'deposit', amount: 25000 },
]

const ravi: Profile = {
  id: 'ravi',
  name: 'Ravi',
  handle: 'ravi.eth',
  address: '0xC0fee9b8d7f1e3a4c2b6d8e1a9f4b7c3d5e2a8f1',
  vault: deriveVaultDays(raviEvents, WINDOW_DAYS),
  vaultEvents: raviEvents,
  trades: [],
}

// Jin — micro-scalper. Tiny collateral, many very short positions every day.
const jinEvents: VaultEvent[] = [
  { day: 0, hour: 0, type: 'deposit', amount: 1500 },
  { day: 14, hour: 0, type: 'deposit', amount: 500 },
]

const jinTrades: Trade[] = [
  // Week 1 — tight scalps, mostly under an hour.
  { id: 'j-01', notional: 800, openSec: 0 * SECONDS_PER_DAY + 9 * HOUR + 15 * 60, closeSec: 0 * SECONDS_PER_DAY + 9 * HOUR + 45 * 60 },
  { id: 'j-02', notional: 600, openSec: 0 * SECONDS_PER_DAY + 11 * HOUR, closeSec: 0 * SECONDS_PER_DAY + 11 * HOUR + 25 * 60 },
  { id: 'j-03', notional: 1000, openSec: 0 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 0 * SECONDS_PER_DAY + 15 * HOUR + 10 * 60 },
  { id: 'j-04', notional: 700, openSec: 1 * SECONDS_PER_DAY + 8 * HOUR + 30 * 60, closeSec: 1 * SECONDS_PER_DAY + 9 * HOUR + 5 * 60 },
  { id: 'j-05', notional: 900, openSec: 1 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 1 * SECONDS_PER_DAY + 13 * HOUR + 50 * 60 },
  { id: 'j-06', notional: 1200, openSec: 1 * SECONDS_PER_DAY + 19 * HOUR, closeSec: 1 * SECONDS_PER_DAY + 20 * HOUR + 15 * 60 },
  { id: 'j-07', notional: 800, openSec: 2 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 2 * SECONDS_PER_DAY + 10 * HOUR + 35 * 60 },
  { id: 'j-08', notional: 1100, openSec: 2 * SECONDS_PER_DAY + 15 * HOUR, closeSec: 2 * SECONDS_PER_DAY + 16 * HOUR + 20 * 60 },
  { id: 'j-09', notional: 700, openSec: 3 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 3 * SECONDS_PER_DAY + 9 * HOUR + 40 * 60 },
  { id: 'j-10', notional: 1500, openSec: 3 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 3 * SECONDS_PER_DAY + 15 * HOUR + 30 * 60 },
  { id: 'j-11', notional: 900, openSec: 4 * SECONDS_PER_DAY + 8 * HOUR + 45 * 60, closeSec: 4 * SECONDS_PER_DAY + 9 * HOUR + 30 * 60 },
  { id: 'j-12', notional: 600, openSec: 4 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 4 * SECONDS_PER_DAY + 13 * HOUR + 25 * 60 },

  // Week 2 — pace picks up with afternoon volatility.
  { id: 'j-13', notional: 1000, openSec: 6 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 6 * SECONDS_PER_DAY + 10 * HOUR + 50 * 60 },
  { id: 'j-14', notional: 800, openSec: 6 * SECONDS_PER_DAY + 16 * HOUR, closeSec: 6 * SECONDS_PER_DAY + 16 * HOUR + 40 * 60 },
  { id: 'j-15', notional: 1300, openSec: 7 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 7 * SECONDS_PER_DAY + 10 * HOUR + 15 * 60 },
  { id: 'j-16', notional: 700, openSec: 8 * SECONDS_PER_DAY + 11 * HOUR, closeSec: 8 * SECONDS_PER_DAY + 11 * HOUR + 30 * 60 },
  { id: 'j-17', notional: 1100, openSec: 8 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 8 * SECONDS_PER_DAY + 15 * HOUR + 5 * 60 },
  { id: 'j-18', notional: 900, openSec: 9 * SECONDS_PER_DAY + 12 * HOUR, closeSec: 9 * SECONDS_PER_DAY + 12 * HOUR + 45 * 60 },
  { id: 'j-19', notional: 1400, openSec: 10 * SECONDS_PER_DAY + 9 * HOUR + 30 * 60, closeSec: 10 * SECONDS_PER_DAY + 10 * HOUR + 30 * 60 },
  { id: 'j-20', notional: 800, openSec: 11 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 11 * SECONDS_PER_DAY + 13 * HOUR + 35 * 60 },
  { id: 'j-21', notional: 1000, openSec: 12 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 12 * SECONDS_PER_DAY + 11 * HOUR },
  { id: 'j-22', notional: 1200, openSec: 13 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 13 * SECONDS_PER_DAY + 15 * HOUR + 20 * 60 },

  // Week 3 — bigger sizes after a topping-up.
  { id: 'j-23', notional: 1500, openSec: 15 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 15 * SECONDS_PER_DAY + 10 * HOUR },
  { id: 'j-24', notional: 1000, openSec: 16 * SECONDS_PER_DAY + 11 * HOUR + 30 * 60, closeSec: 16 * SECONDS_PER_DAY + 12 * HOUR + 30 * 60 },
  { id: 'j-25', notional: 1800, openSec: 17 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 17 * SECONDS_PER_DAY + 14 * HOUR + 30 * 60 },
  { id: 'j-26', notional: 900, openSec: 18 * SECONDS_PER_DAY + 9 * HOUR + 30 * 60, closeSec: 18 * SECONDS_PER_DAY + 10 * HOUR + 15 * 60 },
  { id: 'j-27', notional: 1300, openSec: 19 * SECONDS_PER_DAY + 14 * HOUR, closeSec: 19 * SECONDS_PER_DAY + 15 * HOUR },

  // Week 4 — winding down, scattered scalps.
  { id: 'j-28', notional: 1100, openSec: 22 * SECONDS_PER_DAY + 10 * HOUR, closeSec: 22 * SECONDS_PER_DAY + 10 * HOUR + 40 * 60 },
  { id: 'j-29', notional: 800, openSec: 23 * SECONDS_PER_DAY + 12 * HOUR, closeSec: 23 * SECONDS_PER_DAY + 12 * HOUR + 30 * 60 },
  { id: 'j-30', notional: 1500, openSec: 25 * SECONDS_PER_DAY + 9 * HOUR, closeSec: 25 * SECONDS_PER_DAY + 10 * HOUR + 15 * 60 },
  { id: 'j-31', notional: 1000, openSec: 27 * SECONDS_PER_DAY + 11 * HOUR, closeSec: 27 * SECONDS_PER_DAY + 12 * HOUR },
  { id: 'j-32', notional: 1200, openSec: 29 * SECONDS_PER_DAY + 13 * HOUR, closeSec: 29 * SECONDS_PER_DAY + 14 * HOUR + 10 * 60 },
]

const jin: Profile = {
  id: 'jin',
  name: 'Jin',
  handle: 'jin.scalp',
  address: '0x7e5d3b1f9a6c4e2d8b5f3a9c7e1d4b6f2a8c0e9d',
  vault: deriveVaultDays(jinEvents, WINDOW_DAYS),
  vaultEvents: jinEvents,
  trades: jinTrades,
}

export const profiles: Profile[] = [alex, maya, sora, ravi, jin]
