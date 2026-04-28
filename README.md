# 1. HyperUnicorn Points System

## Design at a glance

Under the hood, Uniswap V3 concentrated LP positions are the engine that produces HyperUnicorn's perpetual-style exposure — but that mechanic is abstracted away. From the user's perspective there are only two ways to interact with the protocol:

- **Lend a token to a vault** — Track A. The vault manages positions on the depositor's behalf.
- **Trade directly using a token as collateral** — Track B. Advanced users open and manage their own positions.

For simplicity, **USDC is the only token** in this implementation (vault deposits and trader collateral).

Both tracks share **one formula** around usd value:

```
points = floor(value_USD × usd_weight × time_held × boost × scale)
```

| Parameter     | What it represents                                                                                                  |
| ------------- | ------------------------------------------------------------------------------------------------------------------- |
| `value_USD`   | Dollar amount tied up in the protocol. Track A: **minimum** USDC balance observed during the epoch day (anti-JIT). Track B: open-position notional. |
| `usd_weight`  | Per-dollar protocol-value multiplier. Track A: baseline. Track B: premium (riskier + pays fees).                    |
| `time_held`   | How long `value_USD` was tied up, in **seconds**. Track A: a flat `86_400` per completed epoch day — the min-balance rule already handles JIT, so no modulo is needed. Track B: real elapsed seconds at hour granularity. |
| `boost`       | Per-pool / per-asset multiplicative bonus — lets the protocol steer rewards toward the pools and assets it wants to bootstrap. |
| `scale`       | Global integer factor calibrated so points land in a readable whole-number range (e.g. `$1 × 1 day` ≈ 100 points).  |
| `floor()`     | Rounds down so points are always integers — no fractional display.                                                  |

A user can participate in both tracks. Their total is simply:

```
user_points = points_track_A + points_track_B
```

Track A uses **daily** epochs. Depositors treat their points as a stable funds rate — their headline yield — so daily distribution keeps that rate predictable.

## Resistance to abuse

| Case                          | What it looks like                                                            | How the system resists it                                                                |
| ----------------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| JIT deposit at peak hours     | Depositor only stakes during the high-volume part of the day and withdraws the rest, harvesting points when capital is most useful | Track A scores each epoch day by the **minimum** balance observed across the day. A peak-hours-only deposit leaves the pre/post-deposit balance (often $0) as the min, so the day collapses to 0 points. Side-effect: any mid-day dip is punished to the dip level, and a depositor's first day earns 0 (min from epoch start = pre-deposit balance) — the intentional cost of JIT-proofing. |
| Wash trade / self-fill        | Trader opens and closes mirrored positions in seconds to inflate notional-time | Acceptable — every round-trip pays protocol fees, so the "abuse" is actually paid revenue |
| Sybil farming                 | One whale splits funds across many wallets                                    | Not a problem — formula is linear in `value × time`, so splitting earns the same total points as one wallet |

# 2. Mock activity data

### Constants

| Symbol            | Value | Unit                   | Notes                                                            |
| ----------------- | ----- | ---------------------- | ---------------------------------------------------------------- |
| `w_A`             | 1.0   | dimensionless          | Track A weight — baseline                                         |
| `w_B`             | 5.0   | dimensionless          | Track B weight — premium for active risk + fees paid             |
| `boost`           | 1.0   | dimensionless          | per-pool / per-asset multiplier — bumped above 1.0 to bootstrap a target pool or asset |
| `scale`           | 100 / 86_400 | points / (USD · s) | calibrates `$1 × 1 day ≈ 100 points`                                |

Sanity check: `$1 × 1.0 × 86_400 s × 1.0 × (100 / 86_400) = 100 points` ✓

### Track A — vault deposits (USDC)

**Per-epoch credit** — each completed epoch day `d` contributes `min_balance_d × w_A × 86_400 × boost × scale`, where `min_balance_d` is the lowest USDC balance observed across day `d`. Withdrawals (full or partial) drag the min down, so JIT deposits at peak hours collapse to 0.

Four users observed over a 3-day window.

| User                       | Day 1 (min balance) | Day 2 (min)         | Day 3 (min)         | Track A points |
| -------------------------- | ------------------- | ------------------- | ------------------- | -------------- |
| Alice (steady)             | $1,000              | $1,000              | $1,000              | 300,000        |
| Carol (ramping, end-of-day deposits) | $500       | $1,000              | $2,000              | 350,000        |
| Dora (partial withdraw mid-day 2) | $10,000      | $1 (started $10K, withdrew to $1) | $1 | 1,000,200      |
| Bob (JIT 8h day 1)         | $0 (pre/post = 0)   | $0                  | $0                  | **0**          |

Worked examples — Alice (steady $1,000): `1,000 × 1.0 × (86,400 × 3) × 1.0 × (100/86,400) = 300,000`. Carol: `(500 + 1,000 + 2,000) × 1.0 × 86,400 × 1.0 × (100/86,400) = 350,000`. Dora carries $10,000 in from a prior epoch and holds it through day 1 (`10,000 × 86,400 × (100/86,400) = 1,000,000`), then mid-day 2 withdraws down to $1 — the min for day 2 is $1, scoring just `100`, and day 3 stays at $1 for another `100`. Total: `1,000,200`. The 30,000× drop in day-2 reward despite starting day 2 at full balance is the min rule's bite. Bob deposited $10,000 for 8h then withdrew on day 1 — min for the day is $0 (pre-deposit balance), so the day scores 0.

### Track B — direct trades (USDC collateral)

Same window, **no modulo** — `held` runs at hour granularity, not bound to whole-day chunks like Track A. `points = notional × w_B × held_s × boost × scale`.

| User             | Notional   | Held   | Track B points |
| ---------------- | ---------- | ------ | -------------- |
| Dave (held)      | $500       | 10 h   | 104,166        |
| Eve (intraday)   | $2,000     | 6 h    | 250,000        |

Worked examples — Dave: `floor(500 × 5.0 × (10 × 3,600) × 1.0 × (100/86,400)) = 104,166`. Eve: `2,000 × 5.0 × (6 × 3,600) × 1.0 × (100/86,400) = 250,000`.

# Run locally

```bash
git clone https://github.com/Marco75116/panoptic-task-home.git
cd panoptic-task-home
bun i
bun dev
```

Then open [http://localhost:3000](http://localhost:3000).
